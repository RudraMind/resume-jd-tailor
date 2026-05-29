const BASE = '/api';

export async function callStep(stepName, payload) {
  const res = await fetch(`${BASE}/step/${stepName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try { const d = await res.json(); if (d.error) errMsg = d.error; } catch {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.error || `Step ${stepName} failed`);
  return data.data;
}
