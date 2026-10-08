const express = require('express');
const User = require('../models/user');
const requireAuth = require('../middleware/requireAuth');
const { checkLimits, getSpending, PERIODS } = require('../utils/checkLimits');

const router = express.Router();
const MAX_LIMIT = 1e12;

router.use(requireAuth);

async function alertSettings(userId) {
  const user = await User.findById(userId).select('limits emailAlerts lastAlert').lean();
  if (!user) return null;

  return {
    emailAlerts: user.emailAlerts !== false,
    limits: {
      daily: user.limits?.daily || 0,
      weekly: user.limits?.weekly || 0,
      monthly: user.limits?.monthly || 0
    },
    lastAlert: {
      daily: user.lastAlert?.daily || null,
      weekly: user.lastAlert?.weekly || null,
      monthly: user.lastAlert?.monthly || null
    },
    spending: await getSpending(userId)
  };
}

// GET /api/alerts -> current limits, alert toggle and this period's spending
router.get('/', async (req, res, next) => {
  try {
    const settings = await alertSettings(req.session.userId);
    if (!settings) return res.status(401).json({ error: 'Please sign in to continue.' });
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/alerts { emailAlerts?, limits?: { daily?, weekly?, monthly? } }
router.put('/', async (req, res, next) => {
  try {
    const $set = {};
    const $unset = {};

    if (req.body.emailAlerts !== undefined) {
      if (typeof req.body.emailAlerts !== 'boolean') {
        return res.status(400).json({ error: 'emailAlerts must be true or false.' });
      }
      $set.emailAlerts = req.body.emailAlerts;
    }

    const limits = req.body.limits;
    if (limits !== undefined) {
      if (!limits || typeof limits !== 'object' || Array.isArray(limits)) {
        return res.status(400).json({ error: 'limits must be an object.' });
      }

      const current = await User.findById(req.session.userId).select('limits').lean();
      if (!current) return res.status(401).json({ error: 'Please sign in to continue.' });

      for (const period of PERIODS) {
        if (limits[period] === undefined) continue;
        const value = Number(limits[period]);
        if (!Number.isFinite(value) || value < 0 || value > MAX_LIMIT) {
          return res.status(400).json({ error: `The ${period} limit must be a number of 0 or more.` });
        }
        const rounded = Math.round(value * 100) / 100;
        $set[`limits.${period}`] = rounded;

        // A changed limit gets a fresh alert, otherwise raising/lowering it mid-period stays silent.
        if (rounded !== (current.limits?.[period] || 0)) {
          $unset[`lastAlert.${period}`] = '';
        }
      }
    }

    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    if (Object.keys(update).length) {
      await User.updateOne({ _id: req.session.userId }, update, { runValidators: true });
      // Check immediately so the user doesn't wait for the next scheduler run.
      checkLimits(req.session.userId).catch((error) => console.error('Limit check failed:', error));
    }

    res.json(await alertSettings(req.session.userId));
  } catch (error) {
    next(error);
  }
});

// POST /api/alerts/check -> run the limit check now for the signed-in user
router.post('/check', async (req, res, next) => {
  try {
    const sent = await checkLimits(req.session.userId);
    res.json({ sent, ...(await alertSettings(req.session.userId)) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
