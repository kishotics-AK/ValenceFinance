const mongoose = require('mongoose');
const User = require('./models/user');
const Transaction = require('./models/Transaction');

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/valenceFinance');

  const txs = await Transaction.find().sort({ date: -1 }).limit(10);
  for (const t of txs) {
    const owner = await User.findById(t.userId);
    console.log(t.date, t.type, t.amount, '->', owner ? owner.email : 'NO MATCHING USER', String(t.userId));
  }
  process.exit();
})();