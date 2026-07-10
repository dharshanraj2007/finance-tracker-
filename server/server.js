const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://finance-tracker-opal-five.vercel.app",
      "https://finance-tracker-a8f4794nr-team-alone1.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('Smart Finance Tracker API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
