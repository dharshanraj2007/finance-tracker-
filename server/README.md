# Smart Finance Tracker API Backend

A production-quality REST API built with Node.js, Express, and Mongoose to power the Smart Finance Tracker frontend. It features secure JWT authentication, password hashing with bcrypt, input validation, global error handling middleware, and MongoDB database models.

---

## 🛠️ Tech Stack & Middleware

- **Core**: Node.js & Express.js (HTTP Server)
- **Database**: MongoDB & Mongoose ORM
- **Security**:
  - `jsonwebtoken` (Session validation)
  - `bcrypt` (Blowfish password hashing)
  - `helmet` (Secure HTTP headers)
  - `cors` (Cross-Origin Resource Sharing)
- **Utilities**:
  - `express-validator` (Request schema verification)
  - `morgan` (HTTP logging request logs)
  - `dotenv` (Environment variable binding)

---

## 📂 MVC Directory Structure

```text
server/
├── config/             # Database connection setups
│   └── db.js
├── controllers/        # Route controllers containing API logic
│   ├── analyticsController.js
│   ├── authController.js
│   ├── expenseController.js
│   ├── incomeController.js
│   └── profileController.js
├── middleware/         # Custom Express middlewares
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/             # Mongoose schemas
│   ├── Expense.js
│   ├── Income.js
│   └── User.js
├── routes/             # Route endpoint declarations
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   ├── incomeRoutes.js
│   └── profileRoutes.js
├── utils/              # Helper utilities
│   └── generateToken.js
├── .env.example        # Environment templates
├── package.json        # Node script declarations
└── server.js           # Server startup script
```

---

## 🚀 Setup & Launch Instructions

### 1. Initialize Variables
Duplicate the environment template file:
```bash
cp .env.example .env
```
Populate the `.env` variables with your credentials:
- `MONGODB_URI`: Your MongoDB Atlas Connection String
- `JWT_SECRET`: Any secure random secret string
- `PORT`: Server port (default is `5000`)

### 2. Install Packages
```bash
npm install
```

### 3. Startup Scripts
Run local developer hot-reloads using Nodemon:
```bash
npm run dev
```
For production build execution:
```bash
npm start
```

---

## 📊 Database Models

### 1. User Schema (`User.js`)
- `name` (String, required): Full Name
- `email` (String, required, unique): E-mail address (validated by Regex)
- `password` (String, required, select: false): Hashed credentials
- `settings` (Object):
  - `currency` (String, default: `'USD'`): Primary currency symbol
  - `darkMode` (Boolean, default: `false`): Dark mode preference flag
  - `notifications` (Boolean, default: `true`): Weekly email summary alerts toggle

### 2. Income Schema (`Income.js`)
- `user` (Mongoose ObjectId, ref: `'User'`, required): Owner account ID
- `title` (String, required, max: 50): Label name of incoming fund
- `amount` (Number, required): Numeric float amount
- `type` (String, default: `'income'`): Transaction action type
- `date` (Date, required): Receipt log date
- `category` (String, required): Income group category (e.g. Salary, Freelance, Gift)
- `description` (String, required, max: 200): Details remarks

### 3. Expense Schema (`Expense.js`)
- `user` (Mongoose ObjectId, ref: `'User'`, required): Owner account ID
- `title` (String, required, max: 50): Label name of payment outflow
- `amount` (Number, required): Outflow amount
- `type` (String, default: `'expense'`): Transaction action type
- `date` (Date, required): Timestamp log date
- `category` (String, required, enum): Must match one of `['Food', 'Shopping', 'Medical', 'Bills', 'Education', 'Entertainment', 'Travel', 'Others']`
- `description` (String, required, max: 200): Brief details remarks

---

## 🔑 REST API Route Specification

All endpoints are prefixed with `/api`. Protected routes require the header `Authorization: Bearer <JWT_TOKEN>`.

### Auth Endpoints

