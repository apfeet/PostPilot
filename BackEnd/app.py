from flask import Flask
from flask_session import Session
from flask_cors import CORS
from module.routes.registerLogin import auth_bp
#from module.routes.instagram_api import instagram_api

import os

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
        'http://localhost',  # Add this line
    ],
    "supports_credentials": True,
    "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
}})

# Session configuration
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

# Register blueprints
app.register_blueprint(auth_bp)
# app.register_blueprint(instagram_api)


if __name__ == '__main__':
    print(f"Frontend URL: {FRONTEND_URL}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Nginx URL: {NGINX_URL}")
    app.run(host='0.0.0.0', port=int(BACKEND_PORT), debug=True)