# /path/to/your/blueprint.py

from flask import Blueprint, redirect, request, jsonify
import requests
import os
from datetime import datetime, timedelta
from ..classes.User import User

instagram_bp = Blueprint('instagram', __name__)

# Configuration
CLIENT_ID = os.getenv('INSTAGRAM_CLIENT_ID')
CLIENT_SECRET = os.getenv('INSTAGRAM_CLIENT_SECRET')
REDIRECT_URI = os.getenv('INSTAGRAM_REDIRECT_URI')
BASE_URL = 'https://api.instagram.com'
GRAPH_URL = 'https://graph.instagram.com'

user_manager = User()

def generate_auth_url(user_id):
    """Generates Instagram OAuth URL."""
    scope = 'business_basic,business_manage_messages,business_manage_comments,business_content_publish'
    return (f"https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1"
            f"&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
            f"&scope={scope}&state={user_id}")

def update_instagram_token(user_id, token):
    """Updates the Instagram token for the user in the database."""
    expiry = datetime.now() + timedelta(days=60)
    update_data = {
        "instagram_token": token,
        "instagram_token_expiry": expiry
    }
    return user_manager.update_user(user_id, update_data)

def is_token_valid(user_data):
    """Checks if the Instagram token is valid."""
    token = user_data.get('instagram_token')
    expiry = user_data.get('instagram_token_expiry')
    return token and expiry and datetime.now() < expiry

def fetch_short_lived_token(code):
    """Fetches short-lived access token from Instagram."""
    token_url = f"{BASE_URL}/oauth/access_token"
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'code': code
    }
    response = requests.post(token_url, data=token_data)
    return response.json().get('access_token')

def exchange_for_long_lived_token(short_lived_token):
    """Exchanges short-lived token for a long-lived token."""
    exchange_url = f"{GRAPH_URL}/access_token"
    params = {
        'grant_type': 'ig_exchange_token',
        'client_secret': CLIENT_SECRET,
        'access_token': short_lived_token
    }
    response = requests.get(exchange_url, params=params)
    return response.json().get('access_token') if response.status_code == 200 else None

def fetch_user_info(access_token):
    """Fetches user information from Instagram."""
    user_info_url = f"{GRAPH_URL}/me?fields=id,username,account_type&access_token={access_token}"
    response = requests.get(user_info_url)
    return response.json()

def create_media_container(ig_user_id, access_token, media_type, media_url, caption):
    """Creates a media container on Instagram."""
    endpoint = f"{GRAPH_URL}/{ig_user_id}/media"
    params = {
        'access_token': access_token,
        'caption': caption,
        'media_type': media_type.upper(),
    }
    
    if media_type.upper() == 'IMAGE':
        params['image_url'] = media_url
    elif media_type.upper() == 'VIDEO':
        params['video_url'] = media_url

    response = requests.post(endpoint, params=params)
    return response.json().get('id') if response.status_code == 200 else None

def publish_media_container(ig_user_id, access_token, container_id):
    """Publishes the media container on Instagram."""
    endpoint = f"{GRAPH_URL}/{ig_user_id}/media_publish"
    params = {
        'access_token': access_token,
        'creation_id': container_id
    }
    response = requests.post(endpoint, params=params)
    return response.json().get('id') if response.status_code == 200 else None

def refresh_access_token(user_id, instagram_token):
    """Refreshes the Instagram access token."""
    refresh_url = f"{GRAPH_URL}/refresh_access_token"
    params = {
        'grant_type': 'ig_refresh_token',
        'access_token': instagram_token
    }
    response = requests.get(refresh_url, params=params)
    return response.json().get('access_token') if response.status_code == 200 else None

@instagram_bp.route('/api/instagram/login', methods=['POST'])
def login():
    """Handles the login request and generates Instagram OAuth URL."""
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    auth_url = generate_auth_url(user_id)
    return jsonify({'auth_url': auth_url})

@instagram_bp.route('/api/instagram/callback')
def callback():
    """Handles the callback from Instagram OAuth."""
    code = request.args.get('code')
    user_id = request.args.get('state')
    if not code or not user_id:
        return 'Authorization failed.', 400

    short_lived_token = fetch_short_lived_token(code)
    if not short_lived_token:
        return 'Failed to get short-lived access token.', 400

    long_lived_token = exchange_for_long_lived_token(short_lived_token)
    if not long_lived_token:
        return 'Failed to get long-lived access token.', 400

    user_info = fetch_user_info(long_lived_token)
    result = update_instagram_token(user_id, long_lived_token)
    if "successfully" not in result:
        return jsonify({'error': 'Failed to update Instagram token'}), 500

    return jsonify({'message': 'Instagram authentication successful', 'user_id': user_id})

@instagram_bp.route('/api/instagram/publish', methods=['POST'])
def publish():
    """Publishes media to Instagram."""
    user_id = request.json.get('user_id')
    media_type = request.json.get('media_type')
    media_url = request.json.get('media_url')
    caption = request.json.get('caption')

    user_data = user_manager.get_user(user_id)
    if not user_data:
        return jsonify({'error': 'User not found'}), 400

    # Validate the Instagram token before proceeding
    if not is_token_valid(user_data):
        return jsonify({'error': 'Instagram token invalid, please re-login.'}), 400

    user_info = fetch_user_info(user_data['instagram_token'])
    ig_user_id = user_info['id']

    # Create and publish the media container
    container_id = create_media_container(ig_user_id, user_data['instagram_token'], media_type, media_url, caption)
    if not container_id:
        return jsonify({'error': 'Failed to create media container'}), 500

    media_id = publish_media_container(ig_user_id, user_data['instagram_token'], container_id)
    if not media_id:
        return jsonify({'error': 'Failed to publish media'}), 500

    return jsonify({'success': True, 'media_id': media_id})

@instagram_bp.route('/api/instagram/refresh_token', methods=['POST'])
def refresh_token():
    """Refreshes the Instagram token for a user."""
    user_id = request.json.get('user_id')
    user_data = user_manager.get_user(user_id)
    if not user_data:
        return jsonify({'error': 'User not found'}), 400

    if not user_data.get('instagram_token'):
        return jsonify({'error': 'No Instagram token found for user'}), 400

    new_token = refresh_access_token(user_id, user_data['instagram_token'])
    if new_token:
        result = update_instagram_token(user_id, new_token)
        if "successfully" in result:
            return jsonify({'message': 'Token refreshed successfully'})
        return jsonify({'error': 'Failed to update refreshed token'}), 500
    
    return jsonify({'error': 'Failed to refresh token'}), 500
