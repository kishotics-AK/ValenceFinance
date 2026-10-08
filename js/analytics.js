/* ==========================================================================
   VALENCE FINANCE — Analytics Engine
   50/30/20 Rule computation, Burn rate, Category metrics, Financial Health Score
   ========================================================================== */

import { CATEGORY_TIERS } from './store.js';

export class AnalyticsEngine {
  constructor(store) {
    this.store = store;
  }

  getCurrentMonthTransactions() {
    const txs = this.store.getTransactions();
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Default to current month, but if no transactions match current month, include all to keep analytics live
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
      const amt = Math.abs(t.amount);
      if (t.type === 'income') {
        totalIncome += amt;
        categoryIncome[t.category] = (categoryIncome[t.category] || 0) + amt;
      } else {
        totalExpense += amt;
        categorySpend[t.category] = (categorySpend[t.category] || 0) + amt;
        
        if (t.isRecurring) {
          recurringExpenseTotal += amt;
        }

        // 50/30/20 tier classification
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
    // Savings rate is based on income, or 0 if no income
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // 50/30/20 percentages relative to Income (or relative to total expense if income is 0)
    const baseForRatios = totalIncome > 0 ? totalIncome : totalExpense || 1;
    const needsPct = (needsTotal / baseForRatios) * 100;
    const wantsPct = (wantsTotal / baseForRatios) * 100;
    const savingsPct = (savingsTotal / baseForRatios) * 100;

    // Burn rate & Daily velocity
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dailyAverageSpend = dayOfMonth > 0 ? totalExpense / dayOfMonth : 0;
    const projectedMonthEndSpend = dailyAverageSpend * daysInMonth;

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

    // Financial Health Score (0-100)
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
      dailyAverageSpend,
      projectedMonthEndSpend,
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

    // 1. Savings Rate Component (Max 30 points)
    // 20%+ savings is ideal full points
    if (savingsRate >= 25) score += 30;
    else if (savingsRate >= 20) score += 26;
    else if (savingsRate >= 15) score += 20;
    else if (savingsRate >= 10) score += 14;
    else if (savingsRate > 0) score += 8;
    else score += 0;

    // 2. Needs Ratio Component (Max 25 points)
    // Ideal <= 50%
    if (needsPct <= 50) score += 25;
    else if (needsPct <= 60) score += 18;
    else if (needsPct <= 70) score += 10;
    else score += 4;

    // 3. Wants Ratio Component (Max 25 points)
    // Ideal <= 30%
    if (wantsPct <= 30) score += 25;
    else if (wantsPct <= 35) score += 20;
    else if (wantsPct <= 45) score += 12;
    else score += 4;

    // 4. Budget Discipline Component (Max 20 points)
    if (budgetAnalysis.length > 0) {
      const underBudgetCategories = budgetAnalysis.filter(b => !b.isOver).length;
      const budgetDisciplineRatio = underBudgetCategories / budgetAnalysis.length;
      score += Math.round(budgetDisciplineRatio * 20);
    } else {
      score += 15;
    }

    // Clamp score 0 - 100
    score = Math.min(100, Math.max(0, Math.round(score)));

    let status = 'Fair';
    let grade = 'B';
    let description = 'Moderate financial stability. Look into trimming discretionary wants to boost your safety buffer.';

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
