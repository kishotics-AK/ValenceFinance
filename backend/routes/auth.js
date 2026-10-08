const express = require('express');
const User = require('../models/user');
const Transaction = require('../models/Transaction');
const FinanceProfile = require('../models/FinanceProfile');
const { hashPassword, verifyPassword } = require('../utils/passwords');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 15;
const maximumPasswordLength = 128;

function publicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email
  };
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!emailPattern.test(email) || email.length > 254) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    if (
      typeof password !== 'string' ||
      password.length < minimumPasswordLength ||
      password.length > maximumPasswordLength
    ) {
      return res.status(400).json({
        error: `Password must be ${minimumPasswordLength}–${maximumPasswordLength} characters.`
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash });

    await regenerateSession(req);
    req.session.userId = user._id.toString();
    await saveSession(req);

    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'That email is already registered.' });
    }

    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (
      !emailPattern.test(email) ||
      typeof password !== 'string' ||
      password.length > maximumPasswordLength
    ) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    await regenerateSession(req);
    req.session.userId = user._id.toString();
    await saveSession(req);

    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie('valence.sid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return res.status(204).end();
  });
});

router.get('/me', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not signed in.' });
    }

    const user = await User.findById(req.session.userId).select('_id email').lean();
    if (!user) {
      return res.status(401).json({ error: 'Not signed in.' });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/migrate-legacy', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Please sign in to continue.' });
    }

    const legacyProfile = await FinanceProfile.findOne({ key: 'default' })
      .select('userId')
      .lean();

    if (
      !legacyProfile ||
      String(legacyProfile.userId) !== String(req.session.userId)
    ) {
      return res.status(409).json({
        error: 'Sign in with the account that owns the original finance profile.'
      });
    }

    const unownedRecords = {
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    };

    const transactions = await Transaction.updateMany(
      unownedRecords,
      { $set: { userId: req.session.userId } }
    );

    const profile = await FinanceProfile.updateOne(
      { key: 'default', ...unownedRecords },
      { $set: { userId: req.session.userId } }
    );

    return res.json({
      transactionsAssigned: transactions.modifiedCount,
      profileAssigned: profile.modifiedCount
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;