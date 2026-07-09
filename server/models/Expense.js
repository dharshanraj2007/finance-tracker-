const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      maxLength: 20,
      trim: true,
    },
    type: {
      type: String,
      default: 'expense',
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
      enum: [
        'Food',
        'Shopping',
        'Medical',
        'Bills',
        'Education',
        'Entertainment',
        'Travel',
        'Salary',
        'Investment',
        'Others',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxLength: 200,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize search queries by indexing user and sorting date chronologically
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
