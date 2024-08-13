import re
from pymongo import MongoClient
from dotenv import load_dotenv
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
        connection_string = f'mongodb://{self.db_user}:{self.db_password}@{self.MONGODB_HOST}:27017/'
        self.client = MongoClient(connection_string)
        self.db = self.client['PostPilot']
        self.users_collection = self.db['users']

    def create_user(self, username, email, hashed_password, plan="default"):
        if self._user_exists(username, email):
            return "User already exists."

        
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "plan": plan
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

    def delete_user(self, username):
        result = self.users_collection.delete_one({"username": username})
        if result.deleted_count > 0:
            return f"User '{username}' deleted."
        else:
            return f"User '{username}' not found."

    def get_user(self, username):
        user = self.users_collection.find_one({"username": username})
        if user:
            return user
        return None

    def update_user(self, username, update_data):
        if not self._user_exists(username, update_data.get('email', '')):
            return f"User '{username}' not found."
        
        result = self.users_collection.update_one({"username": username}, {"$set": update_data})
        if result.modified_count > 0:
            return f"User '{username}' updated successfully."
        else:
            return f"No changes made to user '{username}'."