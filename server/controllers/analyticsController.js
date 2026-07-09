const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all incomes and expenses for the user
    const incomes = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    // Calculate totals
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    // Get monthly data for the current year
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
    }));

    incomes.forEach((income) => {
      const date = new Date(income.date);
      if (date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()].income += income.amount;
      }
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()].expense += expense.amount;
      }
    });

    // Get expense categories breakdown
    const categoriesMap = {};
    expenses.forEach((expense) => {
      if (categoriesMap[expense.category]) {
        categoriesMap[expense.category] += expense.amount;
      } else {
        categoriesMap[expense.category] = expense.amount;
      }
    });

    const expenseCategories = Object.keys(categoriesMap).map((key) => ({
      name: key,
      value: categoriesMap[key],
    }));

    res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      monthlyData,
      expenseCategories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
