# Purple Merit User Management System

A high-performance, responsive full-stack MERN (MongoDB, Express, React, Node.js) application built for the Purple Merit Technologies Intern Assessment. Provides secure user authentication, distinct Role-Based Access Control (Admin, Manager, User), and an aesthetic intuitive dashboard built with vanilla CSS focusing on premium glassmorphism visuals.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Running locally or an Atlas connection string)

## Setup Guide

### 1. Database Configuration
By default, the backend connects to `mongodb://localhost:27017/purple-merit`. If you want to use MongoDB Atlas, create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/purple-merit
PORT=5000
JWT_SECRET=supersecret123
NODE_ENV=development
```

### 2. Backend Initialization
Open a terminal and navigate to the project root, then to `backend`:

```sh
cd backend
npm install
node seed.js  # Important! This quickly generates test users for your demo
npm run dev
```

The `seed.js` script provisions these accounts:
- **Admin**: `admin@example.com` | `password123`
- **Manager**: `manager@example.com` | `password123`
- **User**: `user1@example.com` | `password123`

### 3. Frontend Initialization
Open a second terminal window, navigate to `frontend`:

```sh
cd frontend
npm install
npm run dev
```
The React App will be available at `http://localhost:5173`.

## Features
- **JWT Cookie Auth**: Secure httpOnly cookies configured with React context state.
- **RBAC Matrix**: 
  - Admin (Full CRUD override, can assign roles & delete users. Can view everything.)
  - Manager (Can read users, edit non-admins. Cannot delete. Cannot make a user Admin.)
  - User (Can view and edit own profile only.)
- **Premium UI/UX**: Dark mode by default, glassmorphic cards, smooth responsive tables, accessible layout.
