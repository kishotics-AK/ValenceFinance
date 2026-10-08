const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const path = require('path');
const cron = require('node-cron');                       // NEW

require('dotenv').config();

const User = require('./models/user');                   // NEW
const checkLimits = require('./utils/checkLimits');      // NEW

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valenceFinance';
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  'http://localhost:5000,http://127.0.0.1:5000'
)
  .split(',')
  .map((origin) => origin.trim());

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing from backend/.env');
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin is not allowed by CORS.');
    error.status = 403;
    return callback(error);
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

app.use(session({
  name: 'valence.sid',
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/alerts', require('./routes/alerts'));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Only the front-end is public. Serving the whole parent folder exposed
// backend/ source code and backups/ (users' financial data).
const frontendRoot = path.resolve(__dirname, '..');
app.use('/css', express.static(path.join(frontendRoot, 'css')));
app.use('/js', express.static(path.join(frontendRoot, 'js')));

app.get(['/', '/index.html'], (_req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

app.use((error, _req, res, _next) => {
  const status =
    error.status === 403
      ? 403
      : error.type === 'entity.parse.failed'
        ? 400
        : error.name === 'ValidationError' || error.name === 'CastError'
          ? 400
          : error.code === 11000
            ? 409
            : 500;

  if (status === 500) console.error(error);

  res.status(status).json({
    error: status === 500 ? 'Server error.' : error.message
  });
});

// Checks every user's spending limits on a schedule.
// Override with LIMIT_CHECK_CRON in .env (e.g. '* * * * *' = every minute while testing).
const limitCheckCron = process.env.LIMIT_CHECK_CRON || '*/5 * * * *';
let limitCheckRunning = false;

async function runLimitCheck() {
  if (limitCheckRunning) return;   // previous run still going; don't overlap
  limitCheckRunning = true;
  try {
    const users = await User.find({
      emailAlerts: true,
      $or: [
        { 'limits.daily':   { $gt: 0 } },
        { 'limits.weekly':  { $gt: 0 } },
        { 'limits.monthly': { $gt: 0 } },
      ],
    }, '_id');

    for (const u of users) {
      await checkLimits(u._id).catch(console.error);
    }
  } catch (err) {
    console.error('Limit check failed:', err);
  } finally {
    limitCheckRunning = false;
  }
}

function startLimitChecker() {
  if (!cron.validate(limitCheckCron)) {
    throw new Error(`LIMIT_CHECK_CRON "${limitCheckCron}" is not a valid cron expression.`);
  }
  cron.schedule(limitCheckCron, runLimitCheck);
  console.log(`Spending-limit checker scheduled (${limitCheckCron})`);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    startLimitChecker();                                 // NEW
    app.listen(port, '127.0.0.1', () => {
      console.log(`Valence Finance is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });