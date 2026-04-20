# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FacTur is a fullstack application for expense tracking/invoicing with:
- **Backend**: Node.js/Express with MySQL database
- **Frontend**: React Native (Expo) with React Navigation

## Commands

### Backend
```bash
cd backend
npm start          # Run server (src/index.js)
```

### Frontend
```bash
cd frontend
npm start          # Expo dev server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web
```

## Architecture

### Backend Structure (`backend/src/`)
- `index.js` - Express app entry point, CORS, JSON parsing, routes at `/api/auth` and `/api/expenses`
- `config/database.js` - MySQL connection config via mysql2
- `middleware/auth.js` - JWT authentication middleware
- `models/` - User.js and Expense.js models
- `controllers/` - authController.js, expenseController.js
- `routes/` - auth.js, expenses.js

### Frontend Structure (`frontend/src/`)
- `navigation/AppNavigator.js` - Stack navigator with screens: Login, Register, Home, ExpenseForm, Summary
- `services/api.js` - Axios instance pointing to `http://localhost:3000/api`
- `services/authService.js` - Login/register helpers
- `services/expenseService.js` - Expense CRUD helpers
- `screens/` - LoginScreen, RegisterScreen, HomeScreen, ExpenseFormScreen, SummaryScreen
- `components/ErrorBoundary.js` - Error boundary wrapper

## API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login, returns JWT
- `GET /api/expenses` - List expenses (protected)
- `POST /api/expenses` - Create expense (protected)

## Environment Variables (backend/.env)
- PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET, JWT_EXPIRES_IN

## Key Dependencies
- Backend: express, mysql2, bcryptjs, jsonwebtoken, cors, dotenv
- Frontend: expo, react-native, @react-navigation/native, axios, @react-native-async-storage/async-storage