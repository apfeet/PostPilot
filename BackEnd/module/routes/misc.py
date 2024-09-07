from flask import Blueprint, request, jsonify, session
from ..classes.User import User
from bson import ObjectId


user = User()
misc_blueprint = Blueprint('misc_blueprint', __name__)

errors = [
    "User not logged in or session expired.",
    "User not found, contact an administrator!",
]


@misc_blueprint.route('/api/UserInfo', methods=['GET'])
def UserInfo():
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({"status": 401, "error": f"{errors[0]}"}), 401
    

    user_data = user.get_user(user_id)
    
    if not user_data:
        return jsonify({"status": 404, "error": f"{errors[1]}","sess":user_id}), 404

    return jsonify({
        "status": 200,
        "user_ID": str(ObjectId(user_id)),
        "username": user_data['username'],
        "email": user_data['email'],
        "connected_account": user_data['connected_account'], 
    }), 200
