# MERN Authentication System

A secure, production-oriented authentication system built with the **MERN stack**, designed to support both **React web applications** and **React Native mobile applications** from the same backend.

The system provides authentication, email verification, password recovery, password management, email changes, refresh-token sessions, and device/session management.

---

## Features

### Authentication

- User registration
- Email OTP verification
- Login with email and password
- JWT-based authentication
- Short-lived access tokens
- Long-lived refresh tokens
- Automatic access-token refresh
- Logout
- Protected API routes
- Support for multiple authenticated devices

### Email Verification

- OTP-based email verification
- Secure OTP hashing using HMAC
- OTP expiration
- Maximum OTP attempt protection
- OTP resend cooldown
- Email verification during registration
- Current-email verification before changing email
- New-email verification before completing an email change

### Password Management

- Secure password hashing with bcrypt
- Change password
- Forgot password
- Password-reset OTP
- Password-reset JWT
- Password confirmation
- Prevents changing to the same password
- Invalidates all refresh sessions after password change
- Invalidates all refresh sessions after password reset

### Email Change

The email-change flow uses a multi-step verification process:

```text
Current Email
      ↓
Verify Current Email OTP
      ↓
Enter New Email
      ↓
Verify New Email OTP
      ↓
Email Changed
```

The email-change process uses a short-lived email-change token between verification steps.

### Device & Session Management

Authenticated refresh-token sessions are stored individually in MongoDB.

Each session can contain:

- User
- Device ID
- Device type
- Device name
- IP address
- User agent
- Creation timestamp
- Last-used timestamp
- Expiration timestamp

Users can:

- View active sessions/devices
- Revoke individual sessions
- Log out from specific devices

Supported device types:

```text
web
android
ios
```

### Security

- HTTP-only refresh-token cookies for web
- Secure cookies in production
- `SameSite=None` for cross-origin production web authentication
- `SameSite=Lax` during local development
- Refresh-token rotation
- Refresh-token hashing before database storage
- HMAC-hashed OTPs
- Timing-safe OTP comparison
- OTP expiration
- OTP attempt limits
- OTP resend cooldown
- JWT purpose validation
- Helmet security headers
- CORS protection
- Request body size limits
- Centralized error handling
- Centralized API responses
- MongoDB TTL indexes for expiring records

---

# Architecture

The backend is designed to work with both web and mobile clients.

```text
                         ┌──────────────────┐
                         │    React Web     │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │                  │
                         │  Express API     │
                         │                  │
                         └────────┬─────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
        ┌───────▼───────┐ ┌───────▼──────┐ ┌────────▼─────┐
        │   MongoDB     │ │    Email     │ │    JWT       │
        │               │ │   Service    │ │   Tokens     │
        └───────────────┘ └──────────────┘ └──────────────┘
                                  │
                         ┌────────▼─────────┐
                         │ React Native     │
                         │ Mobile Client    │
                         └──────────────────┘
```

---

# Token Architecture

The system uses two primary authentication tokens.

## Access Token

The access token is short-lived and is used to access protected API endpoints.

```text
Client
  │
  │ Authorization: Bearer <access-token>
  ▼
Express API
  │
  └── verifyAccessToken
```

Access tokens are intentionally short-lived to reduce the impact of token theft.

## Refresh Token

Refresh tokens are long-lived and are used to obtain new access tokens.

For the web application:

```text
Browser
   │
   │ HTTP-only cookie
   ▼
Express API
```

For React Native:

```text
React Native
     │
     │ Secure device storage
     ▼
Refresh Token
```

Refresh tokens are rotated and their hashes are stored in MongoDB.

The raw refresh token is never stored in the database.

---

# Automatic Token Refresh

The React frontend uses Axios interceptors.

When an authenticated request receives a `401` response:

```text
API Request
    │
    ▼
   401
    │
    ▼
Refresh Access Token
    │
    ├── Success
    │      ↓
    │   Retry request
    │
    └── Failure
           ↓
         Logout
```

Concurrent requests are queued while a refresh operation is already running, preventing multiple simultaneous refresh requests.

Special-purpose authorization tokens such as registration, password-reset, and email-change tokens are preserved instead of being overwritten by the normal access-token interceptor.

---

# OTP System

OTP codes are not stored as plain text.

The system generates a six-digit OTP:

```text
123456
```

The OTP is hashed using HMAC:

```text
OTP
 │
 ▼
HMAC-SHA256
 │
 ▼
Stored hash
```

During verification, the submitted OTP is hashed again and compared using a timing-safe comparison.

OTP protection includes:

- 6-digit format validation
- Expiration
- Maximum failed attempts
- Resend cooldown
- Previous OTP cleanup

OTP types include:

```text
EMAIL_VERIFICATION
PASSWORD_RESET
PASSWORD_CHANGE
EMAIL_CHANGE_OLD
EMAIL_CHANGE_NEW
```

---

# Project Structure

