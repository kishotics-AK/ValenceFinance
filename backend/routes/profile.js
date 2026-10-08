const express = require('express');
const FinanceProfile = require('../models/FinanceProfile');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const allowed = ['currency', 'theme', 'monthlyIncomeTarget', 'budgets', 'goals', 'customCategories'];

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const profile = await FinanceProfile.findOne({
      userId: req.session.userId
    }).lean();

    res.json(profile || null);
  } catch (error) {
    next(error);
  }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const updates = Object.fromEntries(
      allowed
        .filter((key) => req.body[key] !== undefined)
        .map((key) => [key, req.body[key]])
    );

    const userId = req.session.userId;
    const key = String(userId);
    const existingProfile = await FinanceProfile.findOne({ userId }).lean();

    if (!existingProfile) {
      const profile = await FinanceProfile.create({
        userId,
        key,
        ...updates
      });

      return res.json(profile.toObject());
    }

    const profile = await FinanceProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          key,
          ...updates
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    return res.json(profile);
  } catch (error) {
    console.error('Profile update failed:', error);
    next(error);
  }
});

module.exports = router;