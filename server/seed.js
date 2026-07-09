const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Income = require('./models/Income');
const Expense = require('./models/Expense');

// Load environment variables
dotenv.config();

const demoUser = {
  name: 'Demo User',
  email: 'demo@smartfinance.com',
  password: 'password123',
  settings: {
    currency: 'USD',
    darkMode: true,
    notifications: true
  }
};

const getIncomes = (userId) => [
  { user: userId, title: 'Monthly Salary June', amount: 5200, category: 'Salary', date: new Date('2026-06-01'), description: 'Tech Corp salary check' },
  { user: userId, title: 'Freelance Design', amount: 1500, category: 'Freelance', date: new Date('2026-06-15'), description: 'Landing page design project' },
  { user: userId, title: 'Dividends Pay', amount: 320, category: 'Investment', date: new Date('2026-06-28'), description: 'Quarterly dividends' },
  { user: userId, title: 'Monthly Salary July', amount: 5200, category: 'Salary', date: new Date('2026-07-01'), description: 'Tech Corp salary check' },
  { user: userId, title: 'Consulting Project', amount: 800, category: 'Freelance', date: new Date('2026-07-05'), description: 'UI audit consulting' },
];

const getExpenses = (userId) => [
  { user: userId, title: 'Organic Groceries', amount: 180.50, category: 'Food', date: new Date('2026-06-03'), description: 'Whole Foods purchase' },
  { user: userId, title: 'Electricity Bill', amount: 95.00, category: 'Bills', date: new Date('2026-06-10'), description: 'Monthly electricity bill' },
  { user: userId, title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date('2026-06-15'), description: 'Premium HD account' },
  { user: userId, title: 'Airport Uber Ride', amount: 45.00, category: 'Travel', date: new Date('2026-06-20'), description: 'Taxi to airport' },
  { user: userId, title: 'Premium Sneakers', amount: 120.00, category: 'Shopping', date: new Date('2026-06-25'), description: 'Sneakers purchase' },
  { user: userId, title: 'Rent Payment June', amount: 1500, category: 'Bills', date: new Date('2026-06-01'), description: 'June rent check' },
  { user: userId, title: 'Rent Payment July', amount: 1500, category: 'Bills', date: new Date('2026-07-01'), description: 'July rent check' },
  { user: userId, title: 'Medicines', amount: 65.00, category: 'Medical', date: new Date('2026-07-03'), description: 'Pharmacy prescription' },
  { user: userId, title: 'Weekly Groceries', amount: 210.00, category: 'Food', date: new Date('2026-07-06'), description: 'Supermarket shopping' },
  { user: userId, title: 'Fine Dining', amount: 150.00, category: 'Food', date: new Date('2026-07-08'), description: 'Dinner with friends' },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI env variable is not configured');
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection established.');

    // Drop old records
    console.log('Purging collections...');
    await User.deleteMany({});
    await Income.deleteMany({});
    await Expense.deleteMany({});
    console.log('Collections purged successfully.');

    // Seed Demo User
    console.log('Seeding Demo User...');
    const user = await User.create(demoUser);
    console.log(`Demo User created with ID: ${user._id}`);

    // Seed Transactions
    console.log('Seeding Incomes...');
    const incomes = getIncomes(user._id);
    await Income.insertMany(incomes);
    console.log(`${incomes.length} Incomes seeded.`);

    console.log('Seeding Expenses...');
    const expenses = getExpenses(user._id);
    await Expense.insertMany(expenses);
    console.log(`${expenses.length} Expenses seeded.`);

    console.log('Database Seeding Completed Successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
