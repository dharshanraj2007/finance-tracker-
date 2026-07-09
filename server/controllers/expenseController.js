const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expense
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expense
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, date, category, description } = req.body;

    const expense = new Expense({
      user: req.user._id,
      title,
      amount,
      date,
      category,
      description,
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expense/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      if (expense.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
      }

      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedExpense);
    } else {
      res.status(404);
      throw new Error('Expense not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      if (expense.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
      }

      await expense.deleteOne();
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404);
      throw new Error('Expense not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
