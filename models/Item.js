const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    index: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive'],
    index: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock must be positive'],
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
itemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes for efficient querying
itemSchema.index({ category: 1, createdAt: -1 });
itemSchema.index({ price: 1, createdAt: -1 });
itemSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
