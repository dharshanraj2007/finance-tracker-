# Smart Finance Tracker

A complete production-ready MERN Stack application for tracking personal finances. 

## Features
- **Authentication**: JWT-based secure authentication.
- **Dashboard**: High-level overview of total balance, income, expenses, and savings.
- **Income & Expenses**: Full CRUD operations for managing transactions with categories.
- **Analytics**: Detailed charts (Bar, Area, Pie) powered by Recharts.
- **Settings**: Dark mode, currency selection, and profile updates.
- **Responsive UI**: Premium fintech-inspired design using Tailwind CSS.

## Project Structure
```
finance-tracker/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context for global state
│   │   ├── pages/       # Application pages (Dashboard, etc.)
│   │   ├── services/    # Axios API integrations
│   │   └── ...
│   └── ...
├── server/          # Node.js/Express Backend
│   ├── config/      # DB Connection
│   ├── controllers/ # Route logic
│   ├── middleware/  # Auth and Error middlewares
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # Express API Routes
│   └── server.js    # Entry point
├── .env.example     # Template for environment variables
└── README.md
```

## Installation & Setup

### 1. Database Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Create a database user and get your connection string.

### 2. Environment Variables
1. Copy the `.env.example` file in the `server` directory (or use the root one) and rename it to `.env`.
2. Fill in your `MONGODB_URI` and a random `JWT_SECRET`.

### 3. Running the Backend
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Running the Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React app will start on `http://localhost:3000` (proxied to port 5000 for APIs).

## Deployment
- **Frontend (Vercel)**: Connect your GitHub repo to Vercel and set the framework preset to Vite. Build command: `npm run build`, Output directory: `dist`.
- **Backend (Render)**: Connect your repo to Render, select Node, set the build command to `npm install` and start command to `node server.js`. Add your `.env` variables to Render.

## API Documentation
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/profile` - Get user profile (Protected)
- `PUT /api/profile` - Update user profile (Protected)
- `GET /api/income` - Get user incomes (Protected)
- `POST /api/income` - Create income (Protected)
- `GET /api/expense` - Get user expenses (Protected)
- `POST /api/expense` - Create expense (Protected)
- `GET /api/analytics` - Get user analytics data (Protected)
