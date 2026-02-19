# KodBank - Full-Stack Banking Application

A modern, secure banking web application built with React, Node.js, Express, and MySQL.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MySQL (Aiven)
- JWT Authentication
- bcryptjs
- cookie-parser

## Features

- User Registration & Login
- JWT Authentication with HttpOnly Cookies
- View Account Balance
- Transfer Money Between Users
- Transaction History
- Profile Management
- Password Reset with Security Questions
- Secure Password Hashing
- Database Transactions for Transfers
- Modern Glassmorphism UI

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database (Aiven/Railway/PlanetScale)
2. Note down the connection details
3. Run the SQL schema from `schema.sql`

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Reset password

### Banking
- `GET /api/balance` - Get account balance (Protected)
- `POST /api/transfer` - Transfer money (Protected)
- `GET /api/transactions` - Get transaction history (Protected)
- `PUT /api/profile` - Update profile (Protected)
- `PUT /api/change-password` - Change password (Protected)

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 1 hour
- HttpOnly, Secure, SameSite cookies
- Database transactions for transfers
- Token validation in database
- Protected routes with middleware
- Security questions for password reset

## Deployment Guide

### Backend Deployment (Vercel)

1. Push code to GitHub
2. Create new project on Vercel
3. Set Root Directory to `backend`
4. Add environment variables
5. Deploy

### Frontend Deployment (Vercel)

1. Create new project on Vercel
2. Set Root Directory to `frontend`
3. Set Framework Preset to Vite
4. Add environment variable: `VITE_API_URL`
5. Deploy

## License

MIT
