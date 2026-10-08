## Running with the MongoDB backend

The existing dashboard is served by its Express backend. Start MongoDB, then run:

```powershell
cd "D:\VAC\Day 2\finance\backend"
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5000. The backend uses `backend/.env`; the default local database is `valenceFinance`. See [backend/README.md](backend/README.md) for API routes and setup details. The dashboard retains browser storage as a fallback when an authenticated API request is unavailable.
# VALENCE FINANCE — Minimalist Personal Finance & Expense Intelligence

Valence is a high-productivity, distraction-free personal finance and expense management web application. Designed around the principles of Swiss minimalism and modern productivity workflows (such as Linear and Notion), Valence pairs an uncluttered interface with an intelligent financial advisory engine.

---

## ⚡ Key Features

### 1. Frictionless Quick Entry & Productivity
- **Natural Language Quick Bar**: Type `Coffee 4.50`, `Dinner 35`, or `Salary 4000` on the dashboard and press Enter to instantly record transactions.
- **Speed Keyboard Shortcuts**:
  - `N` or `+`: Open full Record Transaction modal.
  - `/`: Jump directly to transaction search & ledger.
  - `1`, `2`, `3`, `4`: Instant view switching (Overview, Ledger, Budgets & Goals, Tips & Simulator).
  - `D`: Toggle between Dark and Light mode.
  - `?`: Display Keyboard Shortcuts cheat sheet.
  - `Esc`: Close any active modal.
- **Multi-Currency Support**: Instant switching between `$`, `€`, `£`, `₹`, `¥`, `CA$`, and `A$`.

### 2. 50/30/20 Budget Rule Engine
- Classifies expenditures into:
  - **Needs (≤ 50%)**: Housing, Groceries, Utilities, Healthcare, Transportation, Insurance.
  - **Wants (≤ 30%)**: Dining & Drinks, Entertainment, Shopping, Subscriptions, Travel.
  - **Savings & Debt (≥ 20%)**: Emergency Fund, Index Investments, Debt Prepayments.
- Real-time segmented bar gauge comparing your actual spending against the recommended benchmarks.

### 3. Financial Health Score (0 – 100)
A holistic multi-factor scoring model that rates financial health across 4 dimensions:
1. **Savings Rate**: Evaluates the percentage of income retained (target ≥ 20%).
2. **Needs Proportion**: Evaluates fixed overhead weight (target ≤ 50%).
3. **Wants Control**: Assesses discretionary lifestyle creep (target ≤ 30%).
4. **Budget Compliance**: Monitors category overrun frequency across defined limits.

### 4. Smart Financial Advice & Tips Engine
- **Discretionary Trim Recommendations**: Detects top spending leak categories (e.g. Dining Out) and calculates exact monthly and annual savings from a 20–25% reduction.
- **Subscription Leak Audit**: Scans recurring monthly subscriptions and calculates annual leakage.
- **The $5/Day Wealth Multiplier**: Demonstrates how small micro-savings compounding at 7–8% annual returns grow into tens of thousands in 10 and 20 years.
- **Goal Acceleration Roadmap**: Computes how many months earlier you can reach milestones (like a 6-month Emergency Fund) by redirecting small surpluses.

### 5. Interactive "What-If" Savings Simulator
- Move the slider to test reducing 'Wants' by 5% to 50%.
- Dynamically computes:
  - Extra Monthly Savings
  - Extra Annual Savings
  - Projected New Savings Rate %
  - **10-Year Compounded Return** at a conservative 7% annual index rate.

### 6. Transactions Ledger & Data Management
- Live search by keyword, note, or amount.
- Filter by transaction type (Income vs Expense) or category.
- **Export to CSV** for spreadsheets or taxes.
- **Demo Data Toggle** for instant preview with realistic financial scenarios.
- **LocalStorage Persistence**: All user entries are retained locally in the browser.

---

## 🚀 Running the Web App

The application runs directly in any modern web browser.

The authenticated dashboard must be served by the Express backend; opening `index.html` directly or using a static file server does not provide the `/api/auth` and `/api/transactions` endpoints.

---

## 🎨 Design Philosophy
- **Colors**: Refined obsidian `#090a0f`, deep slate `#111319`, high-contrast crisp text `#f8fafc`, emerald `#10b981` (growth/savings), rose `#f43f5e` (expenses/alerts), and royal blue `#3b82f6` (needs/accents).
- **Typography**: `Plus Jakarta Sans` for clean UI reading and `JetBrains Mono` for tabular financial figures.
- **Zero Heavy Dependencies**: Pure HTML5, modern CSS custom properties, and vanilla ES6 modules with responsive SVG vector charts.


