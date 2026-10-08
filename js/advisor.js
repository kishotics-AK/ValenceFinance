/* ==========================================================================
   VALENCE FINANCE — Financial Advisory & Tips Engine
   Intelligent, rule-based recommendations tailored to real user spending patterns
   ========================================================================== */

export class AdvisorEngine {
  constructor(store, analytics) {
    this.store = store;
    this.analytics = analytics;
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
          type: 'danger',
          category: '50/30/20 Rule',
          title: `Discretionary 'Wants' Exceed 30% Benchmark`,
          icon: '⚠️',
          text: `Your Wants are currently ${overview.wantsPct.toFixed(1)}% of income (${curr}${Math.round(overview.wantsTotal)}). Reducing non-essential purchases by ${curr}${excessAmt}/mo brings you into optimal 50/30/20 balance.`,
          potentialMonthly: excessAmt,
          actionText: 'Review Wants'
        });
      } else if (overview.wantsPct <= 30 && overview.savingsRate >= 20) {
        tips.push({
          id: 'tip-rule-balanced',
          priority: 'positive',
          type: 'positive',
          category: '50/30/20 Rule',
          title: `Excellent 50/30/20 Allocation`,
          icon: '✅',
          text: `Your budget adheres smoothly to financial health standards. Needs: ${overview.needsPct.toFixed(0)}%, Wants: ${overview.wantsPct.toFixed(0)}%, Savings: ${overview.savingsPct.toFixed(0)}%.`,
          potentialMonthly: null,
          actionText: null
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

    if (topDiscretionary && maxDiscSpend > 100) {
      const trim25 = Math.round(maxDiscSpend * 0.25);
      const annualTrim = trim25 * 12;
      tips.push({
        id: 'tip-top-discretionary',
        priority: 'medium',
        type: 'warning',
        category: 'Spending Optimization',
        title: `Trim High Spend in ${topDiscretionary}`,
        icon: '💡',
        text: `You spent ${curr}${Math.round(maxDiscSpend)} on ${topDiscretionary} this period. Trimming just 25% of this category frees up ${curr}${trim25}/month (${curr}${annualTrim.toLocaleString()}/year) for debt reduction or investing.`,
        potentialMonthly: trim25,
        actionText: 'Simulate Trim'
      });
    }

    // Tip 3: Recurring Subscriptions Audit
    const recurringTxs = this.store.getTransactions().filter(t => t.type === 'expense' && (t.isRecurring || t.category === 'Subscriptions'));
    const subscriptionTotal = recurringTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (recurringTxs.length >= 2 && subscriptionTotal > 30) {
      const annualSub = Math.round(subscriptionTotal * 12);
      tips.push({
        id: 'tip-subscriptions-audit',
        priority: 'medium',
        type: 'warning',
        category: 'Recurring Costs',
        title: `Subscription & Recurring Leak Check`,
        icon: '🔄',
        text: `You have ${recurringTxs.length} recurring expenses totaling ${curr}${Math.round(subscriptionTotal)}/mo (${curr}${annualSub.toLocaleString()}/yr). Auditing and canceling 1–2 unused streaming or software tools immediately saves recurring cash.`,
        potentialMonthly: Math.round(subscriptionTotal * 0.3),
        actionText: 'Audit Subscriptions'
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
        type: 'danger',
        category: 'Budget Alert',
        title: `${topOver.category} is Over Budget by ${curr}${overrun}`,
        icon: '🚨',
        text: `Spent ${curr}${Math.round(topOver.spent)} against a ${curr}${topOver.budget} limit (${topOver.percentUsed.toFixed(0)}%). Freeze non-critical spending in this category until the next billing cycle.`,
        potentialMonthly: overrun,
        actionText: 'View Budgets'
      });
    }

    // Tip 5: Micro-Savings & Compound Interest Wealth Power ($5/day)
    tips.push({
      id: 'tip-micro-savings',
      priority: 'info',
      type: 'info',
      category: 'Compound Wealth',
      title: 'The "$5/Day Rule" Wealth Multiplier',
      icon: '📈',
      text: `Eliminating just $5/day in casual spending generates ${curr}150/month. If invested at an 8% historical index return, it grows to ${curr}27,440 in 10 years and ${curr}88,350 in 20 years.`,
      potentialMonthly: 150,
      actionText: null
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
            type: 'positive',
            category: 'Goal Acceleration',
            title: `Accelerate "${primaryGoal.name}" by ${savedMonths} Month${savedMonths > 1 ? 's' : ''}`,
            icon: '🚀',
            text: `Allocating an additional ${curr}100/mo to your "${primaryGoal.name}" would allow you to hit your ${curr}${primaryGoal.targetAmount.toLocaleString()} target in ${acceleratedMonths} months instead of ${currentMonths}.`,
            potentialMonthly: 100,
            actionText: 'Fund Goal'
          });
        }
      }
    }

    return tips;
  }

  // Interactive What-If Simulation
  simulateScenario(percentWantsReduction = 20) {
    const overview = this.analytics.computeOverview();
    const curr = overview.currency;
    const wantsTrimAmount = (overview.wantsTotal * (percentWantsReduction / 100));
    const newMonthlySavings = overview.netSavings + wantsTrimAmount;
    const newSavingsRate = overview.totalIncome > 0 ? (newMonthlySavings / overview.totalIncome) * 100 : 0;
    const annualSavingsIncrease = wantsTrimAmount * 12;

    // Calculate 10-year compound interest on trimmed amount at 7%
    const monthlyRate = 0.07 / 12;
    const totalMonths = 120;
    const futureTenYears = wantsTrimAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

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
