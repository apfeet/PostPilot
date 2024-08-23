from flask import Flask
from flask_session import Session
from flask_cors import CORS
from module.routes.registerLogin import auth_bp
import os

app = Flask(__name__)

# CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

# Session configuration
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)