#### 1. Register User
- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Body JSON**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "653b6fa62...",
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "settings": {
      "currency": "USD",
      "darkMode": false,
      "notifications": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

#### 2. Log in User
- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Body JSON**:
  ```json
  {
    "email": "alex@mercer.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "653b6fa62...",
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "settings": {
      "currency": "USD",
      "darkMode": false,
      "notifications": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

---

### Profile Endpoints

#### 3. Retrieve Profile Details
- **Route**: `GET /api/profile`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "_id": "653b6fa62...",
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "settings": {
      "currency": "USD",
      "darkMode": false,
      "notifications": true
    }
  }
  ```

#### 4. Update Profile Details & Preferences
- **Route**: `PUT /api/profile`
- **Access**: Protected
- **Body JSON** (all fields optional):
  ```json
  {
    "name": "Alex Mercer Jr.",
    "password": "newpassword123",
    "settings": {
      "currency": "INR",
      "darkMode": true
    }
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "653b6fa62...",
    "name": "Alex Mercer Jr.",
    "email": "alex@mercer.com",
    "settings": {
      "currency": "INR",
      "darkMode": true,
      "notifications": true
    }
  }
  ```

---

### Income Endpoints

#### 5. List Incomes
- **Route**: `GET /api/income`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "653b70ef...",
      "user": "653b6fa62...",
      "title": "Freelance Dev",
      "amount": 2500,
      "type": "income",
      "date": "2026-07-09T00:00:00.000Z",
      "category": "Freelance",
      "description": "Smart contract frontend design"
    }
  ]
  ```

#### 6. Create Income Log
- **Route**: `POST /api/income`
- **Access**: Protected
- **Body JSON**:
  ```json
  {
    "title": "Freelance Dev",
    "amount": 2500,
    "date": "2026-07-09",
    "category": "Freelance",
    "description": "Smart contract frontend design"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "653b70ef...",
    "user": "653b6fa62...",
    "title": "Freelance Dev",
    "amount": 2500,
    "type": "income",
    "date": "2026-07-09T00:00:00.000Z",
    "category": "Freelance",
    "description": "Smart contract frontend design"
  }
  ```

#### 7. Update Income Log
- **Route**: `PUT /api/income/:id`
- **Access**: Protected
- **Body JSON**:
  ```json
  {
    "amount": 3000
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "653b70ef...",
    "user": "653b6fa62...",
    "title": "Freelance Dev",
    "amount": 3000,
    "type": "income",
    "date": "2026-07-09T00:00:00.000Z",
    "category": "Freelance",
    "description": "Smart contract frontend design"
  }
  ```

#### 8. Delete Income Log
- **Route**: `DELETE /api/income/:id`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "message": "Income removed"
  }
  ```

---

### Expense Endpoints

#### 9. List Expenses
- **Route**: `GET /api/expense`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "653b81ef...",
      "user": "653b6fa62...",
      "title": "Grocery Run",
      "amount": 120.5,
      "type": "expense",
      "date": "2026-07-09T00:00:00.000Z",
      "category": "Food",
      "description": "Whole Foods purchase"
    }
  ]
  ```

#### 10. Create Expense Log
- **Route**: `POST /api/expense`
- **Access**: Protected
- **Body JSON**:
  ```json
  {
    "title": "Grocery Run",
    "amount": 120.5,
    "date": "2026-07-09",
    "category": "Food",
    "description": "Whole Foods purchase"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "653b81ef...",
    "user": "653b6fa62...",
    "title": "Grocery Run",
    "amount": 120.5,
    "type": "expense",
    "date": "2026-07-09T00:00:00.000Z",
    "category": "Food",
    "description": "Whole Foods purchase"
  }
  ```

#### 11. Update Expense Log
- **Route**: `PUT /api/expense/:id`
- **Access**: Protected
- **Body JSON**:
  ```json
  {
    "title": "Bulk Grocery Run"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "653b81ef...",
    "user": "653b6fa62...",
    "title": "Bulk Grocery Run",
    "amount": 120.5,
    "type": "expense",
    "date": "2026-07-09T00:00:00.000Z",
    "category": "Food",
    "description": "Whole Foods purchase"
  }
  ```

#### 12. Delete Expense Log
- **Route**: `DELETE /api/expense/:id`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "message": "Expense removed"
  }
  ```

---

### Analytics Endpoint

#### 13. Fetch Financial Analytics Summary
- **Route**: `GET /api/analytics`
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "totalBalance": 2879.5,
    "totalIncome": 3000.0,
    "totalExpense": 120.5,
    "monthlyData": [
      { "month": "Jan", "income": 0, "expense": 0 },
      { "month": "Feb", "income": 0, "expense": 0 },
      ...
      { "month": "Jul", "income": 3000.0, "expense": 120.5 }
    ],
    "expenseCategories": [
      { "name": "Food", "value": 120.5 }
    ]
  }
  ```
