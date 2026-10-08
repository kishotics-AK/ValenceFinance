/* ==========================================================================
   VALENCE FINANCE — Data Store & State Management
   LocalStorage persistence, realistic default demo dataset, CSV/JSON export
   ========================================================================== */

const STORAGE_KEY = 'valence_finance_v1';

// Standard Category mappings and their 50/30/20 default classification
export const CATEGORY_TIERS = {
  'Housing': 'needs',
  'Groceries': 'needs',
  'Utilities': 'needs',
  'Healthcare': 'needs',
  'Transportation': 'needs',
  'Insurance': 'needs',
  'Debt Payment': 'savings', // Or needs/savings
  'Dining & Drinks': 'wants',
  'Entertainment': 'wants',
  'Shopping': 'wants',
  'Travel & Vacation': 'wants',
  'Subscriptions': 'wants',
  'Personal Care': 'wants',
  'Emergency Fund': 'savings',
  'Investments': 'savings',
  'Retirement': 'savings',
  'Other Expense': 'wants',
  'Salary': 'income',
  'Freelance': 'income',
  'Dividends/Interest': 'income',
  'Other Income': 'income'
};

export const CATEGORY_ICONS = {
  'Housing': '🏠',
  'Groceries': '🛒',
  'Utilities': '⚡',
  'Healthcare': '🏥',
  'Transportation': '🚗',
  'Insurance': '🛡️',
  'Debt Payment': '💳',
  'Dining & Drinks': '☕',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Travel & Vacation': '✈️',
  'Subscriptions': '🔄',
  'Personal Care': '✨',
  'Emergency Fund': '🛡️',
  'Investments': '📈',
  'Retirement': '🏖️',
  'Other Expense': '📦',
  'Salary': '💼',
  'Freelance': '💻',
  'Dividends/Interest': '🪙',
  'Other Income': '💵'
};

const DEFAULT_BUDGETS = {
  'Housing': 1350,
  'Groceries': 450,
  'Utilities': 160,
  'Transportation': 180,
  'Healthcare': 90,
  'Dining & Drinks': 280,
  'Entertainment': 140,
  'Shopping': 180,
  'Subscriptions': 55,
  'Emergency Fund': 400,
  'Investments': 350
};

const DEFAULT_GOALS = [
  {
    id: 'g-1',
    name: 'Emergency Fund (6 Mos)',
    targetAmount: 12000,
    currentAmount: 8400,
    targetDate: '2026-12-31',
    icon: '🛡️'
  },
  {
    id: 'g-2',
    name: 'Index Fund Investment',
    targetAmount: 10000,
    currentAmount: 4200,
    targetDate: '2027-06-30',
    icon: '📈'
  },
  {
    id: 'g-3',
    name: 'Japan Autumn Trip',
    targetAmount: 3200,
    currentAmount: 1950,
    targetDate: '2026-10-15',
    icon: '✈️'
  }
];