A simplified structure of the project:

```text
project/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── email.js
│   │   │
│   │   ├── controllers/
│   │   │   └── auth/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── otp.model.js
│   │   │   └── refreshToken.model.js
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │   └── email.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── token.utils.js
│   │   │
│   │   └── app.js
│   │
│   └── package.json
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   └── change-email/
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ChangePasswordPage.jsx
│   │   │   ├── ChangeEmailPage.jsx
│   │   │   └── DevicesPage.jsx
│   │   │
│   │   └── services/
│   │       ├── api.js
│   │       └── auth.service.js
│   │
│   └── package.json
│
└── README.md
```

---

# Database Models

## User

The user model contains:

```text
name
email
phone
dateOfBirth
password
isEmailVerified
createdAt
updatedAt
```

Passwords are automatically hashed before being saved.

---

## OTP

Stores temporary OTP information:

```text
email
type
codeHash
expiresAt
attempts
verifiedAt
createdAt
updatedAt
```

A MongoDB TTL index automatically removes expired OTP documents.

---

## RefreshToken

Stores authenticated sessions:

```text
user
tokenHash
deviceId
deviceType
deviceName
ip
userAgent
expiresAt
lastUsedAt
createdAt
updatedAt
```

Refresh-token sessions also use a TTL index.

A unique combination of:

```text
user + deviceId
```

prevents duplicate sessions for the same device.

---

# API Overview

Base URL:

```text
/api
```

## Registration

```http
POST /auth/register/send-otp
POST /auth/register/verify-otp
POST /auth/register/complete
```

## Authentication

```http
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
```

## Password

```http
POST /auth/forgot-password/send-otp
POST /auth/forgot-password/verify-otp
POST /auth/forgot-password/reset-password
POST /auth/change-password
```

## Email Change

```http
POST /auth/change-email/send-old-otp
POST /auth/change-email/verify-old-otp
POST /auth/change-email/send-new-otp
POST /auth/change-email/verify-new-otp
```

## Devices

```http
GET    /users/devices
DELETE /users/devices/:sessionId
```

---

# Environment Variables

Create a `.env` file in the backend.

Example:

```env
MONGODB_URI=

OTP_SECRET=

CLIENT_URL=http://localhost:5173

PORT=8000

REGISTRATION_TOKEN_SECRET=
REGISTRATION_TOKEN_EXPIRATION=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRATION=

PASSWORD_RESET_TOKEN_SECRET=
PASSWORD_RESET_TOKEN_EXPIRATION=

EMAIL_CHANGE_TOKEN_SECRET=
EMAIL_CHANGE_TOKEN_EXPIRATION=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=

NODE_ENV=development
```

**Never commit `.env` to Git.**

Add it to `.gitignore`:

```gitignore
.env
.env.*
```

Use strong, randomly generated secrets for all JWT and OTP secrets.

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/jdcodebase/authentication-system
cd authentication-system
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Install frontend dependencies

```bash
cd ../web
npm install
```

## 4. Configure environment variables

Create:

```text
backend/.env
```

and add the required configuration.

## 5. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

## 6. Start the frontend

```bash
cd web
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# Email Development

The project currently uses **Nodemailer with SMTP** for local email delivery.

Typical local configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email
```

For Gmail SMTP, use an **App Password** rather than your normal Gmail password.

Email functionality can be tested locally without requiring a separate transactional email provider.

---

# Security Considerations

This project follows several important authentication security practices.

### Passwords

Passwords are:

- Never returned in normal user queries
- Hashed before database storage
- Compared using bcrypt

### Refresh Tokens

Refresh tokens are:

- Rotated
- Hashed before database storage
- Associated with a specific device/session
- Expirable
- Revocable

### Browser Cookies

Production web refresh tokens use:

```text
HttpOnly
Secure
SameSite=None
```

This prevents JavaScript from directly accessing the refresh token.

### OTPs

OTP codes are:

- Short-lived
- Hashed
- Attempt-limited
- Rate-limited
- Deleted after successful verification

### Password Changes

Changing or resetting a password invalidates all existing refresh sessions.

This helps prevent previously issued sessions from remaining active after a password compromise.

---

# React Native Support

The backend is designed to support React Native without requiring a separate authentication API.

The main difference is refresh-token storage.

### Web

```text
Refresh Token
      ↓
HTTP-only Cookie
```

### React Native

```text
Refresh Token
      ↓
Secure Device Storage
```

The same authentication backend can therefore serve:

```text
React Web
    +
React Native
    ↓
Same Express Authentication API
```

---

# Tech Stack

## Backend

- Node.js
- Express 5
- MongoDB
- Mongoose 9
- JSON Web Tokens
- bcrypt
- Nodemailer
- Helmet
- CORS
- Cookie Parser

## Frontend

- React
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons

## Planned Mobile Client

- React Native

---

# License

This project is currently intended for personal/educational development.

Add your preferred license here before public distribution.
