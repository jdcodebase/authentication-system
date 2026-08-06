# Authentication System

A full-stack authentication system built with the MERN stack that implements secure user authentication using JWT, HttpOnly cookies, refresh tokens, and protected routes.

This project demonstrates modern authentication practices used in real-world web applications, including secure password hashing, session management, and automatic authentication persistence.

---

## Live Demo

### Frontend

> https://authentication-system-eta-five.vercel.app/

### Backend API

> https://authentication-system-p89b.onrender.com

---

## Features

### Backend

- User Registration
- User Login
- User Logout
- Get Current User Profile
- Protected Routes
- Password Hashing with bcrypt
- JWT Authentication
- Access & Refresh Token Flow
- HttpOnly Cookie Authentication
- Refresh Token API
- Authentication Middleware
- MongoDB Integration

### Frontend

- React + Vite
- Tailwind CSS
- React Router
- Protected Routes
- Public Route Guards
- Global Authentication Context
- Automatic Session Restoration
- Responsive UI
- Custom 404 Page

---

# Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Icons
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser
- cors
- dotenv

---

# Project Structure

```
authentication-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

# Authentication Flow

```
Register
    │
    ▼
Password Hashing (bcrypt)
    │
    ▼
Store User in MongoDB
    │
    ▼
Login
    │
    ▼
Generate Access Token
Generate Refresh Token
    │
    ▼
Store Tokens in HttpOnly Cookies
    │
    ▼
Access Protected Routes
    │
    ▼
Authentication Middleware
    │
    ▼
Verify JWT
    │
    ▼
Return Protected Data
```

---

# API Endpoints

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/auth/register`      | Register a new user       |
| POST   | `/api/auth/login`         | Login user                |
| POST   | `/api/auth/logout`        | Logout user               |
| GET    | `/api/auth/profile`       | Get logged-in user        |
| POST   | `/api/auth/refresh-token` | Generate new access token |

---

# Environment Variables

## Backend `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/jdcodebase/authentication-system
```

```
cd authentication-system
```

---

## Backend Setup

```bash
cd server
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

---

# Authentication

This project uses:

- JWT Access Tokens
- JWT Refresh Tokens
- HttpOnly Cookies
- Secure Cookie Configuration
- Automatic Token Refresh
- Session Restoration on Page Reload

---

# Security Features

- Password hashing with bcrypt
- HttpOnly cookies
- JWT authentication
- Access & refresh token separation
- Protected API routes
- Authentication middleware
- Secure CORS configuration
- Environment variable management

---

# What I Learned

This project helped me understand:

- JWT Authentication
- Access & Refresh Tokens
- Password Hashing
- HttpOnly Cookies
- Authentication Middleware
- Protected Routes
- React Context API
- React Router Guards
- Session Persistence
- Full-stack Authentication Flow
- Deploying MERN Applications

---

# Deployment

Frontend: **Vercel**

Backend: **Render**

Database: **MongoDB Atlas**

---

# Author

**Jatin Dhamija**

GitHub: https://github.com/jdcodebase

LinkedIn: https://linkedin.com/in/jatindhamija

---

## If you found this project helpful, consider giving it a star!
