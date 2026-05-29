const BASE = '/api';

export async function callStep(stepName, payload) {
  const res = await fetch(`${BASE}/step/${stepName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || `Step ${stepName} failed`);
  return data.data;
}
