# Note App - Backend 

A RESTful API backend for a note-taking application built with Node.js and Express. 
Features secure user authentication and authorization using JWT tokens, full CRUD operations for notes, 
and comprehensive security measures including rate limiting, input sanitization, and Google OAuth integration. 
Built with PostgreSQL for robust data management.

## Table of contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)

## Features
- User authentication (JWT)
- Google OAuth integration
- Full CRUD operations for notes
- Search and filter functionality
- Rate limiting
- Input sanitization

## Tech Stack
- Node.js
- Express
- PostgreSQL (Neon)
- JWT
- bcrypt
- Helmet
- Cors
- express-rate-limit
- sanitize-html
- validator
- dotenv

## Prerequisites
- Node.js v16+
- PostgreSQL database (or Neon account)

## Installation
```bash
npm install
```

## Environment Variables
```
DATABASE_URL=
JWT_SECRET=
CLIENT_ID=
CLIENT_SECRET=
CALLBACK_URL=
REDIRECT_URL=
FRONTEND=
```

## Database Setup

## Running the Application
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user info
- DELETE `/api/auth/me` - Delete account
- PATCH `/api/auth/change-password` - Change password
- PATCH `/api/auth/setting` - User setting
- GET `/api/auth/google` - Google Login
- GET `/api/auth/google/callback` - Google Callback

### Notes
- GET `/api/notes` - Get all notes
- GET `/api/notes/archived` - Get all archived notes
- POST `/api/notes/create` - Create note
- GET `/api/notes/:id` - Find note
- PATCH `/api/notes/:id` - Update/Edit note
- DELETE `/api/notes/:id` - Delete note
- PATCH `/api/notes/:id/archive` - Archive note
- GET `/api/notes/search` - Search note
- GET `/api/notes/tags` - List tags
- GET `/api/notes/tag` - Tag filter notes

## Security Features
- JWT authentication
- Rate limiting
- Helmet security headers
- Input sanitization
- CORS protection
- Validator
- Bcrypt

## Project Structure
```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
└── utils/
```

## Future Improvements
- [ ] Email verification
- [ ] Password reset via email
- [ ] Note sharing
