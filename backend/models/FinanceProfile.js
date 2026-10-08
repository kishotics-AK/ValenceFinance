const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return this.userId ? String(this.userId) : 'default';
    },
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currency: { type: String, default: '$' },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  monthlyIncomeTarget: { type: Number, default: 0 },
  budgets: { type: mongoose.Schema.Types.Mixed, default: {} },
  goals: { type: [mongoose.Schema.Types.Mixed], default: [] },
  customCategories: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { timestamps: true, versionKey: false });

profileSchema.index({ userId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('FinanceProfile', profileSchema);