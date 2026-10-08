/* ==========================================================================
   VALENCE FINANCE — Core Application Engine
   Self-contained, zero-dependency, works on both http:// and file:/// protocols
   ========================================================================== */

(function () {
  'use strict';

  // --- Constants & Category Definitions ---
  const STORAGE_KEY = 'valence_finance_v1';
const saved = localStorage.getItem(STORAGE_KEY);

  const CATEGORY_TIERS = {
    'Housing': 'needs',
    'Groceries': 'needs',
    'Utilities': 'needs',
    'Healthcare': 'needs',
    'Transportation': 'needs',
    'Insurance': 'needs',
    'Debt Payment': 'savings',
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

  const CATEGORY_ICONS = {
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

  // --- Helpers ---
  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Local calendar date (toISOString() is UTC and gives "yesterday" for users ahead of UTC,
  // which pushes new records into the previous month around midnight).
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Server documents may use _id and ISO datetimes; the UI expects id and YYYY-MM-DD.
  function normalizeTx(t) {
    if (!t) return null;
    const id = t.id ?? t._id;
    if (id === undefined || id === null || id === '') return null;
    const type = t.type === 'income' ? 'income' : 'expense';
    return {
      id: String(id),
      type,
      amount: Math.abs(parseFloat(t.amount)) || 0,
      category: t.category || (type === 'income' ? 'Other Income' : 'Other Expense'),
      tier: t.tier || CATEGORY_TIERS[t.category] || (type === 'income' ? 'income' : 'wants'),
      date: t.date ? String(t.date).slice(0, 10) : '',
      notes: t.notes || '',
      isRecurring: Boolean(t.isRecurring)
    };
  }

  // --- Data Store ---
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
    goals: [ ...DEFAULT_GOALS ],
    customCategories: []
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
          budgets: { ...DEFAULT_BUDGETS, ...(parsed.budgets || {}) },
          customCategories: Array.isArray(parsed.customCategories)
            ? parsed.customCategories
            : []
        };
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage, using demo defaults:', e);
  }
  return this.getDefaultState();
}

    // Writes to the browser only. (This method was called but never defined, so every save() threw.)
    saveLocal() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }

    // Saves locally and syncs settings (currency, theme, budgets, goals, categories) to the server.
    save() {
      this.saveLocal();
      const { currency, theme, monthlyIncomeTarget, budgets, goals, customCategories } = this.state;
      window.FinanceApi?.saveProfile({
        currency,
        theme,
        monthlyIncomeTarget,
        budgets,
        goals,
        customCategories
      }).catch(error => this.syncError('your settings', error));
    }

    syncError(what, error) {
      console.warn(`Could not sync ${what} to the server.`, error);
      const now = Date.now();
      if (this._lastSyncToast && now - this._lastSyncToast < 4000) return;
      this._lastSyncToast = now;
      const app = window.valenceApp;
      if (!app) return;
      if (error && error.status === 401) {
        app.showToast('Session expired. Please sign in again.', 'error');
        setTimeout(() => window.dispatchEvent(new Event('finance:session-expired')), 1200);
      } else {
        app.showToast(`Saved in this browser only: the server did not accept ${what}.`, 'error');
      }
    }

    setCurrency(curr) {
      this.state.currency = curr;
      this.save();
    }

    getCurrency() {
      return this.state.currency || '$';
    }

    setTheme(theme) {
      this.state.theme = theme;
      this.save();
    }

    getTheme() {
      return this.state.theme || 'dark';
    }

    getTransactions() {
      return this.state.transactions || [];
    }

    addTransaction(tx) {
      const newTx = {
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: tx.type || 'expense',
        amount: Math.abs(parseFloat(tx.amount)) || 0,
        category: tx.category || 'Other Expense',
        tier: tx.tier || CATEGORY_TIERS[tx.category] || 'wants',
        date: tx.date || todayStr(),
        notes: tx.notes || '',
        isRecurring: Boolean(tx.isRecurring)
      };
      this.state.transactions.unshift(newTx);
      this.saveLocal();
      window.FinanceApi?.create(newTx).catch(error => this.syncError('the new transaction', error));
      return newTx;
    }

    updateTransaction(id, updates) {
      const index = this.state.transactions.findIndex(t => t.id === id);
      if (index < 0) return;
      this.state.transactions[index] = { ...this.state.transactions[index], ...updates };
      this.saveLocal();
      window.FinanceApi?.update(id, this.state.transactions[index]).catch(error => this.syncError('the edited transaction', error));
    }

    deleteTransaction(id) {
      this.state.transactions = this.state.transactions.filter(t => t.id !== id);
      this.saveLocal();
      window.FinanceApi?.remove(id).catch(error => this.syncError('the deletion', error));
    }

    getBudgets() {
      return this.state.budgets || {};
    }

    setBudget(category, amount) {
      this.state.budgets[category] = Math.max(0, parseFloat(amount) || 0);
      this.save();
    }

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

    deleteGoal(id) {
      this.state.goals = this.state.goals.filter(g => g.id !== id);
      this.save();
    }

    resetToDemo() {
      this.state = this.getDefaultState();
      this.save();
      window.FinanceApi?.replace(this.state.transactions).catch(error => this.syncError('the demo data', error));
    }

    clearAll() {
      this.state = {
        currency: this.state.currency,
        theme: this.state.theme,
        monthlyIncomeTarget: 0,
        transactions: [],
        budgets: { ...DEFAULT_BUDGETS },
        goals: [],
        customCategories: []
      };
      this.save();
      window.FinanceApi?.replace(this.state.transactions).catch(error => this.syncError('the cleared data', error));
    
    }

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
  }

  // --- Analytics Engine ---
  class AnalyticsEngine {
    constructor(storeInstance) {
      this.store = storeInstance;
    }

    getCurrentMonthTransactions() {
      const txs = this.store.getTransactions();
      const now = new Date();
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentMonth = txs.filter(t => t.date && t.date.startsWith(currentYearMonth));
      return currentMonth.length > 0 ? currentMonth : txs;
    }

    computeOverview(transactions = null) {
      const txs = transactions || this.getCurrentMonthTransactions();
      const currency = this.store.getCurrency();

      let totalIncome = 0;
      let totalExpense = 0;

      let needsTotal = 0;
      let wantsTotal = 0;
      let savingsTotal = 0;

      const categorySpend = {};
      const categoryIncome = {};
      let recurringExpenseTotal = 0;

      txs.forEach(t => {
        const amt = Math.abs(parseFloat(t.amount) || 0);
        if (t.type === 'income') {
          totalIncome += amt;
          categoryIncome[t.category] = (categoryIncome[t.category] || 0) + amt;
        } else {
          totalExpense += amt;
          categorySpend[t.category] = (categorySpend[t.category] || 0) + amt;

          if (t.isRecurring) {
            recurringExpenseTotal += amt;
          }

          const tier = t.tier || CATEGORY_TIERS[t.category] || 'wants';
          if (tier === 'needs') {
            needsTotal += amt;
          } else if (tier === 'savings') {
            savingsTotal += amt;
          } else {
            wantsTotal += amt;
          }
        }
      });

      const netSavings = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

      const baseForRatios = totalIncome > 0 ? totalIncome : totalExpense || 1;
      const needsPct = (needsTotal / baseForRatios) * 100;
      const wantsPct = (wantsTotal / baseForRatios) * 100;
      const savingsPct = (savingsTotal / baseForRatios) * 100;

      // Budgets comparison
      const budgets = this.store.getBudgets();
      const budgetAnalysis = Object.keys(budgets).map(category => {
        const budgetAmount = budgets[category] || 0;
        const spent = categorySpend[category] || 0;
        const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : (spent > 0 ? 100 : 0);
        const remaining = budgetAmount - spent;
        return {
          category,
          budget: budgetAmount,
          spent,
          percentUsed,
          remaining,
          isOver: spent > budgetAmount
        };
      });

      // Financial Health Score
      const healthScore = this.computeHealthScore({
        totalIncome,
        totalExpense,
        savingsRate,
        needsPct,
        wantsPct,
        budgetAnalysis
      });

      return {
        currency,
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        needsTotal,
        wantsTotal,
        savingsTotal,
        needsPct,
        wantsPct,
        savingsPct,
        recurringExpenseTotal,
        categorySpend,
        categoryIncome,
        budgetAnalysis,
        healthScore,
        transactionCount: txs.length
      };
    }

    computeHealthScore({ totalIncome, totalExpense, savingsRate, needsPct, wantsPct, budgetAnalysis }) {
      if (totalIncome === 0 && totalExpense === 0) {
        return { score: 0, status: 'No Data', grade: 'N/A', description: 'Add your income and expenses to calculate your score.' };
      }

      let score = 0;

      // Savings Rate (Max 30)
      if (savingsRate >= 25) score += 30;
      else if (savingsRate >= 20) score += 26;
      else if (savingsRate >= 15) score += 20;
      else if (savingsRate >= 10) score += 14;
      else if (savingsRate > 0) score += 8;

      // Needs Ratio (Max 25)
      if (needsPct <= 50) score += 25;
      else if (needsPct <= 60) score += 18;
      else if (needsPct <= 70) score += 10;
      else score += 4;

      // Wants Ratio (Max 25)
      if (wantsPct <= 30) score += 25;
      else if (wantsPct <= 35) score += 20;
      else if (wantsPct <= 45) score += 12;
      else score += 4;

      // Budget Discipline (Max 20)
      if (budgetAnalysis && budgetAnalysis.length > 0) {
        const underBudgetCategories = budgetAnalysis.filter(b => !b.isOver).length;
        score += Math.round((underBudgetCategories / budgetAnalysis.length) * 20);
      } else {
        score += 15;
      }

      score = Math.min(100, Math.max(0, Math.round(score)));

      let status = 'Fair';
      let grade = 'B';
      let description = 'Expenses are close to income. Trimming non-essential wants will strengthen your safety runway.';

      if (score >= 85) {
        status = 'Excellent';
        grade = 'A+';
        description = 'Top tier financial discipline! High savings rate and strict budget control.';
      } else if (score >= 70) {
        status = 'Solid';
        grade = 'A';
        description = 'Well-balanced cashflow with reliable savings and controlled expenses.';
      } else if (score >= 50) {
        status = 'Fair';
        grade = 'B';
        description = 'Expenses are close to income. Trimming wants will strengthen your financial runway.';
      } else {
        status = 'Needs Attention';
        grade = 'C';
        description = 'Expenses exceed or rival income. Immediate attention to recurring costs and wants is recommended.';
      }

      return { score, status, grade, description };
    }
  }

  // --- Financial Advisor & Tips Engine ---
  class AdvisorEngine {
    constructor(storeInstance, analyticsInstance) {
      this.store = storeInstance;
      this.analytics = analyticsInstance;
    }

    generateTips(overview) {
      const tips = [];
      const curr = overview.currency;

      // Tip 1: 50/30/20 Rule Analysis
      if (overview.totalIncome > 0) {
        if (overview.wantsPct > 35) {
          const excessAmt = Math.round(((overview.wantsPct - 30) / 100) * overview.totalIncome);
          tips.push({
            id: 'tip-wants-excess',
            priority: 'high',
            category: '50/30/20 Rule',
            title: `Discretionary 'Wants' Exceed 30% Benchmark`,
            icon: '⚠️',
            text: `Your Wants are currently ${overview.wantsPct.toFixed(1)}% of income (${curr}${Math.round(overview.wantsTotal)}). Reducing non-essential purchases by ${curr}${excessAmt}/mo brings you into optimal 50/30/20 balance.`,
            potentialMonthly: excessAmt
          });
        } else if (overview.wantsPct <= 30 && overview.savingsRate >= 20) {
          tips.push({
            id: 'tip-rule-balanced',
            priority: 'positive',
            category: '50/30/20 Rule',
            title: `Excellent 50/30/20 Allocation`,
            icon: '✅',
            text: `Your budget adheres smoothly to financial health standards. Needs: ${overview.needsPct.toFixed(0)}%, Wants: ${overview.wantsPct.toFixed(0)}%, Savings: ${overview.savingsPct.toFixed(0)}%.`,
            potentialMonthly: null
          });
        }
      }

      // Tip 2: Top Spending Discretionary Category Trim
      const discretionaryCategories = ['Dining & Drinks', 'Shopping', 'Entertainment', 'Subscriptions'];
      let topDiscretionary = null;
      let maxDiscSpend = 0;

      discretionaryCategories.forEach(cat => {
        const spend = overview.categorySpend[cat] || 0;
        if (spend > maxDiscSpend) {
          maxDiscSpend = spend;
          topDiscretionary = cat;
        }
      });

      if (topDiscretionary && maxDiscSpend > 80) {
        const trim25 = Math.round(maxDiscSpend * 0.25);
        const annualTrim = trim25 * 12;
        tips.push({
          id: 'tip-top-discretionary',
          priority: 'medium',
          category: 'Spending Optimization',
          title: `Trim High Spend in ${topDiscretionary}`,
          icon: '💡',
          text: `You spent ${curr}${Math.round(maxDiscSpend)} on ${topDiscretionary} this period. Trimming just 25% of this category frees up ${curr}${trim25}/month (${curr}${annualTrim.toLocaleString()}/year) for debt reduction or investing.`,
          potentialMonthly: trim25
        });
      }

      // Tip 3: Recurring Subscriptions Audit
      const recurringTxs = this.store.getTransactions().filter(t => t.type === 'expense' && (t.isRecurring || t.category === 'Subscriptions'));
      const subscriptionTotal = recurringTxs.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);

      if (recurringTxs.length >= 2 && subscriptionTotal > 25) {
        const annualSub = Math.round(subscriptionTotal * 12);
        tips.push({
          id: 'tip-subscriptions-audit',
          priority: 'medium',
          category: 'Recurring Costs',
          title: `Subscription & Recurring Leak Check`,
          icon: '🔄',
          text: `You have ${recurringTxs.length} recurring expenses totaling ${curr}${Math.round(subscriptionTotal)}/mo (${curr}${annualSub.toLocaleString()}/yr). Auditing and canceling 1–2 unused streaming or software tools immediately saves recurring cash.`,
          potentialMonthly: Math.round(subscriptionTotal * 0.3)
        });
      }

      // Tip 4: Category Over-Budget Alerts
      const overBudgets = overview.budgetAnalysis.filter(b => b.isOver);
      if (overBudgets.length > 0) {
        const topOver = overBudgets[0];
        const overrun = Math.round(topOver.spent - topOver.budget);
        tips.push({
          id: 'tip-budget-overrun',
          priority: 'high',
          category: 'Budget Alert',
          title: `${topOver.category} is Over Budget by ${curr}${overrun}`,
          icon: '🚨',
          text: `Spent ${curr}${Math.round(topOver.spent)} against a ${curr}${topOver.budget} limit (${topOver.percentUsed.toFixed(0)}%). Freeze non-critical spending in this category until next month.`,
          potentialMonthly: overrun
        });
      }

      // Tip 5: Micro-Savings & Compound Interest Wealth Power ($5/day)
      tips.push({
        id: 'tip-micro-savings',
        priority: 'info',
        category: 'Compound Wealth',
        title: 'The "$5/Day Rule" Wealth Multiplier',
        icon: '📈',
        text: `Eliminating just $5/day in casual spending generates ${curr}150/month. If invested at an 8% historical index return, it grows to ${curr}27,440 in 10 years and ${curr}88,350 in 20 years.`,
        potentialMonthly: 150
      });

      // Tip 6: Savings Goal Acceleration
      const goals = this.store.getGoals();
      if (goals.length > 0) {
        const primaryGoal = goals.find(g => g.currentAmount < g.targetAmount) || goals[0];
        const remainingTarget = primaryGoal.targetAmount - primaryGoal.currentAmount;
        if (remainingTarget > 0 && overview.netSavings > 0) {
          const currentMonths = Math.ceil(remainingTarget / overview.netSavings);
          const acceleratedSavings = overview.netSavings + 100;
          const acceleratedMonths = Math.ceil(remainingTarget / acceleratedSavings);
          const savedMonths = currentMonths - acceleratedMonths;

          if (savedMonths > 0) {
            tips.push({
              id: 'tip-goal-acceleration',
              priority: 'positive',
              category: 'Goal Acceleration',
              title: `Accelerate "${esc(primaryGoal.name)}" by ${savedMonths} Month${savedMonths > 1 ? 's' : ''}`,
              icon: '🚀',
              text: `Allocating an additional ${curr}100/mo to your "${esc(primaryGoal.name)}" would allow you to hit your ${curr}${primaryGoal.targetAmount.toLocaleString()} target in ${acceleratedMonths} months instead of ${currentMonths}.`,
              potentialMonthly: 100
            });
          }
        }
      }

      return tips;
    }

    simulateScenario(percentWantsReduction = 20) {
      const overview = this.analytics.computeOverview();
      const curr = overview.currency;
      const wantsTrimAmount = (overview.wantsTotal * (percentWantsReduction / 100));
      const newMonthlySavings = overview.netSavings + wantsTrimAmount;
      const newSavingsRate = overview.totalIncome > 0 ? (newMonthlySavings / overview.totalIncome) * 100 : 0;
      const annualSavingsIncrease = wantsTrimAmount * 12;

      const monthlyRate = 0.07 / 12;
      const totalMonths = 120;
      const futureTenYears = wantsTrimAmount > 0 
        ? wantsTrimAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
        : 0;

      return {
        currency: curr,
        percentReduction: percentWantsReduction,
        monthlyExtra: Math.round(wantsTrimAmount),
        annualExtra: Math.round(annualSavingsIncrease),
        newMonthlySavings: Math.round(newMonthlySavings),
        newSavingsRate: newSavingsRate.toFixed(1),
        rateDiff: (newSavingsRate - overview.savingsRate).toFixed(1),
        futureTenYears: Math.round(futureTenYears)
      };
    }
  }

  // --- SVG Charts Engine ---
  class ChartsEngine {
    renderCashflowBars(containerId, overview) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const { totalIncome, totalExpense, netSavings, currency } = overview;
      const maxVal = Math.max(totalIncome, totalExpense, 1);

      const incomeHeight = Math.max(8, Math.round((totalIncome / maxVal) * 100));
      const expenseHeight = Math.max(8, Math.round((totalExpense / maxVal) * 100));
      const netHeight = Math.max(8, Math.round((Math.max(0, netSavings) / maxVal) * 100));

      container.innerHTML = `
        <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding: 10px 0 30px; position: relative;">
          <!-- Income Bar -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 28%; height: 100%; justify-content: flex-end; gap: 8px;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--accent-emerald);">${currency}${Math.round(totalIncome)}</span>
            <div style="width: 100%; max-width: 48px; height: ${incomeHeight}%; background: linear-gradient(180deg, #10b981, rgba(16, 185, 129, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.3s ease;"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Income</span>
          </div>

          <!-- Expense Bar -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 28%; height: 100%; justify-content: flex-end; gap: 8px;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--accent-rose);">${currency}${Math.round(totalExpense)}</span>
            <div style="width: 100%; max-width: 48px; height: ${expenseHeight}%; background: linear-gradient(180deg, #f43f5e, rgba(244, 63, 94, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.3s ease;"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Expenses</span>
          </div>

          <!-- Net Savings Bar -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 28%; height: 100%; justify-content: flex-end; gap: 8px;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: ${netSavings >= 0 ? 'var(--accent-primary)' : 'var(--accent-rose)'};">
              ${currency}${Math.round(netSavings)}
            </span>
            <div style="width: 100%; max-width: 48px; height: ${netHeight}%; background: linear-gradient(180deg, #3b82f6, rgba(59, 130, 246, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.3s ease;"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Net Flow</span>
          </div>
        </div>
      `;
    }

    renderCategoryDonut(containerId, overview) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const { categorySpend, totalExpense, currency } = overview;
      const entries = Object.entries(categorySpend)
        .filter(([_, val]) => val > 0)
        .sort((a, b) => b[1] - a[1]);

      if (entries.length === 0 || totalExpense === 0) {
        container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 180px; color: var(--text-tertiary); font-size: 0.85rem;">
            No expense data to visualize yet
          </div>
        `;
        return;
      }

      const topEntries = entries.slice(0, 5);
      const otherTotal = entries.slice(5).reduce((acc, curr) => acc + curr[1], 0);
      if (otherTotal > 0) {
        topEntries.push(['Other', otherTotal]);
      }

      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
      const radius = 60;
      const strokeWidth = 20;
      const circumference = 2 * Math.PI * radius;
      let accumulatedAngle = 0;

      const segments = topEntries.map(([cat, val], idx) => {
        const pct = val / totalExpense;
        const strokeDash = pct * circumference;
        const strokeDashoffset = -accumulatedAngle;
        accumulatedAngle += strokeDash;
        const color = colors[idx % colors.length];

        return {
          category: cat,
          value: val,
          percentage: (pct * 100).toFixed(0),
          color,
          strokeDash: `${strokeDash.toFixed(2)} ${circumference.toFixed(2)}`,
          strokeDashoffset: strokeDashoffset.toFixed(2)
        };
      });

      const svgPaths = segments.map(seg => `
        <circle
          cx="90" cy="90" r="${radius}"
          fill="transparent"
          stroke="${seg.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${seg.strokeDash}"
          stroke-dashoffset="${seg.strokeDashoffset}"
        />
      `).join('');

      const legendHtml = segments.map(seg => `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; padding: 2px 0;">
          <span style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${seg.color}; flex-shrink: 0;"></span>
            ${esc(seg.category)}
          </span>
          <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-primary);">${seg.percentage}%</span>
        </div>
      `).join('');

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 8px 0;">
          <div style="position: relative; width: 170px; height: 170px; flex-shrink: 0;">
            <svg viewBox="0 0 180 180" style="width: 100%; height: 100%;">
              <g transform="rotate(-90 90 90)">
                <circle cx="90" cy="90" r="${radius}" fill="transparent" stroke="var(--bg-tertiary)" stroke-width="${strokeWidth}" />
                ${svgPaths}
              </g>
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
              <span style="font-size: 0.65rem; color: var(--text-tertiary); text-transform: uppercase;">Total Spent</span>
              <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${currency}${Math.round(totalExpense)}</span>
            </div>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            ${legendHtml}
          </div>
        </div>
      `;
    }
  }

  // --- Main Application Coordinator ---
  class App {
    constructor() {
      this.store = new Store();
      this.analytics = new AnalyticsEngine(this.store);
      this.advisor = new AdvisorEngine(this.store, this.analytics);
      this.charts = new ChartsEngine();

      this.currentView = 'overview';
      this.editingTransactionId = null;
      this.searchTerm = '';
      this.filterType = 'all';
      this.filterCategory = 'all';
    }

    async init() {
      // Bind the UI first so buttons work even if the network is slow or down.
      this.applyTheme(this.store.getTheme());
      this.initEventListeners();
      this.initKeyboardShortcuts();
      this.render();

      await this.syncProfile();
      await this.syncTransactions();

      this.applyTheme(this.store.getTheme());
      const currencySelect = document.getElementById('currency-select');
      if (currencySelect) currencySelect.value = this.store.getCurrency();
      this.render();
    }

   async syncProfile() {
  if (!window.FinanceApi) return;

  try {
    const remote = await window.FinanceApi.getProfile();

    if (remote) {
      Object.assign(this.store.state, {
        currency: remote.currency || this.store.state.currency,
        theme: remote.theme || this.store.state.theme,
        monthlyIncomeTarget:
          remote.monthlyIncomeTarget ?? this.store.state.monthlyIncomeTarget,
        budgets: {
          ...this.store.state.budgets,
          ...(remote.budgets || {})
        },
        goals: Array.isArray(remote.goals)
          ? remote.goals
          : this.store.state.goals,
        customCategories: Array.isArray(remote.customCategories)
          ? remote.customCategories
          : this.store.state.customCategories
      });

      this.store.saveLocal();
    } else {
      const {
        currency,
        theme,
        monthlyIncomeTarget,
        budgets,
        goals,
        customCategories
      } = this.store.state;

      await window.FinanceApi.saveProfile({
        currency,
        theme,
        monthlyIncomeTarget,
        budgets,
        goals,
        customCategories
      });
    }
  } catch (error) {
    console.warn(
      'Finance profile API unavailable; continuing with browser storage.',
      error
    );
  }
}
    async syncTransactions() {
      if (!window.FinanceApi) return;
      try {
        const remote = (await window.FinanceApi.list() || []).map(normalizeTx).filter(Boolean);
        if (remote.length > 0) {
          // The server is the source of truth; merging with stale browser data resurrected deleted records.
          this.store.state.transactions = remote;
          this.store.saveLocal();
        } else if (this.store.getTransactions().length > 0) {
          // Empty account: upload what exists locally (first run / demo data).
          await window.FinanceApi.replace(this.store.getTransactions());
        }
      } catch (error) {
        this.store.syncError('your transactions', error);
      }
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
        themeBtn.setAttribute('title', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode (D)`);
      }
    }

    toggleTheme() {
      const current = this.store.getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      this.store.setTheme(next);
      this.applyTheme(next);
      this.showToast(`Switched to ${next} theme`, 'info');
    }

    initKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          if (e.key === 'Escape') {
            document.activeElement.blur();
            this.closeAllModals();
          }
          return;
        }

        if (e.key === 'Escape') {
          this.closeAllModals();
        } else if (e.key === 'n' || e.key === 'N' || e.key === '+') {
          e.preventDefault();
          this.openTransactionModal();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          this.toggleTheme();
        } else if (e.key === '/') {
          e.preventDefault();
          this.switchView('transactions');
          setTimeout(() => {
            const searchInput = document.getElementById('tx-search-input');
            if (searchInput) searchInput.focus();
          }, 50);
        } else if (e.key === '1') {
          this.switchView('overview');
        } else if (e.key === '2') {
          this.switchView('transactions');
        } else if (e.key === '3') {
          this.switchView('budgets');
        } else if (e.key === '4') {
          this.switchView('advisor');
        } else if (e.key === '?') {
          this.openModal('shortcuts-modal');
        }
      });
    }

    initEventListeners() {
      // Navigation tabs
      document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const view = tab.getAttribute('data-view');
          if (view) this.switchView(view);
        });
      });

      // Brand click
      document.querySelector('.brand')?.addEventListener('click', () => this.switchView('overview'));

      // Theme toggle
      document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

      // Currency selector
      const currencySelect = document.getElementById('currency-select');
      if (currencySelect) {
        currencySelect.value = this.store.getCurrency();
        currencySelect.addEventListener('change', (e) => {
          this.store.setCurrency(e.target.value);
          this.render();
          this.showToast(`Currency changed to ${e.target.value}`, 'info');
        });
      }

      // Quick Add button
      document.getElementById('quick-add-btn')?.addEventListener('click', () => {
        this.openTransactionModal();
      });

      // Shortcuts button
      document.getElementById('shortcuts-btn')?.addEventListener('click', () => {
        this.openModal('shortcuts-modal');
      });

      // Modal close buttons
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => this.closeAllModals());
      });

      // Modal background click
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.closeAllModals();
        });
      });

      // Transaction form submission
      document.getElementById('transaction-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveTransaction();
      });

      // Type toggles
      document.getElementById('type-expense-btn')?.addEventListener('click', () => this.setFormType('expense'));
      document.getElementById('type-income-btn')?.addEventListener('click', () => this.setFormType('income'));

      // Add custom expense categories and persist them with the profile.
      document.getElementById('add-category-btn')?.addEventListener('click', () => {
        const name = window.prompt('Enter a name for the custom category:')?.trim();
        if (!name) return;
        const existing = [...Object.keys(CATEGORY_TIERS), ...this.getCustomCategories().map(category => category.name)];
        if (existing.some(category => category.toLowerCase() === name.toLowerCase())) {
          this.showToast('That category already exists', 'error');
          return;
        }
        if (!Array.isArray(this.store.state.customCategories)) this.store.state.customCategories = [];
        this.store.state.customCategories.push({ name, tier: 'wants' });
        this.store.save();
        this.setFormType('expense');
        document.getElementById('tx-category').value = name;
        this.showToast(`Added custom category: ${name}`, 'success');
      });
      // Category change handler
      document.getElementById('tx-category')?.addEventListener('change', (e) => {
        const cat = e.target.value;
        const tierSelect = document.getElementById('tx-tier');
        const customCategory = this.getCustomCategories().find(category => category.name === cat);
        const tier = CATEGORY_TIERS[cat] || customCategory?.tier;
        if (tierSelect && tier) {
          tierSelect.value = tier;
        }
      });

      // Transaction search & filters
      document.getElementById('tx-search-input')?.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderTransactionsTable();
      });

      document.querySelectorAll('.pill-filter').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.filterType = btn.getAttribute('data-filter') || 'all';
          this.renderTransactionsTable();
        });
      });

      document.getElementById('tx-category-filter')?.addEventListener('change', (e) => {
        this.filterCategory = e.target.value;
        this.renderTransactionsTable();
      });

      // Data actions
      document.getElementById('export-csv-btn')?.addEventListener('click', () => this.handleExportCSV());

      document.getElementById('reset-demo-btn')?.addEventListener('click', () => {
        if (confirm('Reset to rich demo data with realistic transactions and goals?')) {
          this.store.resetToDemo();
          this.render();
          this.showToast('Reset to demo dataset', 'success');
        }
      });

      document.getElementById('clear-data-btn')?.addEventListener('click', () => {
        if (confirm('Clear all your transactions and start blank?')) {
          this.store.clearAll();
          this.render();
          this.showToast('All transaction data cleared', 'info');
        }
      });

      // Goal Form
      document.getElementById('goal-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveGoal();
      });

      document.getElementById('add-goal-btn')?.addEventListener('click', () => {
        this.openModal('goal-modal');
      });

      // Simulator Slider
      const simulatorSlider = document.getElementById('whatif-slider');
      simulatorSlider?.addEventListener('input', (e) => {
        this.updateSimulator(parseInt(e.target.value, 10));
      });

      // Quick Add Natural Language Bar
      const quickBarInput = document.getElementById('quick-bar-input');
      quickBarInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleQuickBarInput(quickBarInput.value);
          quickBarInput.value = '';
        }
      });
    }

    switchView(viewName) {
      this.currentView = viewName;
      document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-view') === viewName);
      });
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${viewName}`);
      });
      this.render();
    }

    getCustomCategories() {
      const categories = Array.isArray(this.store.state.customCategories)
        ? this.store.state.customCategories
        : [];
      return categories.map(category => typeof category === 'string'
        ? { name: category, tier: 'wants' }
        : category && typeof category.name === 'string'
          ? { name: category.name, tier: category.tier || 'wants' }
          : null
      ).filter(category => category && category.name.trim());
    }
    setFormType(type) {
      const expenseBtn = document.getElementById('type-expense-btn');
      const incomeBtn = document.getElementById('type-income-btn');
      const categorySelect = document.getElementById('tx-category');
      const tierGroup = document.getElementById('tier-form-group');

      if (type === 'income') {
        expenseBtn?.classList.remove('active');
        incomeBtn?.classList.add('active');
        if (tierGroup) tierGroup.style.display = 'none';

        if (categorySelect) {
          categorySelect.innerHTML = `
            <option value="Salary">💼 Salary</option>
            <option value="Freelance">💻 Freelance</option>
            <option value="Dividends/Interest">🪙 Dividends/Interest</option>
            <option value="Other Income">💵 Other Income</option>
          `;
        }
      } else {
        incomeBtn?.classList.remove('active');
        expenseBtn?.classList.add('active');
        if (tierGroup) tierGroup.style.display = 'flex';

        if (categorySelect) {
          categorySelect.innerHTML = `
            <optgroup label="Essential Needs (50%)">
              <option value="Housing">🏠 Housing (Rent/Mortgage)</option>
              <option value="Groceries">🛒 Groceries</option>
              <option value="Utilities">⚡ Utilities & Internet</option>
              <option value="Transportation">🚗 Transportation / Commute</option>
              <option value="Healthcare">🏥 Healthcare & Meds</option>
              <option value="Insurance">🛡️ Insurance</option>
            </optgroup>
            <optgroup label="Discretionary Wants (30%)">
              <option value="Dining & Drinks" selected>☕ Dining & Drinks</option>
              <option value="Entertainment">🎬 Entertainment & Leisure</option>
              <option value="Shopping">🛍️ Shopping & Gadgets</option>
              <option value="Subscriptions">🔄 Subscriptions</option>
              <option value="Travel & Vacation">✈️ Travel & Vacation</option>
              <option value="Personal Care">✨ Personal Care</option>
              <option value="Other Expense">📦 Other Expense</option>
            </optgroup>
            <optgroup label="Savings & Debt (20%)">
              <option value="Emergency Fund">🛡️ Emergency Fund</option>
              <option value="Investments">📈 Stocks / ETFs / Index</option>
              <option value="Debt Payment">💳 Debt Repayment</option>
            </optgroup>
            ${this.getCustomCategories().length ? `<optgroup label="Custom Categories">${this.getCustomCategories().map(category => `<option value="${category.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}">🏷️ ${category.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</option>`).join('')}</optgroup>` : ''}
          `;
        }
      }
    }

    openTransactionModal() {
      this.editingTransactionId = null;
      document.getElementById('modal-title-tx').textContent = 'Record Transaction';
      document.getElementById('save-tx-submit-btn').textContent = 'Save Entry';
      this.setFormType('expense');
      const dateInput = document.getElementById('tx-date');
      if (dateInput) dateInput.value = todayStr();
      const amountInput = document.getElementById('tx-amount');
      if (amountInput) { amountInput.value = ''; setTimeout(() => amountInput.focus(), 60); }
      const notesInput = document.getElementById('tx-notes');
      if (notesInput) notesInput.value = '';
      const recInput = document.getElementById('tx-recurring');
      if (recInput) recInput.checked = false;
      this.openModal('transaction-modal');
    }

    editTransaction(id) {
      const tx = this.store.getTransactions().find(item => item.id === id);
      if (!tx) return;
      this.editingTransactionId = id;
      this.setFormType(tx.type);
      document.getElementById('modal-title-tx').textContent = 'Edit Transaction';
      document.getElementById('save-tx-submit-btn').textContent = 'Save Changes';
      document.getElementById('tx-amount').value = tx.amount;
      document.getElementById('tx-category').value = tx.category;
      document.getElementById('tx-date').value = tx.date;
      document.getElementById('tx-notes').value = tx.notes || '';
      document.getElementById('tx-recurring').checked = Boolean(tx.isRecurring);
      if (tx.type === 'expense') document.getElementById('tx-tier').value = tx.tier;
      this.openModal('transaction-modal');
    }

    handleSaveTransaction() {
      const isIncome = document.getElementById('type-income-btn')?.classList.contains('active');
      const type = isIncome ? 'income' : 'expense';
      const amount = parseFloat(document.getElementById('tx-amount')?.value);
      const category = document.getElementById('tx-category')?.value || 'Other Expense';
      const tier = isIncome ? 'income' : (document.getElementById('tx-tier')?.value || CATEGORY_TIERS[category] || 'wants');
      const date = document.getElementById('tx-date')?.value || todayStr();
      const notes = document.getElementById('tx-notes')?.value?.trim() || '';
      const isRecurring = Boolean(document.getElementById('tx-recurring')?.checked);

      if (!amount || isNaN(amount) || amount <= 0) {
        this.showToast('Please enter a valid amount', 'error');
        return;
      }

      const transaction = { type, amount, category, tier, date, notes, isRecurring };
      if (this.editingTransactionId) {
        this.store.updateTransaction(this.editingTransactionId, transaction);
        this.editingTransactionId = null;
        this.showToast('Transaction updated', 'success');
      } else {
        this.store.addTransaction(transaction);
        this.showToast(`${type === 'income' ? 'Income' : 'Expense'} recorded: ${this.store.getCurrency()}${amount}`, 'success');
      }
      this.closeAllModals();
      this.render();
    }

    handleQuickBarInput(text) {
      if (!text || !text.trim()) return;
      const trimmed = text.trim();
      const match = trimmed.match(/^([^\d]+)?\s*(\d+(?:\.\d{1,2})?)\s*([^\d]+)?$/i);

      let amount = 0;
      let label = '';

      if (match) {
        amount = parseFloat(match[2]);
        label = (match[1] || match[3] || 'Quick Entry').trim();
      } else {
        this.openTransactionModal();
        return;
      }

      if (!amount || amount <= 0) {
        this.showToast('Could not parse amount from input', 'error');
        return;
      }

      let category = 'Other Expense';
      let type = 'expense';
      const lower = label.toLowerCase();

      if (lower.includes('salary') || lower.includes('paycheck') || lower.includes('income')) {
        type = 'income';
        category = 'Salary';
      } else if (lower.includes('coffee') || lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('burger')) {
        category = 'Dining & Drinks';
      } else if (lower.includes('grocer') || lower.includes('market') || lower.includes('milk') || lower.includes('target')) {
        category = 'Groceries';
      } else if (lower.includes('rent') || lower.includes('mortgage')) {
        category = 'Housing';
      } else if (lower.includes('uber') || lower.includes('gas') || lower.includes('metro') || lower.includes('bus')) {
        category = 'Transportation';
      } else if (lower.includes('movie') || lower.includes('game') || lower.includes('ticket')) {
        category = 'Entertainment';
      }

      this.store.addTransaction({
        type,
        amount,
        category,
        tier: CATEGORY_TIERS[category] || 'wants',
        date: todayStr(),
        notes: label,
        isRecurring: false
      });

      this.render();
      this.showToast(`Logged "${label}" for ${this.store.getCurrency()}${amount}`, 'success');
    }

    handleSaveGoal() {
      const name = document.getElementById('goal-name')?.value?.trim();
      const targetAmount = parseFloat(document.getElementById('goal-target')?.value);
      const currentAmount = parseFloat(document.getElementById('goal-current-input')?.value) || 0;
      const targetDate = document.getElementById('goal-date')?.value || '';
      const icon = document.getElementById('goal-icon')?.value || '🎯';

      if (!name || isNaN(targetAmount) || targetAmount <= 0) {
        this.showToast('Please enter a valid goal name and target amount', 'error');
        return;
      }

      this.store.addGoal({
        name,
        targetAmount,
        currentAmount,
        targetDate,
        icon
      });

      this.closeAllModals();
      this.render();
      this.showToast(`Goal "${name}" created!`, 'success');
    }

    handleExportCSV() {
      const csvContent = this.store.exportCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `valence_finance_${todayStr()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToast('Transactions exported to CSV', 'info');
    }

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    }

    closeAllModals() {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
      toast.innerHTML = `<span>${icon}</span> <span>${esc(message)}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }, 2600);
    }

    renderCategoryFilter() {
      const select = document.getElementById('tx-category-filter');
      if (!select) return;
      const names = new Set([
        ...Object.keys(CATEGORY_TIERS),
        ...this.getCustomCategories().map(c => c.name),
        ...this.store.getTransactions().map(t => t.category).filter(Boolean)
      ]);
      select.innerHTML = '<option value="all">All Categories</option>' +
        Array.from(names).sort((a, b) => a.localeCompare(b))
          .map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
      if (!names.has(this.filterCategory)) this.filterCategory = 'all';
      select.value = this.filterCategory;
    }

    render() {
      const overview = this.analytics.computeOverview();
      this.renderCategoryFilter();

      document.querySelectorAll('.currency-symbol-display').forEach(el => {
        el.textContent = overview.currency;
      });

      this.renderOverview(overview);
      this.renderTransactionsTable();
      this.renderBudgetsAndGoalsView(overview);
      this.renderAdvisorView(overview);
    }

    renderOverview(overview) {
      const { currency, totalIncome, totalExpense, netSavings, savingsRate, needsPct, wantsPct, savingsPct, healthScore } = overview;

      const incEl = document.getElementById('metric-income');
      if (incEl) incEl.textContent = `${currency}${Math.round(totalIncome).toLocaleString()}`;

      const expEl = document.getElementById('metric-expense');
      if (expEl) expEl.textContent = `${currency}${Math.round(totalExpense).toLocaleString()}`;

      const netEl = document.getElementById('metric-net');
      const netDeltaEl = document.getElementById('metric-net-delta');
      if (netEl) netEl.textContent = `${currency}${Math.round(netSavings).toLocaleString()}`;
      if (netDeltaEl) {
        netDeltaEl.textContent = `${savingsRate.toFixed(1)}% savings rate`;
        netDeltaEl.className = `metric-delta ${netSavings >= 0 ? 'delta-positive' : 'delta-negative'}`;
      }

      const scoreValEl = document.getElementById('metric-health-score');
      const scoreBadgeEl = document.getElementById('metric-health-badge');
      if (scoreValEl) scoreValEl.textContent = healthScore.score;
      if (scoreBadgeEl) scoreBadgeEl.textContent = healthScore.status;

      // 50/30/20 Visual Bar Gauge
      const barNeeds = document.getElementById('gauge-needs-bar');
      const barWants = document.getElementById('gauge-wants-bar');
      const barSavings = document.getElementById('gauge-savings-bar');

      const totalGauge = Math.max(1, (overview.needsTotal + overview.wantsTotal + overview.savingsTotal));
      const gNeedsWidth = (overview.needsTotal / totalGauge) * 100;
      const gWantsWidth = (overview.wantsTotal / totalGauge) * 100;
      const gSavingsWidth = (overview.savingsTotal / totalGauge) * 100;

      if (barNeeds) barNeeds.style.width = `${gNeedsWidth}%`;
      if (barWants) barWants.style.width = `${gWantsWidth}%`;
      if (barSavings) barSavings.style.width = `${gSavingsWidth}%`;

      const setLegend = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setLegend('legend-needs-val', `${currency}${Math.round(overview.needsTotal).toLocaleString()}`);
      setLegend('legend-needs-pct', `${needsPct.toFixed(0)}% (Target ≤50%)`);

      setLegend('legend-wants-val', `${currency}${Math.round(overview.wantsTotal).toLocaleString()}`);
      setLegend('legend-wants-pct', `${wantsPct.toFixed(0)}% (Target ≤30%)`);

      setLegend('legend-savings-val', `${currency}${Math.round(overview.savingsTotal).toLocaleString()}`);
      setLegend('legend-savings-pct', `${savingsPct.toFixed(0)}% (Target ≥20%)`);

      // Charts
      this.charts.renderCashflowBars('cashflow-chart-container', overview);
      this.charts.renderCategoryDonut('donut-chart-container', overview);

      // Priority Tips (top 2)
      const tips = this.advisor.generateTips(overview);
      const tipsPreviewContainer = document.getElementById('overview-tips-container');
      if (tipsPreviewContainer) {
        if (tips.length === 0) {
          tipsPreviewContainer.innerHTML = `<div class="empty-state">No immediate alerts. Your finances are running optimally!</div>`;
        } else {
          tipsPreviewContainer.innerHTML = tips.slice(0, 2).map(tip => `
            <div class="tip-card ${tip.priority}">
              <div class="tip-badge-icon">${tip.icon}</div>
              <div class="tip-content">
                <div class="tip-header">
                  <span class="tip-title">${tip.title}</span>
                  <span class="tip-tag">${tip.category}</span>
                </div>
                <p class="tip-text">${tip.text}</p>
                ${tip.potentialMonthly ? `
                  <div class="tip-potential">
                    <span>💰 Potential Savings:</span>
                    <span>+${currency}${tip.potentialMonthly}/month</span>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('');
        }
      }
    }

    renderTransactionsTable() {
      const tableBody = document.getElementById('transactions-table-body');
      const countDisplay = document.getElementById('tx-count-display');
      if (!tableBody) return;

      let txs = [...this.store.getTransactions()].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const currency = this.store.getCurrency();

      if (this.filterType !== 'all') {
        txs = txs.filter(t => t.type === this.filterType);
      }

      if (this.filterCategory !== 'all') {
        txs = txs.filter(t => t.category === this.filterCategory);
      }

      if (this.searchTerm) {
        txs = txs.filter(t => 
          (t.notes && t.notes.toLowerCase().includes(this.searchTerm)) ||
          (t.category && t.category.toLowerCase().includes(this.searchTerm)) ||
          (String(t.amount ?? '').includes(this.searchTerm))
        );
      }

      if (countDisplay) {
        countDisplay.textContent = `${txs.length} record${txs.length === 1 ? '' : 's'}`;
      }

      if (txs.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div>No transactions found.</div>
                <button class="btn btn-secondary btn-sm" id="empty-add-btn" style="margin-top: 8px;">+ Add Transaction</button>
              </div>
            </td>
          </tr>
        `;
        document.getElementById('empty-add-btn')?.addEventListener('click', () => this.openTransactionModal());
        return;
      }

      tableBody.innerHTML = txs.map(t => {
        const isInc = t.type === 'income';
        const icon = CATEGORY_ICONS[t.category] || '📦';
        const tierBadge = isInc ? 'badge-income' : (t.tier === 'needs' ? 'badge-need' : t.tier === 'savings' ? 'badge-savings' : 'badge-want');
        const tierLabel = isInc ? 'Income' : (t.tier === 'needs' ? 'Need (50%)' : t.tier === 'savings' ? 'Savings (20%)' : 'Want (30%)');

        return `
          <tr>
            <td style="font-family: var(--font-mono); color: var(--text-tertiary); font-size: 0.8rem; white-space: nowrap;">
              ${esc(t.date) || '—'}
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 500;">
                <span>${icon}</span>
                <span>${esc(t.category)}</span>
                ${t.isRecurring ? '<span title="Recurring Monthly" style="font-size: 0.72rem; color: var(--accent-primary); opacity: 0.8;">🔄</span>' : ''}
              </div>
            </td>
            <td style="color: var(--text-secondary); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${esc(t.notes) || '—'}
            </td>
            <td>
              <span class="badge ${tierBadge}">${tierLabel}</span>
            </td>
            <td style="text-align: right;">
              <span class="${isInc ? 'amount-income' : 'amount-expense'}">
                ${isInc ? '+' : '-'}${currency}${parseFloat(t.amount).toFixed(2)}
              </span>
            </td>
            <td style="text-align: right; width: 60px;">
              <button class="action-btn-sm" data-edit-tx="${esc(t.id)}" title="Edit transaction" aria-label="Edit transaction">✎</button>
              <button class="action-btn-sm delete" data-delete-tx="${esc(t.id)}" title="Delete transaction">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      tableBody.querySelectorAll('[data-edit-tx]').forEach(btn => {
        btn.addEventListener('click', () => this.editTransaction(btn.getAttribute('data-edit-tx')));
      });

      tableBody.querySelectorAll('[data-delete-tx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-delete-tx');
          if (id) {
            this.store.deleteTransaction(id);
            this.render();
            this.showToast('Transaction removed', 'info');
          }
        });
      });
    }

    renderBudgetsAndGoalsView(overview) {
      const { currency, budgetAnalysis } = overview;

      // 1. Budget Bars
      const budgetListContainer = document.getElementById('budget-bars-list');
      if (budgetListContainer) {
        budgetListContainer.innerHTML = budgetAnalysis.map(b => {
          const pctClamped = Math.min(100, b.percentUsed);
          const statusClass = b.percentUsed > 100 ? 'danger' : b.percentUsed > 80 ? 'warning' : '';
          const icon = CATEGORY_ICONS[b.category] || '🏷️';

          return `
            <div class="budget-item">
              <div class="budget-item-header">
                <span class="budget-category">
                  <span>${icon}</span>
                  <span>${esc(b.category)}</span>
                </span>
                <span class="budget-numbers">
                  <strong>${currency}${Math.round(b.spent)}</strong> / ${currency}${Math.round(b.budget)}
                </span>
              </div>
              <div class="budget-bar-bg">
                <div class="budget-bar-fill ${statusClass}" style="width: ${pctClamped}%"></div>
              </div>
              <div class="budget-meta">
                <span>${b.percentUsed.toFixed(0)}% allocated</span>
                <span style="color: ${b.isOver ? 'var(--accent-rose)' : 'var(--text-tertiary)'}">
                  ${b.isOver ? `Over by ${currency}${Math.round(b.spent - b.budget)}` : `${currency}${Math.round(b.remaining)} left`}
                </span>
              </div>
            </div>
          `;
        }).join('');
      }

      // 2. Savings Goals
      const goalsGrid = document.getElementById('savings-goals-grid');
      const goals = this.store.getGoals();

      if (goalsGrid) {
        if (goals.length === 0) {
          goalsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-state-icon">🎯</div>
              <div>No savings goals defined yet. Set a goal like Emergency Fund or Vacation!</div>
            </div>
          `;
        } else {
          goalsGrid.innerHTML = goals.map(g => {
            const cur = Number(g.currentAmount) || 0;
            const tgt = Number(g.targetAmount) || 0;
            const pct = tgt > 0 ? Math.min(100, Math.round((cur / tgt) * 100)) : 0;
            const remaining = Math.max(0, tgt - cur);

            return `
              <div class="goal-card">
                <div class="goal-top">
                  <div class="goal-title-wrap">
                    <div class="goal-icon-box">${g.icon || '🎯'}</div>
                    <div>
                      <h4 class="goal-title">${esc(g.name)}</h4>
                      <span class="goal-target-date">Target: ${g.targetDate || 'No date set'}</span>
                    </div>
                  </div>
                  <button class="action-btn-sm delete" data-delete-goal="${esc(g.id)}" title="Remove Goal">✕</button>
                </div>

                <div class="goal-amount-row">
                  <span class="goal-current">${currency}${cur.toLocaleString()}</span>
                  <span class="goal-target">of ${currency}${tgt.toLocaleString()}</span>
                </div>

                <div class="goal-track">
                  <div class="goal-progress" style="width: ${pct}%"></div>
                </div>

                <div class="goal-footer">
                  <span>${pct}% achieved</span>
                  <span>${currency}${remaining.toLocaleString()} to go</span>
                </div>
              </div>
            `;
          }).join('');

          goalsGrid.querySelectorAll('[data-delete-goal]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = btn.getAttribute('data-delete-goal');
              if (id) {
                this.store.deleteGoal(id);
                this.render();
                this.showToast('Goal removed', 'info');
              }
            });
          });
        }
      }
    }

    renderAdvisorView(overview) {
      const { currency, healthScore } = overview;

      const healthAuditContainer = document.getElementById('health-audit-container');
      if (healthAuditContainer) {
        healthAuditContainer.innerHTML = `
          <div class="health-score-container" style="margin-bottom: 20px;">
            <div class="health-score-circle" id="health-score-circle-advisor" style="--score-pct: ${healthScore.score};">
              <span class="health-score-value">${healthScore.score}</span>
            </div>
            <div class="health-score-details">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="health-score-title">Health Grade: ${healthScore.grade} (${healthScore.status})</span>
              </div>
              <p class="health-score-desc">${healthScore.description}</p>
            </div>
          </div>

          <div class="grid-3col" style="margin-bottom: 24px;">
            <div class="card" style="padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Savings Rate</span>
              <span style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: ${overview.savingsRate >= 20 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}">
                ${overview.savingsRate.toFixed(1)}%
              </span>
              <span style="font-size: 0.72rem; color: var(--text-tertiary);">Benchmark: ≥ 20.0%</span>
            </div>
            <div class="card" style="padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Needs Proportion</span>
              <span style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: ${overview.needsPct <= 50 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}">
                ${overview.needsPct.toFixed(1)}%
              </span>
              <span style="font-size: 0.72rem; color: var(--text-tertiary);">Benchmark: ≤ 50.0%</span>
            </div>
            <div class="card" style="padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Wants Proportion</span>
              <span style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: ${overview.wantsPct <= 30 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}">
                ${overview.wantsPct.toFixed(1)}%
              </span>
              <span style="font-size: 0.72rem; color: var(--text-tertiary);">Benchmark: ≤ 30.0%</span>
            </div>
          </div>
        `;
      }

      const tipsListContainer = document.getElementById('advisor-tips-list');
      const tips = this.advisor.generateTips(overview);

      if (tipsListContainer) {
        tipsListContainer.innerHTML = tips.map(tip => `
          <div class="tip-card ${tip.priority}">
            <div class="tip-badge-icon">${tip.icon}</div>
            <div class="tip-content">
              <div class="tip-header">
                <span class="tip-title">${tip.title}</span>
                <span class="tip-tag">${tip.category}</span>
              </div>
              <p class="tip-text">${tip.text}</p>
              ${tip.potentialMonthly ? `
                <div class="tip-potential">
                  <span>💰 Monthly Impact:</span>
                  <span>+${currency}${tip.potentialMonthly}/mo (+${currency}${(tip.potentialMonthly * 12).toLocaleString()}/yr)</span>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('');
      }

      const currentSliderVal = parseInt(document.getElementById('whatif-slider')?.value || '20', 10);
      this.updateSimulator(currentSliderVal);
    }

    updateSimulator(percentReduction) {
      const sim = this.advisor.simulateScenario(percentReduction);
      const curr = sim.currency;

      const setVal = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setVal('slider-val-display', `${percentReduction}%`);
      setVal('sim-extra-monthly', `+${curr}${sim.monthlyExtra}`);
      setVal('sim-extra-annual', `+${curr}${sim.annualExtra.toLocaleString()}`);
      setVal('sim-new-rate', `${sim.newSavingsRate}% (+${sim.rateDiff}%)`);
      setVal('sim-ten-year', `${curr}${sim.futureTenYears.toLocaleString()}`);
    }
  }

  // --- Immediate & Resilient Startup ---
  const app = new App();
  window.valenceApp = app;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }

})();








