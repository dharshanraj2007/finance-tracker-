const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
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
      default: 'income',
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
incomeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);
