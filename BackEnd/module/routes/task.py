import os
import logging
from flask import Blueprint, request, jsonify, session, send_from_directory, abort
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image
from ..classes.User import User
import time
from threading import Thread

task_bp = Blueprint('task', __name__)
logging.basicConfig(level=logging.DEBUG)
user_manager = User()



UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Util functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def correct_image_aspect_ratio(image_path, target_ratio):
    with Image.open(image_path) as img:
        width, height = img.size
        current_ratio = width / height
        logging.debug(f"Current image size: {width}x{height}, aspect ratio: {current_ratio}")

        if abs(current_ratio - target_ratio) > 0.01:  # Allow for small margin of error
            if current_ratio > target_ratio:
                # Crop the sides of the image
                new_width = int(height * target_ratio)
                left = (width - new_width) // 2
                right = (width + new_width) // 2
                crop_area = (left, 0, right, height)
            else:
                # Crop the top and bottom of the image
                new_height = int(width / target_ratio)
                top = (height - new_height) // 2
                bottom = (height + new_height) // 2
                crop_area = (0, top, width, bottom)
            
            img = img.crop(crop_area)
            logging.debug(f"Image cropped to: {img.size}, new aspect ratio: {img.width / img.height}")

        # Resize to ensure it fits within Instagram's dimensions
        img = resize_image(img, target_ratio)

        # Save the image
        img = img.convert("RGB")
        img.save(image_path, format="JPEG", quality=95)
        logging.debug(f"Final image saved: {img.size}, aspect ratio: {img.width / img.height}")

def resize_image(img, target_ratio):
    if target_ratio == 4/5:
        max_width, max_height = 1080, 1350
    elif target_ratio == 9/16:
        max_width, max_height = 1080, 1920
    else:
        max_width, max_height = 1080, 1080  # Default square

    width, height = img.size
    logging.debug(f"Original image size: {width}x{height}")

    # Calculate the resize ratio to maintain aspect ratio
    ratio = min(max_width / width, max_height / height)
    new_size = (int(width * ratio), int(height * ratio))
    img = img.resize(new_size, Image.LANCZOS)
    logging.debug(f"Image resized to: {img.size}")
    
    return img

def save_media_to_storage(file, media_type):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        logging.debug(f"Attempting to save file to: {filepath}")
        
        try:
            file.save(filepath)
            
            if filename.lower().endswith(('png', 'jpg', 'jpeg')):
                logging.debug(f"Processing image for media type: {media_type}")
                if media_type in ['post', 'photo']:
                    correct_image_aspect_ratio(filepath, 4/5)  # 4:5 for portrait posts/photos
                elif media_type in ['story', 'reel']:
                    correct_image_aspect_ratio(filepath, 9/16)  # 9:16 for stories/reels
                else:
                    correct_image_aspect_ratio(filepath, 1)  # 1:1 for square posts

                # Log final image size and path
                with Image.open(filepath) as img:
                    logging.debug(f"Final image size: {img.size}, aspect ratio: {img.width / img.height}, path: {filepath}")

            if os.path.exists(filepath):
                logging.info(f"File saved successfully: {filepath}")
                return filename  # Return only the filename
            else:
                logging.error(f"File does not exist after attempted save: {filepath}")
                return None
        except Exception as e:
            logging.error(f"Error saving file: {str(e)}")
            return None
    logging.warning("Invalid file or filename")
    return None

