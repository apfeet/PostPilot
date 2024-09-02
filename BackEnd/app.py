from flask import Flask, request
from flask.sessions import SessionInterface, SessionMixin
from flask_cors import CORS
from bson import ObjectId
from datetime import timedelta
import os
from MongoDB_pool import MongoDBPool

class MongoDBSession(dict, SessionMixin):
    def __init__(self, initial=None, sid=None):
        self.sid = sid
        self.modified = False
        super(MongoDBSession, self).__init__(initial or ())

class MongoDBSessionInterface(SessionInterface):
    def __init__(self, mongo_pool):
        self.mongo_pool = mongo_pool
        self.db = self.mongo_pool.get_database()
        self.collection = self.db['sessions']

    def open_session(self, app, request):
        sid = request.cookies.get(app.config['SESSION_COOKIE_NAME'])
        if sid:
            stored_session = self.collection.find_one({"_id": ObjectId(sid)})
            if stored_session:
                return MongoDBSession(stored_session.get("data"), sid=sid)
        return MongoDBSession(sid=ObjectId())

    def save_session(self, app, session, response):
        domain = self.get_cookie_domain(app)
        path = self.get_cookie_path(app)
        if not session:
            if session.sid:
                self.collection.delete_one({"_id": ObjectId(session.sid)})
            response.delete_cookie(app.config['SESSION_COOKIE_NAME'],
                                   domain=domain, path=path)
            return

        if session.modified:
            self.collection.update_one(
                {"_id": ObjectId(session.sid)},
                {"$set": {"data": dict(session)}},
                upsert=True
            )

        httponly = self.get_cookie_httponly(app)
        secure = self.get_cookie_secure(app)
        expires = self.get_expiration_time(app, session)
        response.set_cookie(app.config['SESSION_COOKIE_NAME'],
                            str(session.sid),
                            expires=expires,
                            httponly=httponly,
                            domain=domain,
                            path=path,
                            secure=secure,
                            samesite='Lax')

# Initialize Flask app
app = Flask(__name__)

# Get HOST and PORT from environment variables or use defaults
HOST = os.environ.get('HOST', 'localhost')
BACKEND_PORT = os.environ.get('BACKEND_PORT', '5000')
FRONTEND_PORT = os.environ.get('FRONTEND_PORT', '8080')
NGINX_PORT = os.environ.get('NGINX_PORT', '80')

# Construct URLs
BACKEND_URL = f'http://{HOST}:{BACKEND_PORT}'
FRONTEND_URL = f'http://{HOST}:{FRONTEND_PORT}'
NGINX_URL = f'http://{HOST}:{NGINX_PORT}'

# CORS configuration with dynamic origins
CORS(app, resources={r"/*": {
    "origins": [
        FRONTEND_URL,
        NGINX_URL,
        f'http://localhost:{FRONTEND_PORT}',
        f'http://localhost:{NGINX_PORT}',
        BACKEND_URL,
        f'http://localhost:{BACKEND_PORT}',
        'http://localhost',
    ],
    "supports_credentials": True,
    "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
}})

# MongoDB Configuration using MongoDBPool
mongo_pool = MongoDBPool()

# Session configuration
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_COOKIE_NAME'] = 'session'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.session_interface = MongoDBSessionInterface(mongo_pool)

# Register blueprints
from module.routes.registerLogin import auth_bp
from module.routes.instagram_api import instagram_bp

app.register_blueprint(auth_bp)
app.register_blueprint(instagram_bp)

if __name__ == '__main__':
    print(f"Frontend URL: {FRONTEND_URL}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Nginx URL: {NGINX_URL}")
    app.run(host='0.0.0.0', port=int(BACKEND_PORT), debug=True)