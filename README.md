# JWT Authentication Practice

This project is a practice implementation of JSON Web Token (JWT) authentication in a Node.js application. It demonstrates a secure method to handle user registration, login, password change, and access to protected resources. Unlike previous projects where I used [Passport.js](https://www.passportjs.org/) for authentication in a [Full-Stack Blog App](https://github.com/SHIVAM-KUMAR-59/Blog-App), this repository focuses on JWT-based authentication to deepen my understanding of token-based security.

## Table of Contents

- ✨ [Features](#✨-features)
- 📚 [Packages Used](#📚packages-used)
- ⚒️ [Getting Started](#⚒️-getting-started)
- 🔐 [Environment Variables](#🔐-environment-variables)
- 📩 [API-Routes](#📩-api-routes)
- 👏 [Acknowledgements](#👏-acknowledgements)

---

## <a name="features">✨ Features</a>

- **User Registration**: Users can register by providing a unique email and password. Passwords are hashed for security.
- **Login**: Registered users can log in and receive a JWT token.
- **Protected Routes**: Users must provide a valid JWT token to access certain routes.
- **Password Change**: Allows users to securely update their password.
- **Error Handling**: Comprehensive error handling to ensure smooth user experience.

## <a name="packages-used">📚 Packages Used</a>

The following npm packages were used to build this project, as defined in `package.json`:

- **[express](https://www.npmjs.com/package/express)**: Fast, unopinionated, minimalist web framework for Node.js.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: Library to hash passwords for security.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Implements JSON Web Token to secure API endpoints and verify user sessions.
- **[mongoose](https://www.npmjs.com/package/mongoose)**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **[cors](https://www.npmjs.com/package/cors)**: Middleware to enable Cross-Origin Resource Sharing (CORS).
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file into `process.env`.
- **[nodemailer](https://www.npmjs.com/package/nodemailer)**: Module for Node.js to send emails.

## <a name="getting-started">⚒️ Getting Started</a>

To set up the project locally, follow these steps:

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **MongoDB**: Set up a MongoDB database locally or use a cloud provider.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/jwt-authentication-practice.git
   cd jwt-authentication-practice
   cd Backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**: Create a .env file in the root directory and add the following environment variables

   ```bash
   PORT=your_port
   DATABASE_URI=your_mongo_db_connection_string
   JWT_SECRET_KEY=your_secret_key
   ```

4. **Run the app**: <br/>
   `For production: npm start` <br/>
   `For development: npm run dev`

## <a name="environment-variables">🔐 Environment Variables</a>

| Variable         | Description                       |
| ---------------- | --------------------------------- |
| `PORT`           | Port number to run the server     |
| `DATABASE_URI`   | MongoDB connection string         |
| `JWT_SECRET_KEY` | Secret key for JWT signing        |
| `EMAIL_HOST`     | SMTP host for email server        |
| `EMAIL_PORT`     | Port number for SMTP connection   |
| `EMAIL_USER`     | Username for SMTP authentication  |
| `EMAIL_PASS`     | Password or app password for SMTP |
| `EMAIL_FROM`     | Default email address for sender  |

## <a name="api-routes">📩 API Routes</a>

### Public Routes

These routes do not require authentication.

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| POST   | `/api/register`                  | Register a new user          |
| POST   | `/api/login`                     | Log in with user credentials |
| POST   | `/api/send-reset-password-email` | Send a password reset email  |
| POST   | `/api/reset-password/:id/:token` | Reset the user's password    |

### Protected Routes

These routes require authentication, protected by the `checkUserAuth` middleware.

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/api/changepassword` | Change password for logged-in user |
| GET    | `/api/loggeduser`     | Get details of the logged-in user  |

### Route-Level Middleware

The `checkUserAuth` middleware is used to secure routes requiring user authentication:

- **Protected Routes**: `/changepassword`, `/loggeduser`

### Middleware Configuration

In `routes.js`, the middleware is applied as follows:

```javascript
// Route-Level Middlewares - To Protect Routes
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)
```

## <a name="acknowledgements">👏 Acknowledgements</a>

A huge thank you to the NodeJs and ExpressJs community and various online resources that have been invaluable in my learning journey!
