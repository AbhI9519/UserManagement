# Authentication API

## Prerequisites

- Node.js (>=14.x)
- MongoDB (Cloud or Local instance)

## Installation

Clone the repository and install dependencies:
git clone https://github.com/AbhI9519/UserManagement.git
cd authLogin
npm install

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Running the Server

Start the development server:
npm run dev

For production:
npm start

## Running Tests

Run unit tests using Jest:
npm test

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User Signup
- `POST /api/auth/login` - User Login
- `POST /api/auth/forgot-password` - Forgot Password
- `GET /api/auth/profile` - Get Profile (Requires Auth)
- `POST /api/auth/create-new-password` - Reset Password

## Project Structure

- `src/` - Contains the main application code
- `tests/` - Contains unit and integration tests
- `.env` - Stores environment variables
- `package.json` - Project dependencies and scripts
