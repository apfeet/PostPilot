import re
from dotenv import load_dotenv
from MongoDB_pool import MongoDBPool
from bson import ObjectId
import os
from datetime import datetime, timedelta, timezone
import logging
import requests
import hashlib
import pytz

class User:
    def __init__(self):
        self._load_environment()
        self._connect_to_database()
        logging.basicConfig(level=logging.INFO)
        self.BASE_URL = "https://67fc-87-3-102-188.ngrok-free.app/api/img/"

    def _load_environment(self):
        load_dotenv()
        self.db_user = os.getenv('DB_USER')
        self.db_password = os.getenv('DB_PASSWORD')
        self.MONGODB_HOST = os.getenv('MONGODB_HOST')

    def _connect_to_database(self):
        mongo_pool = MongoDBPool()
        self.db = mongo_pool.get_database()
        self.users_collection = self.db['users']
        self.posts_collection = self.db['scheduled_posts']

    def create_user(self, username, email, password, plan="default"):
        if self._user_exists(username, email):
            return "User already exists."

        password_check = self._check_password_integrity(password, password)
        if password_check is not True:
            return password_check

        hashed_password = self._hash_password(password)
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "connected_account": [],
            "plan": plan,
            "created_at": datetime.now()
        }
        self.users_collection.insert_one(user_data)
        return "User created successfully."

    def _user_exists(self, username, email):
        return self.users_collection.find_one({"$or": [{"username": username}, {"email": email}]}) is not None

    def _check_password_integrity(self, password, check_password):
        if password != check_password:
            return "Passwords do not match."
        if len(password) < 8:
            return "Password must be at least 8 characters long."
        if not re.search(r"[A-Z]", password):
            return "Password must contain at least one uppercase letter."
        if not re.search(r"[a-z]", password):
            return "Password must contain at least one lowercase letter."
        if not re.search(r"\d", password):
            return "Password must contain at least one digit."
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return "Password must contain at least one special character."
        return True

    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def delete_user(self, username):
        result = self.users_collection.delete_one({"username": username})
        if result.deleted_count > 0:
            return f"User with username '{username}' deleted."
        else:
            return f"User with username '{username}' not found."

    def get_user(self, user_id):
        user = self.users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Ensure connected_account is always a list
            user['connected_account'] = user.get('connected_account', [])
            return user
        return None

    def update_user(self, username, update_data):
        if not self._user_exists(username, update_data.get('email', '')):
            return f"User with username '{username}' not found."
        
        result = self.users_collection.update_one({"username": username}, {"$set": update_data})
        if result.modified_count > 0:
            return f"User with username '{username}' updated successfully."
        else:
            return f"No changes made to user with username '{username}'."

    def update_instagram_token(self, user_id, token, ig_user_id, ig_username):
        try:
            logging.info(f"Attempting to update Instagram token for user {user_id}")
            
            existing_user = self.users_collection.find_one({"instagram_user_id": ig_user_id})
            
            if existing_user:
                if str(existing_user['_id']) != str(user_id):
                    logging.warning(f"Instagram account with user ID {ig_user_id} is already connected to another user")
                    return "Instagram account already connected to another user"
                
                if existing_user['instagram_username'] != ig_username:
                    logging.info(f"Updating Instagram username for user {user_id} from {existing_user['instagram_username']} to {ig_username}")
                    self.users_collection.update_one(
                        {"_id": ObjectId(user_id)},
                        {"$set": {"instagram_username": ig_username}}
                    )

            expiry = datetime.now() + timedelta(days=60)
            update_result = self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "instagram_token": token,
                        "instagram_token_expiry": expiry,
                        "instagram_user_id": ig_user_id,
                        "instagram_username": ig_username  
                    },
                    "$addToSet": {
                        "connected_account": "instagram"
                    }
                }
            )
            
            logging.info(f"Update result: {update_result.raw_result}")
            
            if update_result.modified_count == 1:
                logging.info("Token and Instagram username updated successfully")
                return "Token updated successfully"
            else:
                logging.warning(f"No document was updated for user {user_id}")
                return "No document was updated"
        except Exception as e:
            logging.error(f"Error updating Instagram token for user {user_id}: {str(e)}")
            return f"Error updating token: {str(e)}"

    def get_pending_posts(self, user_id):
        posts = list(self.posts_collection.find({
            "user_id": ObjectId(user_id),
            "status": "scheduled"
        }))
        # Convert ObjectId to string for JSON serialization
        for post in posts:
            post['_id'] = str(post['_id'])
            post['user_id'] = str(post['user_id'])
        return posts

    def save_scheduled_post(self, post_data):
        # Ensure scheduled_time is timezone-aware
        if 'scheduled_time' in post_data:
            if isinstance(post_data['scheduled_time'], str):
                post_data['scheduled_time'] = datetime.fromisoformat(post_data['scheduled_time'].replace('Z', '+00:00')).replace(tzinfo=timezone.utc)
            elif isinstance(post_data['scheduled_time'], datetime) and post_data['scheduled_time'].tzinfo is None:
                post_data['scheduled_time'] = post_data['scheduled_time'].replace(tzinfo=timezone.utc)

        result = self.posts_collection.insert_one(post_data)
        return result.inserted_id

    def get_scheduled_post(self, post_id):
        post = self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if post:
            post['scheduled_time'] = self._ensure_timezone_aware(post['scheduled_time'])
        return post

    def update_post_status(self, post_id, new_status):
        return self.posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"status": new_status}}
        )

    def is_token_valid(self, user):
        token_expiry = user.get("instagram_token_expiry")
        if token_expiry:
            token_expiry = self._ensure_timezone_aware(token_expiry)
            return datetime.now(timezone.utc) < token_expiry
        return False

    def get_scheduled_posts_ready(self, current_time):
        current_time = self._ensure_timezone_aware(current_time)
        all_posts = list(self.posts_collection.find({"status": "scheduled"}))
        ready_posts = []
        
        logging.info(f"Current time (UTC): {current_time}")
        logging.info(f"Total scheduled posts: {len(all_posts)}")
        
        for post in all_posts:
            post_time = self._ensure_timezone_aware(post['scheduled_time'])
            
            logging.info(f"Post ID: {post['_id']}, Scheduled time (UTC): {post_time}, Current time (UTC): {current_time}")
            
            if post_time <= current_time:
                ready_posts.append(post)
                logging.info(f"Post is ready to be published")
            else:
                logging.info(f"Post is not yet ready to be published")
        
        logging.info(f"Posts ready to be published: {len(ready_posts)}")
        return ready_posts

    def publish_post(self, post_id):
        post = self.get_scheduled_post(post_id)
        if not post:
            return "Post not found."

        if post['status'] == 'published':
            return "Post has already been published."

        user = self.get_user(post['user_id'])
        if not user:
            return "User not found."

        if not self.is_token_valid(user):
            return "Instagram token is invalid or expired."

        scheduled_time = self._ensure_timezone_aware(post['scheduled_time'])
        current_time = datetime.now(timezone.utc)
        logging.info(f"Current time (UTC): {current_time}, Scheduled time (UTC): {scheduled_time}")

        if current_time < scheduled_time:
            return f"Post is scheduled for future publication at {scheduled_time.isoformat()}"

        # Step 1: Create Media Container
        container_id = self._create_media_container(user, post)
        if not container_id:
            return "Failed to create media container."

        # Step 2: Publish the Container
        publish_result = self._publish_media_container(user, container_id)
        if not publish_result:
            return "Failed to publish media."

        # Update the status in the database
        self.update_post_status(post_id, "published")
        self.posts_collection.delete_one({"_id": ObjectId(post_id)})

        return f"Post published successfully. Instagram Media ID: {publish_result}"

    def _create_media_container(self, user, post):
        ig_user_id = user['instagram_user_id']
        access_token = user['instagram_token']

        # Determine media type
        if post['media_type'] == 'photo':
            media_type = "IMAGE"
            url_key = 'image_url'
        elif post['media_type'] == 'video':
            media_type = "REELS"  # Use REELS for videos as per Instagram's updated API requirements
            url_key = 'video_url'
        else:
            logging.error(f"Unsupported media type: {post['media_type']}")
            return None

        # Construct the media URL
        media_url = self.BASE_URL + post['media_path']
        
        params = {
            'media_type': media_type,
            url_key: media_url,
            'caption': post.get('caption', ''),
            'access_token': access_token
        }

        response = requests.post(f"https://graph.instagram.com/v20.0/{ig_user_id}/media", params=params)
        if response.status_code == 200:
            container_id = response.json().get('id')
            logging.info(f"Media container created successfully with ID: {container_id}")
            return container_id
        else:
            logging.error(f"Failed to create media container: {response.text}")
            return None

    def _publish_media_container(self, user, container_id):
        ig_user_id = user['instagram_user_id']
        access_token = user['instagram_token']

        params = {
            'creation_id': container_id,
            'access_token': access_token
        }

        response = requests.post(f"https://graph.instagram.com/v20.0/{ig_user_id}/media_publish", params=params)
        if response.status_code == 200:
            media_id = response.json().get('id')
            logging.info(f"Media published successfully with Instagram Media ID: {media_id}")
            return media_id
        else:
            logging.error(f"Failed to publish media: {response.text}")
            return None

    def check_publishing_limit(self, user_id):
        user = self.get_user(user_id)
        if not user:
            return "User not found."

        ig_user_id = user['instagram_user_id']
        access_token = user['instagram_token']

        params = {
            'fields': 'quota_usage,rate_limit_settings',
            'access_token': access_token
        }

        response = requests.get(f"https://graph.instagram.com/v20.0/{ig_user_id}/content_publishing_limit", params=params)
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(f"Failed to check publishing limit: {response.text}")
            return None

    def process_scheduled_posts(self):
        current_time = datetime.now(timezone.utc)
        ready_posts = self.get_scheduled_posts_ready(current_time)

        for post in ready_posts:
            result = self.publish_post(post['_id'])
            logging.info(f"Post {post['_id']} publishing result: {result}")

    def authenticate_user(self, username, password):
        user = self.users_collection.find_one({"username": username})
        if user and user['password'] == self._hash_password(password):
            return user
        return None

    def change_password(self, user_id, old_password, new_password):
        user = self.get_user(user_id)
        if not user:
            return "User not found."

        if user['password'] != self._hash_password(old_password):
            return "Incorrect old password."

        password_check = self._check_password_integrity(new_password, new_password)
        if password_check is not True:
            return password_check

        hashed_new_password = self._hash_password(new_password)
        result = self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": hashed_new_password}}
        )

        if result.modified_count > 0:
            return "Password changed successfully."
        else:
            return "Failed to change password."

    def _ensure_timezone_aware(self, dt):
        if isinstance(dt, str):
            dt = datetime.fromisoformat(dt.replace('Z', '+00:00'))
        if isinstance(dt, datetime):
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            else:
                dt = dt.astimezone(timezone.utc)
        return dt
