const mongoose = require('mongoose');
const User = require('./models/user');

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/valenceFinance');

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('collections:', collections.map(c => c.name));

  console.log('users counted by the User model:', await User.countDocuments());

  const some = await User.find().limit(5);
  some.forEach(u => console.log(String(u._id), u.email));

  process.exit();
})();