from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os

class MongoDBPool:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBPool, cls).__new__(cls)
            cls._instance._initialize_pool()
        return cls._instance

    def _initialize_pool(self):
        load_dotenv()
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        MONGODB_HOST = os.getenv('MONGODB_HOST')

        self.connection_string = f'mongodb://{db_user}:{db_password}@{MONGODB_HOST}:27017/'

        
        self.client = MongoClient(self.connection_string, maxPoolSize=25, minPoolSize=1)
        self.db = self.client['PostPilot']

    def get_database(self):
        try:
            self.client.server_info()  
            return self.db
        except errors.ConnectionFailure:
            fallback_client = MongoClient(self.connection_string)
            return fallback_client['PostPilot']

# Usage example:
# mongo_pool = MongoDBPool()
# db = mongo_pool.get_database()
