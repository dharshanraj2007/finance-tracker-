const Income = require('../models/Income');

// @desc    Get all incomes
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new income
// @route   POST /api/income
// @access  Private
const createIncome = async (req, res, next) => {
  try {
    const { title, amount, date, category, description } = req.body;

    const income = new Income({
      user: req.user._id,
      title,
      amount,
      date,
      category,
      description,
    });

    const createdIncome = await income.save();
    res.status(201).json(createdIncome);
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);

    if (income) {
      if (income.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
      }

      const updatedIncome = await Income.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedIncome);
    } else {
      res.status(404);
      throw new Error('Income not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);

    if (income) {
      if (income.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
      }

      await income.deleteOne();
      res.json({ message: 'Income removed' });
    } else {
      res.status(404);
      throw new Error('Income not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
};
