const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  tier: { type: String },
  date: { type: String },
  notes: { type: String, default: '' },
  isRecurring: { type: Boolean, default: false }
}, { timestamps: true });

// Scopes uniqueness only within the same user account instead of globally
transactionSchema.index({ userId: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Transaction', transactionSchema);