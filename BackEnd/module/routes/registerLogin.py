from flask import Blueprint, request, jsonify, session, current_app
from google.oauth2 import id_token
from google.auth.transport import requests
from module.classes.User import User
import re
import os
import logging
import time
from bson import ObjectId

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create a User instance
user_manager = User()

# Create a Blueprint instance
auth_bp = Blueprint('auth', __name__)

def save_session(user_id):
    session['user_id'] = str(user_id)
    session.modified = True
    current_app.session_interface.save_session(current_app, session, current_app.make_response(''))
    logger.debug(f"Session saved. User ID: {user_id}")

@auth_bp.route('/api/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')

    if not token:
        return jsonify({"error": "Token is required"}), 400

    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        CLIENT_ID = os.getenv('VITE_GOOGLE_AUTH_CLIENT_ID')
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # ID token is valid. Extract user information
        email = idinfo['email']
        username = email.split('@')[0]  # Generate username from email

        # Check if the user already exists
        existing_user = user_manager.users_collection.find_one({"email": email})

        if existing_user:
            save_session(existing_user['_id'])
            return jsonify({"message": "Login successful", "username": existing_user.get('username', email)}), 200
        else:
            # Register the user
            result = user_manager.create_user(username, email, token)  # Save token as password without hashing

            if result == "User created successfully.":
                new_user = user_manager.users_collection.find_one({"email": email})
                if new_user:
                    save_session(new_user['_id'])
                    return jsonify({"message": "Registration and login successful"}), 201
                else:
                    logger.error("User created but not found in immediate lookup")
                    return jsonify({"error": "User creation error"}), 500
            else:
                return jsonify({"error": result}), 400

    except ValueError:
        # Invalid token
        return jsonify({"error": "Invalid token"}), 401

@auth_bp.route('/api/register-login', methods=['POST'])
def register_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = user_manager.users_collection.find_one({"email": email})

    if existing_user:
        # Login
        if existing_user['password'] == password:  # Compare passwords directly
            save_session(existing_user['_id'])
            return jsonify({"message": "Login successful", "username": existing_user['username']}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        # Register
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        password_validation = is_valid_password(password)
        if not password_validation["status"]:
            return jsonify({"error": password_validation["message"]}), 400

        # Generate a username from the email
        username = email.split('@')[0]

        result = user_manager.create_user(username, email, password)  # Save password without hashing

        if result == "User created successfully.":
            new_user = user_manager.users_collection.find_one({"email": email})
            if new_user:
                save_session(new_user['_id'])
                return jsonify({"message": "Registration successful"}), 201
            else:
                logger.error("User created but not found in immediate lookup")
                return jsonify({"error": "User creation error"}), 500
        else:
            return jsonify({"error": result}), 400

@auth_bp.route('/api/check_user_status', methods=['GET'])
def check_user_status():
    logger.debug(f"Checking user status. Raw session: {session}")
    
    # Ottieni l'ID utente dalla sessione
    user_id = session.get('user_id')
    logger.debug(f"User ID from session: {user_id}")
    
    if not user_id:
        logger.info("No user ID found in session")
        return jsonify({"logged_in": False, "message": "No user ID in session"}), 200
    
    try:
        # Tenta di recuperare l'utente dal database
        user = user_manager.users_collection.find_one({"_id": ObjectId(user_id)})
        logger.debug(f"User from database: {user}")
        
        # Se l'utente è trovato, ritorna lo stato di login
        if user:
            username = user.get('user', 'Unknown')
            logger.debug(f"User is logged in. User ID: {user_id}")
            return jsonify({"logged_in": True, "message": "User is logged in", "username": username}), 200
        
        # Se l'utente non è trovato, implementa la logica di retry
        logger.warning(f"User ID {user_id} found in session but not in database. Retrying...")
        for attempt in range(3):
            time.sleep(0.5)  # Attendi 0.5 secondi prima di ritentare
            user = user_manager.users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                username = user.get('username', 'Unknown')
                logger.debug(f"User found after retry. User ID: {user_id}")
                return jsonify({"logged_in": True, "message": "User is logged in", "username": username}), 200
        
        # Se l'utente non è stato trovato dopo i retry, cancella l'ID utente dalla sessione
        session.pop('user_id', None)
        current_app.session_interface.save_session(current_app, session, current_app.make_response(''))
        logger.info(f"User ID {user_id} not found after retries. Cleared session.")
        return jsonify({"logged_in": False, "message": "User not found in database"}), 200
    
    except Exception as e:
        logger.error(f"Error retrieving user from database: {str(e)}")
        return jsonify({"logged_in": False, "message": "Error checking user status"}), 500
    
    logger.debug("No user ID in session")
    return jsonify({"logged_in": False, "message": "User is not logged in"}), 200

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    current_app.session_interface.save_session(current_app, session, current_app.make_response(''))
    logger.debug("User logged out")
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/api/connected_accounts', methods=['GET'])
def get_connected_accounts():
    user_id = session.get('user_id')
    logger.debug(f"Fetching connected accounts for user ID: {user_id}")
    
    if not user_id:
        logger.info("No user ID found in session")
        return jsonify({"error": "User not authenticated"}), 401
    
    try:
        user = user_manager.get_user(ObjectId(user_id))
        logger.debug(f"User from database: {user}")
        
        if user:
            connected_accounts = user.get('connected_account', [])
            logger.debug(f"Connected accounts: {connected_accounts}")
            return jsonify({"connected_accounts": connected_accounts}), 200
        else:
            logger.warning(f"User ID {user_id} not found in database")
            return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        logger.error(f"Error retrieving connected accounts: {str(e)}")
        return jsonify({"error": "Error retrieving connected accounts"}), 500

def is_valid_email(email):
    # Basic email validation
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def is_valid_password(password):
    if len(password) < 8:
        return {"status": False, "message": "Password must be at least 8 characters long"}
    if not re.search(r"[A-Z]", password):
        return {"status": False, "message": "Password must contain at least one uppercase letter"}
    if not re.search(r"[a-z]", password):
        return {"status": False, "message": "Password must contain at least one lowercase letter"}
    if not re.search(r"\d", password):
        return {"status": False, "message": "Password must contain at least one digit"}
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return {"status": False, "message": "Password must contain at least one special character"}
    return {"status": True, "message": "Password is valid"}