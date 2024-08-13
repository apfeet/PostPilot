from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from module.classes.User import User
import re

# Create a User instance
user_manager = User()

# Create a Blueprint instance
auth_bp = Blueprint('auth', __name__)

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
        if check_password_hash(existing_user['password'], password):
            session['user_id'] = str(existing_user['_id'])
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

        # Hash the password before storing
        hashed_password = generate_password_hash(password)

        result = user_manager.create_user(username, email, hashed_password)

        if result == "User created successfully.":
            new_user = user_manager.users_collection.find_one({"email": email})
            session['user_id'] = str(new_user['_id'])
            return jsonify({"message": "Registration successful"}), 201
        else:
            return jsonify({"error": result}), 400
        

@auth_bp.route('/api/check_user_status', methods=['GET'])
def check_user_status():
    if 'user_id' in session:
        return jsonify({"logged_in": True, "message": "User is logged in"}), 200
    else:
        return jsonify({"logged_in": False, "message": "User is not logged in"}), 200

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200


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