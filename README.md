# Users System

A **User Management System** built with Node.js, Express.js, MongoDB, and JWT for secure authentication and role-based access control (RBAC).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a backend API that handles user authentication, authorization, and registration processes. It supports role-based access control, token-based authentication using JWT, and includes functionality for managing user roles, email confirmation, and password recovery.

## Features

- User Registration with email confirmation.
- Secure login and logout.
- Password reset functionality.
- Role-based access control (RBAC).
- Rate limiting for authentication routes.
- Token-based authentication with JWT.
- User activity logging.
- Error handling and validation.

## Technologies Used

- **Node.js** - Backend runtime.
- **Express.js** - Web framework.
- **MongoDB** - NoSQL database for storing user information.
- **Mongoose** - ODM for MongoDB.
- **JWT (JSON Web Tokens)** - For secure authentication.
- **bcrypt.js** - For password hashing and verification.
- **Validator** - To validate email and password inputs.
- **Express-rate-limit** - For rate limiting user requests.
- **Nodemailer** - To send email confirmations and password reset links.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdul-Rahman-Ahmed/users-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd users-system
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```
   PORT=4000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET_KEY=your-jwt-secret
   EMAIL_HOST=your-email-host
   EMAIL_PORT=your-email-port
   EMAIL_USER=your-email-username
   EMAIL_PASS=your-email-password
   ```

5. Start the server:

   ```bash
   npm start
   ```

## Usage

### Register a new user

Send a `POST` request to `/api/users/register` with the following JSON body:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
```

### Login a user

Send a `POST` request to `/api/users/login` with the following JSON body:

```json
{
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
```

### Confirm user email

Send a `GET` request to `/api/users/confirm/:token` to confirm the user's email. Replace `:token` with the token sent via email.

### Request password reset

Send a `POST` request to `/api/users/forget-password` with the following JSON body:

```json
{
  "email": "johndoe@example.com"
}
```

This will send a password reset link to the user's email.

### Reset password

Send a `POST` request to `/api/users/reset-password/:token` with the following JSON body to reset the password. Replace `:token` with the token sent via email

```json
{
  "password": "newpassword"
}
```

### Delete user account

To delete a user account, send a `DELETE` request to `/api/users/delete` with the following header:

```
Authorization: Bearer <token>
```

This will mark the account for deletion. To confirm deletion, send a `GET` request to `/api/users/delete/:token`.

### Get all users (Admin only)

To retrieve all users, send a `GET` request to `/api/users` with the following header:

```
Authorization: Bearer <admin_token>
```

This route is restricted to users with admin roles.

## Postman Collection

This project includes a Postman collection for easy testing of the API endpoints. The collection contains pre-configured requests for each operation, allowing you to quickly interact with the User Management System.

### How to Use the Postman Collection

1. **Download the Collection**:

   - The Postman collection file (`postman.json`) is included in the project directory.

2. **Import the Collection**:

   - Follow the instructions in the **Importing Postman Collection** section above to load the collection into your Postman app.

3. **Explore and Test**:
   - Once imported, you can view and execute various requests such as user registration, login, password reset, and more.

This collection is designed to help you understand how the API works and facilitate testing without needing to manually set up each request.

## API Endpoints

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| POST   | `/api/users/register`              | Register a new user        |
| POST   | `/api/users/login`                 | Login a user               |
| GET    | `/api/users/confirm/:token`        | Confirm user email         |
| POST   | `/api/users/forget-password`       | Request password reset     |
| POST   | `/api/users/reset-password/:token` | Reset password             |
| DELETE | `/api/users/delete`                | Delete user account        |
| GET    | `/api/users/delete/:token`         | Confirm delete user        |
| GET    | `/api/users`                       | Get all users (Admin only) |

## Rate Limiting

- **Registration**: Limited to 3 attempts per hour.
- **Login**: Limited to 5 attempts per 15 minutes.

## Error Handling

The application implements standardized error handling across all endpoints. Here are some common error responses you might encounter:

### 1. All Fields Are Required

- **Error Code**: 400
- **Message**: "All fields are required"
- **Description**: This error occurs when one or more required fields are missing in the request.

### 2. User Already Exists

- **Error Code**: 409
- **Message**: "This User Already exists"
- **Description**: This error occurs during user registration when attempting to create a user with an email that is already registered.

### 3. Invalid Email Format

- **Error Code**: 400
- **Message**: "Invalid email format"
- **Description**: This error indicates that the email address provided does not match the required format.

### 4. Weak Password

- **Error Code**: 400
- **Message**: "Weak password"
- **Description**: This error is triggered when the provided password does not meet the security criteria (e.g., length, complexity).

### 5. User Not Found

- **Error Code**: 404
- **Message**: "User not found"
- **Description**: This error occurs when attempting to access a user that does not exist in the database.

### 6. Wrong Password

- **Error Code**: 400
- **Message**: "Wrong password"
- **Description**: This error is returned when the password provided during login does not match the stored password for the given email.

### 7. Token Expired

- **Error Code**: 403
- **Message**: "Token has expired"
- **Description**: This error occurs when the JWT token used for authentication has expired and is no longer valid.

### 8. Invalid Token

- **Error Code**: 401
- **Message**: "Token is invalid"
- **Description**: This error indicates that the token provided is not valid, possibly due to tampering or incorrect format.

### 9. An Unexpected Error Occurred

- **Error Code**: 500
- **Message**: "An unexpected error occurred"
- **Description**: This error indicates that an unexpected issue has occurred on the server, which is not handled by the application.

### 10. Route Not Found

- **Error Code**: 404
- **Message**: "Route not found"
- **Description**: This error is returned when a requested route does not exist in the API.

### 11. Too Many Registration Attempts

- **Error Code**: 429
- **Message**: "Too many registration attempts. Please try again after X seconds"
- **Description**: This error occurs when a user exceeds the allowed number of registration attempts in a given time frame. Replace `X` with the actual retry time.

### 12. Too Many Login Attempts

- **Error Code**: 429
- **Message**: "Too many login attempts. Please try again after X seconds"
- **Description**: This error occurs when a user exceeds the allowed number of login attempts in a given time frame. Replace `X` with the actual retry time.

### 13. Authentication Required

- **Error Code**: 401
- **Message**: "Authentication required"
- **Description**: This error indicates that the user must be authenticated to access the requested resource.

### 14. User Not Allowed to Perform Action

- **Error Code**: 403
- **Message**: "The User: '<email>' is not allowed to perform this action"
- **Description**: This error occurs when a user attempts to perform an action that they do not have permission to execute.

### 15. Missing or Malformed Authorization Header

- **Error Code**: 401
- **Message**: "Authorization header is missing or malformed"
- **Description**: This error indicates that the authorization header is either missing or incorrectly formatted.

### 16. Token Required

- **Error Code**: 401
- **Message**: "Token is required"
- **Description**: This error indicates that a token must be provided for authentication.

### 17. Invalid or Expired Token

- **Error Code**: 401
- **Message**: "Invalid or expired token"
- **Description**: This error is returned when the provided token is either invalid or has expired, preventing access to protected resources.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](./LICENSE) file for more details.
