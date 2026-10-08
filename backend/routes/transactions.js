const express = require('express');
const Transaction = require('../models/Transaction');
const requireAuth = require('../middleware/requireAuth');
const checkLimits = require('../utils/checkLimits');

const router = express.Router();

const allowedFields = [
  'type',
  'amount',
  'category',
  'tier',
  'date',
  'notes',
  'isRecurring'
];

function pickAllowed(source) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => source[field] !== undefined)
      .map((field) => [field, source[field]])
  );
}

// Fire-and-forget: email alerts go out right after spending changes instead of waiting for the scheduler.
function triggerLimitCheck(userId) {
  checkLimits(userId).catch((error) => console.error('Limit check failed:', error));
}

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      userId: req.session.userId
    })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...pickAllowed(req.body),
      id: req.body.id,
      userId: req.session.userId
    });

    res.status(201).json(transaction);
    if (transaction.type === 'expense') triggerLimitCheck(req.session.userId);
  } catch (error) {
    next(error);
  }
});

router.put('/replace', async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Expected an array of transactions.' });
    }

    const seenIds = new Set();
    const docs = [];
    for (const item of req.body) {
      if (!item || typeof item !== 'object') {
        return res.status(400).json({ error: 'Each transaction must be an object.' });
      }
      const id = item.id === undefined || item.id === null ? '' : String(item.id);
      if (seenIds.has(id)) {
        return res.status(400).json({ error: `Duplicate transaction id: ${id}` });
      }
      seenIds.add(id);

      const doc = new Transaction({ ...pickAllowed(item), id, userId });
      // Validate everything BEFORE deleting, so a bad item can't wipe the user's data.
      await doc.validate();
      docs.push(doc);
    }

    await Transaction.deleteMany({ userId });
    if (docs.length > 0) {
      await Transaction.insertMany(docs);
    }

    res.status(200).json({ success: true, count: docs.length });
    triggerLimitCheck(userId);
    return;
  } catch (error) {
    console.error('Transaction replace failed:', error);
    next(error);
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    const updates = pickAllowed(req.body);

    const transaction = await Transaction.findOneAndUpdate(
      { id: req.params.id, userId: req.session.userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    res.json(transaction);
    if (transaction.type === 'expense') triggerLimitCheck(req.session.userId);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      id: req.params.id,
      userId: req.session.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    res.json({ message: 'Transaction deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;