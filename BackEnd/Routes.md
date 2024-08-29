# User Authentication API Guide

This document outlines the routes available for user authentication in the Flask backend and how to use them effectively.

## 1. `/api/register-login`

### Method: `POST`

This route handles both user registration and login.

### Request Body
- `email`: **String** (Required) - The email address of the user.
- `password`: **String** (Required) - The password for the account.

### How It Works
- **Login**: 
  - If the email is already registered, the system will attempt to log the user in.
  - If the provided password matches the stored hash, the user is successfully logged in, and their session is started.
  - If the password does not match, an error response is returned.
  
- **Registration**: 
  - If the email is not registered, the system will validate the email format and password strength.
  - Upon successful validation, the user is registered, their password is hashed, and a session is started.

### Response Examples
- **Success (Login)**: 
  ```json
  {
    "message": "Login successful",
    "username": "user123"
  }


HTTP Status Code: 200

Success (Registration):

```json
{
  "message": "Registration successful"
}
```
HTTP Status Code: 201

Failure (Invalid Email or Password):
```json
{
  "error": "Email and password are required"
}
```
HTTP Status Code: 400
Failure (Invalid Password):
```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

## 2. `/api/check_user_status`

### Method: `GET`

This route checks if a user is currently logged in.

### Request

- No request body is required.

### Response

- **User Logged In**:
 ```json
  {
    "logged_in": true,
    "message": "User is logged in"
  }
```
HTTP Status Code: 200

User Not Logged In:
```json
{
  "logged_in": false,
  "message": "User is not logged in"
}
```
## 3. `/api/logout`

### Method: `POST`

Logs the user out by clearing their session.

### Request

- No request body is required.

### Response

- **Success**:
  ```json
  {
    "message": "Logged out successfully"
  }




