const mongoose = require('mongoose');
const User = require('./models/user');
const Transaction = require('./models/Transaction');

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/valenceFinance');
  const id = '6ac47d806c507e2d5fad0e10';

  const user = await User.findById(id);
  console.log('limits:', user?.limits);
  console.log('emailAlerts:', user?.emailAlerts);
  console.log('lastAlert:', user?.lastAlert);

  const today = new Date();
  const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  console.log('today string:', d);

  const matches = await Transaction.find({ userId: id, type: 'expense', date: { $gte: d } });
  console.log('expenses from today on:', matches.length);
  console.log('total:', matches.reduce((s, t) => s + t.amount, 0));

  process.exit();
})();