# Routes
@task_bp.route('/api/img/<filename>')
def serve_image(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        abort(404)

@task_bp.route('/api/instagram/schedule_post', methods=['POST'])
def schedule_post():
    try:
        user_id = session.get('user_id')
        logging.debug(f"User ID from session: {user_id}")
        logging.debug(f"Request files: {request.files}")
        logging.debug(f"Request form data: {request.form}")

        if not user_id or not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid or missing user_id. Please log in again.'}), 401

        if 'media' not in request.files:
            return jsonify({'error': 'No media file provided'}), 400

        media_type = request.form.get('media_type')
        caption = request.form.get('caption')
        scheduled_time = request.form.get('scheduled_time')

        if not media_type or not scheduled_time:
            return jsonify({'error': 'Media type and scheduled time are required.'}), 400

        user = user_manager.get_user(user_id)
        if user is None:
            return jsonify({'error': 'User not found.'}), 404

        plan = user.get('plan', 'default')
        if plan == 'default':
            pending_posts = user_manager.get_pending_posts(user_id)
            if len(pending_posts) > 0:
                return jsonify({'error': 'Default plan users can only schedule one post at a time.'}), 403

        media_file = request.files['media']
        filename = save_media_to_storage(media_file, media_type)
        if filename is None:
            return jsonify({'error': 'Failed to save media file'}), 500

        post_data = {
            'user_id': ObjectId(user_id),
            'media_type': media_type,
            'caption': caption,
            'media_path': filename,  # Store only the filename
            'scheduled_time': datetime.fromisoformat(scheduled_time),
            'status': 'scheduled'
        }
        post_id = user_manager.save_scheduled_post(post_data)

        return jsonify({'message': 'Post scheduled successfully', 'post_id': str(post_id)})

    except Exception as e:
        logging.error(f"Error in schedule_post: {e}")
        return jsonify({'error': str(e)}), 500

@task_bp.route('/api/instagram/get_pending_posts', methods=['GET'])
def get_pending_posts():
    try:
        user_id = session.get('user_id')
        if not user_id or not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid or missing user_id. Please log in again.'}), 401

        pending_posts = user_manager.get_pending_posts(user_id)
        return jsonify({'pending_posts': pending_posts})

    except Exception as e:
        logging.error(f"Error in get_pending_posts: {e}")
        return jsonify({'error': str(e)}), 500

@task_bp.route('/api/instagram/cancel_post/<post_id>', methods=['POST'])
def cancel_post(post_id):
    try:
        user_id = session.get('user_id')
        if not user_id or not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid or missing user_id. Please log in again.'}), 401

        post = user_manager.get_scheduled_post(post_id)
        if not post:
            return jsonify({'error': 'Post not found.'}), 404

        if str(post['user_id']) != user_id:
            return jsonify({'error': 'Unauthorized to cancel this post.'}), 403

        user_manager.update_post_status(post_id, 'cancelled')
        return jsonify({'message': 'Post cancelled successfully'})

    except Exception as e:
        logging.error(f"Error in cancel_post: {e}")
        return jsonify({'error': str(e)}), 500

# Background scheduler
def background_scheduler():
    logging.info("Starting background scheduler...")
    while True:
        try:
            now = datetime.now()
            scheduled_posts = user_manager.get_scheduled_posts_ready(now)
            logging.debug(f"Found {len(scheduled_posts)} posts ready to be published.")
            
            for post in scheduled_posts:
                logging.info(f"Scheduling post with ID: {post['_id']}")
                schedule_instagram_post(str(post['_id']))
            
            time.sleep(60)
        except Exception as e:
            logging.error(f"Error in background_scheduler: {e}")

def schedule_instagram_post(post_id):
    try:
        post = user_manager.get_scheduled_post(post_id)
        if not post:
            logging.error(f"Scheduled post {post_id} not found.")
            return

        user = user_manager.get_user(post['user_id'])
        if not user:
            logging.error(f"User {post['user_id']} not found for post {post_id}.")
            return

        if not user_manager.is_token_valid(user):
            logging.error(f"Invalid or expired token for user {post['user_id']}.")
            user_manager.update_post_status(post_id, 'failed')
            return

        logging.info(f"Publishing post {post_id} for user {user['username']}...")
        result = user_manager.publish_post(post_id)
        logging.info(f"Post {post_id} publishing result: {result}")

        if "Post published successfully" in result:
            user_manager.update_post_status(post_id, 'published')
            logging.info(f"Post {post_id} marked as published.")

            # Remove the media file after posting
            filename = post.get('media_path')
            if filename:
                absolute_path = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.exists(absolute_path):
                    os.remove(absolute_path)
                    logging.info(f"Removed media file: {absolute_path}")
                else:
                    logging.warning(f"Media file not found for removal: {absolute_path}")
        else:
            user_manager.update_post_status(post_id, 'failed')
            logging.error(f"Failed to publish post {post_id}: {result}")

    except Exception as e:
        logging.error(f"Error in schedule_instagram_post: {e}")
        user_manager.update_post_status(post_id, 'failed')

# Start the background scheduler thread
scheduler_thread = Thread(target=background_scheduler, daemon=True)
scheduler_thread.start()
