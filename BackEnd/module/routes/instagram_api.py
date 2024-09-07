from flask import Blueprint, request, jsonify, redirect
import requests
import os
from datetime import datetime, timedelta
from bson import ObjectId
from ..classes.User import User
import logging

instagram_bp = Blueprint('instagram', __name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Configuration
CLIENT_ID = os.getenv('INSTAGRAM_CLIENT_ID')
CLIENT_SECRET = os.getenv('INSTAGRAM_CLIENT_SECRET')
REDIRECT_URI = os.getenv('INSTAGRAM_REDIRECT_URI')
BASE_URL = 'https://api.instagram.com'
GRAPH_URL = 'https://graph.instagram.com'

user_manager = User()

# Store session data in a server-side dictionary
session_store = {}

def generate_auth_url(username, session_id):
    scope = 'business_basic,business_manage_messages,business_manage_comments,business_content_publish'
    return (f"https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1"
            f"&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
            f"&scope={scope}&state={session_id}")


def is_token_valid(user_data):
    token = user_data.get('instagram_token')
    expiry = user_data.get('instagram_token_expiry')
    return token and expiry and datetime.now() < expiry

def fetch_short_lived_token(code):
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
    exchange_url = f"{GRAPH_URL}/access_token"
    params = {
        'grant_type': 'ig_exchange_token',
        'client_secret': CLIENT_SECRET,
        'access_token': short_lived_token
    }
    response = requests.get(exchange_url, params=params)
    return response.json().get('access_token') if response.status_code == 200 else None

def fetch_user_info(access_token):
    user_info_url = f"{GRAPH_URL}/me?fields=id,username,account_type&access_token={access_token}"
    response = requests.get(user_info_url)
    return response.json()

@instagram_bp.route('/api/instagram/login', methods=['POST'])
def login():
    username = request.json.get('username')
    user_id = request.json.get('user_id')
    if not username or not user_id:
        return jsonify({'error': 'Username and user_id are required'}), 400

    # Generate a unique session ID and store it in session_store
    session_id = str(ObjectId())
    session_store[session_id] = {'username': username, 'user_id': user_id}

    auth_url = generate_auth_url(username, session_id)
    logging.debug(f"Generated auth URL: {auth_url}")

    return jsonify({'auth_url': auth_url, 'session_id': session_id})

@instagram_bp.route('/api/instagram/callback')
def callback():
    code = request.args.get('code')
    session_id = request.args.get('state')

    if not code or not session_id:
        logging.error('Missing code or session_id.')
        return jsonify({'error': 'Authorization failed due to missing code or session_id.'}), 400

    session_data = session_store.get(session_id)
    if not session_data:
        logging.error('Session data not found for session_id.')
        return jsonify({'error': 'User session not found.'}), 400

    username = session_data.get('username')
    user_id = session_data.get('user_id')
    if not username or not user_id:
        logging.error('Session username or user_id not found.')
        return jsonify({'error': 'Session data incomplete.'}), 400

    short_lived_token = fetch_short_lived_token(code)
    if not short_lived_token:
        return jsonify({'error': 'Failed to get short-lived access token.'}), 400

    long_lived_token = exchange_for_long_lived_token(short_lived_token)
    if not long_lived_token:
        return jsonify({'error': 'Failed to get long-lived access token.'}), 400

    user_info = fetch_user_info(long_lived_token)
    ig_user_id = user_info['id']
    ig_username = user_info['username']

    # Call the update_instagram_token method on the user_manager instance
    result = user_manager.update_instagram_token(ObjectId(user_id), long_lived_token, ig_user_id, ig_username)
    
    if "successfully" not in result.lower():
        if "already connected" in result.lower():
            logging.warning(f"Instagram account already connected: {result}")
            return jsonify({'error': 'This Instagram account is already connected to another user in our system.'}), 409
        else:
            logging.error(f"Failed to update Instagram token: {result}")
            return jsonify({'error': f'Failed to update Instagram token: {result}'}), 500

    # Clear the session data after successful login
    session_store.pop(session_id, None)

    # Redirect to a frontend route with success message
    return redirect(f"http://localhost:8080/dashboard?instagram_connected=true")
