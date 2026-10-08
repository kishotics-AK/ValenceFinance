# Valence Finance backend

The Express API and the existing finance dashboard run together on port 5000. MongoDB must be running locally.

## Start

```powershell
cd "D:\VAC\Day 2\finance\backend"
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5000. The first dashboard load merges existing browser transactions and profile settings into MongoDB. Later loads use the database; when the API is unavailable, the dashboard keeps working with its browser-stored data.

Configure `backend/.env` if needed. The default local database is `mongodb://127.0.0.1:27017/valenceFinance`.

## API

Public:
- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

Signed in (session cookie `valence.sid`):
- `POST /api/auth/migrate-legacy`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `PUT /api/transactions/replace` (demo reset and clear; validated before anything is deleted)
- `GET /api/profile`
- `PUT /api/profile` (currency, theme, income target, budgets, and goals)
- `GET /api/alerts` (limits, email toggle, last alert times, current daily/weekly/monthly spending)
- `PUT /api/alerts` (`{ emailAlerts, limits: { daily, weekly, monthly } }`, 0 = off)
- `POST /api/alerts/check` (run the limit check now)

## Spending-limit emails

The checker runs on `LIMIT_CHECK_CRON` (default every 5 minutes) and also right after an expense is added or edited. Each period emails at most once; changing a limit allows a fresh alert. Without `EMAIL_USER`/`EMAIL_APP_PASSWORD` in `.env`, emails are printed to the terminal as `[TEST EMAIL]`.