function generateDemoTransactions() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  const formatDate = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`;

  return [
    // Income
    { id: 'tx-1', type: 'income', amount: 3800, category: 'Salary', tier: 'income', date: formatDate(1), notes: 'Primary Tech Salary', isRecurring: true },
    { id: 'tx-2', type: 'income', amount: 650, category: 'Freelance', tier: 'income', date: formatDate(12), notes: 'UI Design Consultation', isRecurring: false },

    // Needs
    { id: 'tx-3', type: 'expense', amount: 1350, category: 'Housing', tier: 'needs', date: formatDate(1), notes: 'Apartment Rent & Parking', isRecurring: true },
    { id: 'tx-4', type: 'expense', amount: 142, category: 'Groceries', tier: 'needs', date: formatDate(3), notes: 'Weekly produce & pantry', isRecurring: false },
    { id: 'tx-5', type: 'expense', amount: 110, category: 'Utilities', tier: 'needs', date: formatDate(5), notes: 'Electric & Fiber Internet', isRecurring: true },
    { id: 'tx-6', type: 'expense', amount: 135, category: 'Groceries', tier: 'needs', date: formatDate(10), notes: 'Organic market restocking', isRecurring: false },
    { id: 'tx-7', type: 'expense', amount: 65, category: 'Transportation', tier: 'needs', date: formatDate(7), notes: 'Metro transit pass', isRecurring: true },
    { id: 'tx-8', type: 'expense', amount: 118, category: 'Groceries', tier: 'needs', date: formatDate(17), notes: 'Bulk warehouse haul', isRecurring: false },
    { id: 'tx-9', type: 'expense', amount: 75, category: 'Healthcare', tier: 'needs', date: formatDate(14), notes: 'Prescription & vitamins', isRecurring: false },

    // Wants
    { id: 'tx-10', type: 'expense', amount: 68, category: 'Dining & Drinks', tier: 'wants', date: formatDate(2), notes: 'Friday Ramen & Boba with team', isRecurring: false },
    { id: 'tx-11', type: 'expense', amount: 18.99, category: 'Subscriptions', tier: 'wants', date: formatDate(4), notes: 'Netflix 4K Premium', isRecurring: true },
    { id: 'tx-12', type: 'expense', amount: 11.99, category: 'Subscriptions', tier: 'wants', date: formatDate(6), notes: 'Spotify Music Duo', isRecurring: true },
    { id: 'tx-13', type: 'expense', amount: 22.00, category: 'Subscriptions', tier: 'wants', date: formatDate(8), notes: 'Cloud AI Assistant', isRecurring: true },
    { id: 'tx-14', type: 'expense', amount: 84, category: 'Dining & Drinks', tier: 'wants', date: formatDate(9), notes: 'Italian bistro dinner date', isRecurring: false },
    { id: 'tx-15', type: 'expense', amount: 95, category: 'Shopping', tier: 'wants', date: formatDate(11), notes: 'Ergonomic desk accessories', isRecurring: false },
    { id: 'tx-16', type: 'expense', amount: 48, category: 'Entertainment', tier: 'wants', date: formatDate(15), notes: 'IMAX Cinema tickets & snacks', isRecurring: false },
    { id: 'tx-17', type: 'expense', amount: 72, category: 'Dining & Drinks', tier: 'wants', date: formatDate(19), notes: 'Weekend brunch & artisan coffee', isRecurring: false },
    { id: 'tx-18', type: 'expense', amount: 62, category: 'Shopping', tier: 'wants', date: formatDate(21), notes: 'Books & Kindle edition', isRecurring: false },

    // Savings / Investments
    { id: 'tx-19', type: 'expense', amount: 400, category: 'Emergency Fund', tier: 'savings', date: formatDate(1), notes: 'High-Yield Savings Deposit', isRecurring: true },
    { id: 'tx-20', type: 'expense', amount: 350, category: 'Investments', tier: 'savings', date: formatDate(2), notes: 'Total Stock Market Index ETF', isRecurring: true }
  ];
}

class Store {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      currency: '$',
      theme: 'dark',
      monthlyIncomeTarget: 4450,
      transactions: generateDemoTransactions(),
      budgets: { ...DEFAULT_BUDGETS },
      goals: [ ...DEFAULT_GOALS ]
    };
  }

  loadState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...this.getDefaultState(),
            ...parsed,
            budgets: { ...DEFAULT_BUDGETS, ...(parsed.budgets || {}) }
          };
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage, using demo defaults:', e);
    }
    return this.getDefaultState();
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Currency
  setCurrency(curr) {
    this.state.currency = curr;
    this.save();
  }

  getCurrency() {
    return this.state.currency || '$';
  }

  // Theme
  setTheme(theme) {
    this.state.theme = theme;
    this.save();
  }

  getTheme() {
    return this.state.theme || 'dark';
  }

  // Transactions
  getTransactions() {
    return this.state.transactions || [];
  }

  addTransaction(tx) {
    const newTx = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: tx.type || 'expense',
      amount: parseFloat(tx.amount) || 0,
      category: tx.category || 'Other Expense',
      tier: tx.tier || CATEGORY_TIERS[tx.category] || 'wants',
      date: tx.date || new Date().toISOString().split('T')[0],
      notes: tx.notes || '',
      isRecurring: Boolean(tx.isRecurring)
    };
    this.state.transactions.unshift(newTx);
    this.save();
    return newTx;
  }

  deleteTransaction(id) {
    this.state.transactions = this.state.transactions.filter(t => t.id !== id);
    this.save();
  }

  // Budgets
  getBudgets() {
    return this.state.budgets || {};
  }

  setBudget(category, amount) {
    this.state.budgets[category] = Math.max(0, parseFloat(amount) || 0);
    this.save();
  }

  // Goals
  getGoals() {
    return this.state.goals || [];
  }

  addGoal(goal) {
    const newGoal = {
      id: 'g-' + Date.now(),
      name: goal.name,
      targetAmount: parseFloat(goal.targetAmount) || 0,
      currentAmount: parseFloat(goal.currentAmount) || 0,
      targetDate: goal.targetDate || '',
      icon: goal.icon || '🎯'
    };
    this.state.goals.push(newGoal);
    this.save();
    return newGoal;
  }

  updateGoal(id, updates) {
    const idx = this.state.goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.state.goals[idx] = { ...this.state.goals[idx], ...updates };
      this.save();
    }
  }

  deleteGoal(id) {
    this.state.goals = this.state.goals.filter(g => g.id !== id);
    this.save();
  }

  // Resets
  resetToDemo() {
    this.state = this.getDefaultState();
    this.save();
  }

  clearAll() {
    this.state = {
      currency: this.state.currency,
      theme: this.state.theme,
      monthlyIncomeTarget: 0,
      transactions: [],
      budgets: { ...DEFAULT_BUDGETS },
      goals: []
    };
    this.save();
  }

  // Export & Import
  exportCSV() {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Tier (50/30/20)', 'Date', 'Notes', 'IsRecurring'];
    const rows = this.state.transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.tier,
      t.date,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      t.isRecurring ? 'Yes' : 'No'
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.transactions)) {
        this.state = { ...this.state, ...data };
        this.save();
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }
}

export const store = new Store();
