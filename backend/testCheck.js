require('dotenv').config();
const mongoose = require('mongoose');
const checkLimits = require('./utils/checkLimits');

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/valenceFinance');  
  await checkLimits('6ac47d806c507e2d5fad0e10');
  console.log('done');
  process.exit();
})();