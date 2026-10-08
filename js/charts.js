/* ==========================================================================
   VALENCE FINANCE — Minimalist SVG Charts Engine
   Responsive vector graphics: Donut Chart, Cashflow Bars, Category breakdown
   ========================================================================== */

const CHART_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1'  // indigo
];

export class ChartsEngine {
  constructor() {}

  // Render Cashflow Bar Chart (Income vs Expense vs Net)
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
          <div style="width: 100%; max-width: 48px; height: ${incomeHeight}%; background: linear-gradient(180deg, #10b981, rgba(16, 185, 129, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.4s ease;"></div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Income</span>
        </div>

        <!-- Expense Bar -->
        <div style="display: flex; flex-direction: column; align-items: center; width: 28%; height: 100%; justify-content: flex-end; gap: 8px;">
          <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--accent-rose);">${currency}${Math.round(totalExpense)}</span>
          <div style="width: 100%; max-width: 48px; height: ${expenseHeight}%; background: linear-gradient(180deg, #f43f5e, rgba(244, 63, 94, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.4s ease;"></div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Expenses</span>
        </div>

        <!-- Net Savings Bar -->
        <div style="display: flex; flex-direction: column; align-items: center; width: 28%; height: 100%; justify-content: flex-end; gap: 8px;">
          <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: ${netSavings >= 0 ? 'var(--accent-primary)' : 'var(--accent-rose)'};">
            ${currency}${Math.round(netSavings)}
          </span>
          <div style="width: 100%; max-width: 48px; height: ${netHeight}%; background: linear-gradient(180deg, #3b82f6, rgba(59, 130, 246, 0.4)); border-radius: 6px 6px 0 0; transition: height 0.4s ease;"></div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Net Flow</span>
        </div>
      </div>
    `;
  }

  // Render SVG Donut for Category Spending
  renderCategoryDonut(containerId, overview) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { categorySpend, totalExpense, currency } = overview;
    const entries = Object.entries(categorySpend)
      .filter(([_, val]) => val > 0)
      .sort((a, b) => b[1] - a[1]);

    if (entries.length === 0 || totalExpense === 0) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: var(--text-tertiary); font-size: 0.85rem;">
          No expense data to visualize
        </div>
      `;
      return;
    }

    // Top categories + 'Other'
    const topEntries = entries.slice(0, 5);
    const otherTotal = entries.slice(5).reduce((acc, curr) => acc + curr[1], 0);
    if (otherTotal > 0) {
      topEntries.push(['Other', otherTotal]);
    }

    // SVG Donut calculation
    const radius = 64;
    const strokeWidth = 22;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    const segments = topEntries.map(([cat, val], idx) => {
      const pct = val / totalExpense;
      const strokeDash = pct * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeDash;
      const color = CHART_PALETTE[idx % CHART_PALETTE.length];

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
        style="transition: stroke-width 0.2s ease, opacity 0.2s ease; cursor: pointer;"
        class="donut-segment"
        data-cat="${seg.category}"
        data-val="${currency}${Math.round(seg.value)}"
        data-pct="${seg.percentage}%"
      />
    `).join('');

    const legendHtml = segments.map(seg => `
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; padding: 2px 0;">
        <span style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${seg.color}; flex-shrink: 0;"></span>
          ${seg.category}
        </span>
        <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-primary);">${seg.percentage}%</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 8px 0;">
        <div style="position: relative; width: 180px; height: 180px; flex-shrink: 0;">
          <svg viewBox="0 0 180 180" style="width: 100%; height: 100%; transform: rotate(-90deg);">
            <circle cx="90" cy="90" r="${radius}" fill="transparent" stroke="var(--bg-tertiary)" stroke-width="${strokeWidth}" />
            ${svgPaths}
          </svg>
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
            <span style="font-size: 0.68rem; color: var(--text-tertiary); text-transform: uppercase;">Total Spent</span>
            <span style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${currency}${Math.round(totalExpense)}</span>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
          ${legendHtml}
        </div>
      </div>
    `;
  }
}

export const charts = new ChartsEngine();
