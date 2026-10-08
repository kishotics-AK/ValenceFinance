(function () {
  const base = '/api/transactions';

  async function request(url, options = {}) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });

    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.json();
        detail = body.error || body.message || '';
      } catch { /* non-JSON error body */ }
      const error = new Error(`API request failed (${response.status})${detail ? ': ' + detail : ''}`);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  window.FinanceApi = {
    list: () => request(base),
    getProfile: () => request('/api/profile'),
    saveProfile: (profile) => request('/api/profile', { method: 'PUT', body: JSON.stringify(profile) }),
    create: (transaction) => request(base, { method: 'POST', body: JSON.stringify(transaction) }),
    update: (id, transaction) => request(`${base}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(transaction) }),
    remove: (id) => request(`${base}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    replace: (transactions) => request(`${base}/replace`, { method: 'PUT', body: JSON.stringify(transactions) }),
    getAlerts: () => request('/api/alerts'),
    saveAlerts: (settings) => request('/api/alerts', { method: 'PUT', body: JSON.stringify(settings) }),
    checkAlerts: () => request('/api/alerts/check', { method: 'POST' })
  };
})();
