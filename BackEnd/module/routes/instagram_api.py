from flask import Flask, redirect, request, jsonify
import requests
import os

app = Flask(__name__)

# Configuration
CLIENT_ID = os.getenv('INSTAGRAM_CLIENT_ID')
CLIENT_SECRET = os.getenv('INSTAGRAM_CLIENT_SECRET')
REDIRECT_URI = '/callback'
BASE_URL = 'https://api.instagram.com'
GRAPH_URL = 'https://graph.instagram.com'

# Predefined test values
TEST_ACCESS_TOKEN = ''  # Replace with a valid access token
TEST_MEDIA_URL = r"https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Wiki_Test_Image.jpg/800px-Wiki_Test_Image.jpg"
TEST_CAPTION = 'This is a test post from my app!'

@app.route('/')
def home():
    return '''
    <h1>Instagram Content Publisher</h1>
    <a href="/login">Login with Instagram</a>
    <br><br>
    <a href="/test_publish">Test Publish (No Body Required)</a>
    '''

@app.route('/login')
def login():
    auth_url = f"https://www.instagram.com/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=user_profile,user_media&response_type=code"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return 'Authorization failed.', 400

    token_url = f"{BASE_URL}/oauth/access_token"
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'code': code
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    
    access_token = token_json.get('access_token')
    if not access_token:
        return 'Failed to get access token.', 400

    user_info = get_user_info(access_token)
    return jsonify(user_info)

def get_user_info(access_token):
    user_info_url = f"{GRAPH_URL}/me?fields=id,username,account_type&access_token={access_token}"
    user_info_response = requests.get(user_info_url)
    return user_info_response.json()

@app.route('/test_publish', methods=['GET'])
def test_publish():
    user_info = get_user_info(TEST_ACCESS_TOKEN)
    ig_user_id = user_info['id']

    # Step 1: Create media container
    container_id = create_media_container(ig_user_id, TEST_ACCESS_TOKEN, 'IMAGE', TEST_MEDIA_URL, TEST_CAPTION)
    if not container_id:
        return jsonify({'error': 'Failed to create media container'}), 500

    # Step 2: Publish the container
    media_id = publish_container(ig_user_id, TEST_ACCESS_TOKEN, container_id)
    if not media_id:
        return jsonify({'error': 'Failed to publish media'}), 500

    return jsonify({'success': True, 'media_id': media_id})

def create_media_container(ig_user_id, access_token, media_type, media_url, caption):
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
    else:
        return None

    response = requests.post(endpoint, params=params)
    if response.status_code == 200:
        return response.json().get('id')
    return None

def publish_container(ig_user_id, access_token, container_id):
    endpoint = f"{GRAPH_URL}/{ig_user_id}/media_publish"
    params = {
        'access_token': access_token,
        'creation_id': container_id
    }

    response = requests.post(endpoint, params=params)
    if response.status_code == 200:
        return response.json().get('id')
    return None

if __name__ == '__main__':
    app.run(debug=True)