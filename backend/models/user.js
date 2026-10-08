const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
	  limits: {
    daily:   { type: Number, default: 0, min: 0 },   // 0 means no limit
    weekly:  { type: Number, default: 0, min: 0 },
    monthly: { type: Number, default: 0, min: 0 },
  },
  emailAlerts: { type: Boolean, default: true },
  lastAlert: {
    daily:   Date,
    weekly:  Date,
    monthly: Date,
  },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);