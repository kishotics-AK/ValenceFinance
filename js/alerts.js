/* ==========================================================================
   VALENCE FINANCE — Spending Limits & Email Alerts panel
   Talks to /api/alerts. Loads whenever the Budgets & Goals view is opened.
   ========================================================================== */
(function () {
  'use strict';

  const PERIODS = [
    { key: 'daily', label: 'Daily', hint: 'Resets every midnight', icon: '☀️' },
    { key: 'weekly', label: 'Weekly', hint: 'Resets every Monday', icon: '📅' },
    { key: 'monthly', label: 'Monthly', hint: 'Resets on the 1st', icon: '🗓️' }
  ];

  let settings = null;
  let loading = false;

  const $ = (id) => document.getElementById(id);

  function currency() {
    return window.valenceApp?.store?.getCurrency?.() || '$';
  }

  function money(value) {
    const n = Number(value) || 0;
    return currency() + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function toast(message, type) {
    if (window.valenceApp?.showToast) window.valenceApp.showToast(message, type);
  }

  function setStatus(text, tone) {
    const el = $('alerts-status');
    if (!el) return;
    el.textContent = text;
    el.dataset.tone = tone || '';
  }

  function formatSent(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function render() {
    const grid = $('alerts-grid');
    if (!grid || !settings) return;

    const enabled = settings.emailAlerts;
    $('alerts-enabled').checked = enabled;
    $('alerts-enabled-label').textContent = enabled ? 'Alerts on' : 'Alerts off';
    $('alerts-card').classList.toggle('alerts-disabled', !enabled);

    grid.innerHTML = PERIODS.map(({ key, label, hint, icon }) => {
      const limit = Number(settings.limits[key]) || 0;
      const spent = Number(settings.spending?.[key]) || 0;
      const pct = limit > 0 ? (spent / limit) * 100 : 0;
      const tone = limit === 0 ? 'off' : pct > 100 ? 'danger' : pct >= 80 ? 'warning' : 'ok';
      const sent = settings.lastAlert?.[key];

      let meta;
      if (limit === 0) meta = 'No limit set';
      else if (spent > limit) meta = `Over by ${money(spent - limit)}`;
      else meta = `${money(limit - spent)} left`;

      return `
        <div class="alert-tile" data-tone="${tone}">
          <div class="alert-tile-head">
            <span class="alert-tile-title"><span aria-hidden="true">${icon}</span> ${label}</span>
            <span class="alert-tile-badge">${limit === 0 ? 'Off' : Math.round(pct) + '%'}</span>
          </div>
          <label class="form-label" for="alerts-limit-${key}">${label} limit</label>
          <div class="input-with-symbol">
            <span class="input-symbol">${currency()}</span>
            <input type="number" class="form-input" id="alerts-limit-${key}" name="${key}"
              min="0" step="0.01" inputmode="decimal" value="${limit || ''}" placeholder="0 = off" />
          </div>
          <div class="budget-bar-bg alert-tile-bar">
            <div class="budget-bar-fill ${tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : ''}"
              style="width: ${Math.min(100, pct)}%"></div>
          </div>
          <div class="alert-tile-meta">
            <span>Spent <strong>${money(spent)}</strong></span>
            <span class="alert-tile-remaining">${meta}</span>
          </div>
          <div class="alert-tile-foot">
            <span>${hint}</span>
            ${sent ? `<span class="alert-tile-sent" title="Alert email sent this period">✉ ${formatSent(sent)}</span>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  async function load() {
    if (loading || !window.FinanceApi?.getAlerts || !$('alerts-grid')) return;
    loading = true;
    try {
      settings = await window.FinanceApi.getAlerts();
      render();
    } catch (error) {
      if (error.status === 401) {
        window.dispatchEvent(new Event('finance:session-expired'));
        return;
      }
      setStatus('Could not load your limits. Is the server running?', 'error');
    } finally {
      loading = false;
    }
  }

  function readLimits() {
    const limits = {};
    for (const { key, label } of PERIODS) {
      const raw = $(`alerts-limit-${key}`).value.trim();
      const value = raw === '' ? 0 : Number(raw);
      if (!Number.isFinite(value) || value < 0) {
        throw new Error(`${label} limit must be 0 or more.`);
      }
      limits[key] = value;
    }
    return limits;
  }

  async function save(event) {
    event.preventDefault();
    const button = $('alerts-save-btn');
    let limits;
    try {
      limits = readLimits();
    } catch (error) {
      setStatus(error.message, 'error');
      return;
    }

    button.disabled = true;
    try {
      settings = await window.FinanceApi.saveAlerts({ limits, emailAlerts: $('alerts-enabled').checked });
      render();
      setStatus('Limits saved.', 'success');
      toast('Spending limits saved', 'success');
    } catch (error) {
      setStatus(error.message.replace(/^API request failed \(\d+\):\s*/, ''), 'error');
    } finally {
      button.disabled = false;
    }
  }

  async function toggleAlerts(event) {
    const enabled = event.target.checked;
    try {
      settings = await window.FinanceApi.saveAlerts({ emailAlerts: enabled });
      render();
      toast(enabled ? 'Email alerts turned on' : 'Email alerts turned off', 'info');
    } catch (error) {
      event.target.checked = !enabled;
      setStatus('Could not update email alerts.', 'error');
    }
  }

  async function checkNow() {
    const button = $('alerts-check-btn');
    button.disabled = true;
    try {
      const result = await window.FinanceApi.checkAlerts();
      settings = result;
      render();
      if (!result.emailAlerts) {
        setStatus('Email alerts are off, so no email was sent.', '');
      } else if (result.sent.length) {
        setStatus(`Alert email sent for: ${result.sent.join(', ')}.`, 'warning');
        toast(`Limit exceeded — alert sent (${result.sent.join(', ')})`, 'error');
      } else {
        setStatus('Checked. No new alerts to send.', 'success');
      }
    } catch (error) {
      setStatus('Check failed. Please try again.', 'error');
    } finally {
      button.disabled = false;
    }
  }

  function init() {
    const form = $('alerts-form');
    const view = $('view-budgets');
    if (!form || !view) return;

    form.addEventListener('submit', save);
    $('alerts-enabled').addEventListener('change', toggleAlerts);
    $('alerts-check-btn').addEventListener('click', checkNow);

    // Refresh the numbers every time the Budgets & Goals view becomes visible.
    new MutationObserver(() => {
      if (view.classList.contains('active') && !$('finance-app').hidden) load();
    }).observe(view, { attributes: true, attributeFilter: ['class'] });

    window.FinanceAlerts = { refresh: load };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
