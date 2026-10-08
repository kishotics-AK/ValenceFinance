// utils/checkLimits.js
const User = require('../models/user');
const Transaction = require('../models/Transaction');
const FinanceProfile = require('../models/FinanceProfile');
const { sendEmail } = require('./notify');

const PERIODS = ['daily', 'weekly', 'monthly'];

// Date -> "YYYY-MM-DD" using local time (matches your string dates)
function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function periodStart(type, now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  if (type === 'weekly')  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  if (type === 'monthly') d.setDate(1);
  return d;
}

function money(currency, value) {
  return `${currency}${(Math.round(value * 100) / 100).toFixed(2)}`;
}

// Total expenses per period (start of period up to and including today).
async function getSpending(userId) {
  const user = await User.findById(userId).select('_id').lean();
  if (!user) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endStr = fmt(tomorrow);

  const spending = {};
  for (const type of PERIODS) {
    const [agg] = await Transaction.aggregate([
      { $match: {
          userId: user._id,
          type: 'expense',
          date: { $gte: fmt(periodStart(type)), $lt: endStr },
      } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    spending[type] = Math.round((agg?.total || 0) * 100) / 100;
  }
  return spending;
}

// Emails the user once per period when spending goes over a limit.
// Returns the list of periods an email was sent for.
async function checkLimits(userId) {
  const user = await User.findById(userId);
  if (!user || !user.emailAlerts) return [];

  const profile = await FinanceProfile.findOne({ userId: user._id }).select('currency').lean();
  const currency = profile?.currency || '$';
  const spending = await getSpending(user._id);
  const sent = [];

  for (const type of PERIODS) {
    const limit = user.limits?.[type];
    if (!limit) continue;                                   // 0 = no limit

    const start = periodStart(type);
    if (user.lastAlert?.[type] && user.lastAlert[type] >= start) continue; // already emailed

    const total = spending[type];
    if (total <= limit) continue;

    try {
      await sendEmail(
        user.email,
        `Your ${type} spending limit was exceeded`,
        `Hi,\n\nYour ${type} spending is ${money(currency, total)}, which is over your limit of ${money(currency, limit)}.\n\n- Valence Finance`
      );
      user.set(`lastAlert.${type}`, new Date());
      sent.push(type);
    } catch (error) {
      // One failed email must not block the other periods; it will retry on the next run.
      console.error(`Could not send ${type} alert to ${user.email}:`, error.message);
    }
  }

  if (sent.length) await user.save();
  return sent;
}

module.exports = checkLimits;
module.exports.checkLimits = checkLimits;
module.exports.getSpending = getSpending;
module.exports.periodStart = periodStart;
module.exports.PERIODS = PERIODS;