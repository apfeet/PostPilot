from flask import Flask, jsonify
from module.classes.User import User
import os

app = Flask(__name__)

@app.route('/create_test_user', methods=['GET'])
def create_test_user():
    user = User()
    result = user.create_user("john_doe", "john@example.com", "Password123!", "Password123!")
    return jsonify({"message": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)