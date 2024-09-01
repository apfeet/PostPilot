import re
from pymongo import MongoClient
from dotenv import load_dotenv
from MongoDB_pool import MongoDBPool
import os

class User:
    def __init__(self):
        self._load_environment()
        self._connect_to_database()

    def _load_environment(self):
        load_dotenv()
        self.db_user = os.getenv('DB_USER')
        self.db_password = os.getenv('DB_PASSWORD')
        self.MONGODB_HOST = os.getenv('MONGODB_HOST')

    def _connect_to_database(self):
        mongo_pool = MongoDBPool()
        self.db = mongo_pool.get_database()
        self.users_collection = self.db['users']

    def create_user(self, user_id, email, hashed_password, plan="default"):
        if self._user_exists(user_id, email):
            return "User already exists."

        user_data = {
            "username": user_id,
            "email": email,
            "password": hashed_password,
            "plan": plan
        }
        self.users_collection.insert_one(user_data)
        return "User created successfully."

    def _user_exists(self, user_id, email):
        return self.users_collection.find_one({"$or": [{"user_id": user_id}, {"email": email}]}) is not None

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

    def delete_user(self, user_id):
        result = self.users_collection.delete_one({"user_id": user_id})
        if result.deleted_count > 0:
            return f"User with ID '{user_id}' deleted."
        else:
            return f"User with ID '{user_id}' not found."

    def get_user(self, user_id):
        user = self.users_collection.find_one({"user_id": user_id})
        if user:
            return user
        return None

    def update_user(self, user_id, update_data):
        if not self._user_exists(user_id, update_data.get('email', '')):
            return f"User with ID '{user_id}' not found."
        
        result = self.users_collection.update_one({"user_id": user_id}, {"$set": update_data})
        if result.modified_count > 0:
            return f"User with ID '{user_id}' updated successfully."
        else:
            return f"No changes made to user with ID '{user_id}'."
