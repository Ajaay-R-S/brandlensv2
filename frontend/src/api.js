const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const API_BASE = API_URL ? `${API_URL}/api` : '/api';

export async function fetchKB(category = null) {
  const url = category ? `${API_BASE}/kb?category=${category}` : `${API_BASE}/kb`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Knowledge Base');
  return res.json();
}

export async function createKBEntry(entry) {
  const res = await fetch(`${API_BASE}/kb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create KB entry');
  }
  return res.json();
}

export async function updateKBEntry(id, entry) {
  const res = await fetch(`${API_BASE}/kb/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to update KB entry');
  return res.json();
}

export async function deleteKBEntry(id) {
  const res = await fetch(`${API_BASE}/kb/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete KB entry');
  return res.json();
}

export async function resetKBToSeeds() {
  const res = await fetch(`${API_BASE}/kb/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset Knowledge Base');
  return res.json();
}

export async function fetchSubmissions() {
  const res = await fetch(`${API_BASE}/submissions`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}

export async function fetchSubmission(id) {
  const res = await fetch(`${API_BASE}/submissions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch submission details');
  return res.json();
}

export async function createSubmission(payload) {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create submission');
  }
  return res.json();
}

export async function deleteSubmission(id) {
  const res = await fetch(`${API_BASE}/submissions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete submission');
  return res.json();
}

export async function actOnFinding(submissionId, findingId, payload) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/findings/${findingId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to perform finding action');
  }
  return res.json();
}

export async function saveRevision(submissionId, payload) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/revise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to save revision');
  }
  return res.json();
}

export async function addComment(submissionId, payload) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function recordDecision(submissionId, payload) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to record decision');
  }
  return res.json();
}

export async function unlockSubmission(submissionId, managerName) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/unlock?manager_name=${encodeURIComponent(managerName)}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to unlock submission');
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/insights`);
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
}

export async function checkContrast(fg, bg, textSize = 'normal') {
  const res = await fetch(`${API_BASE}/accessibility/contrast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foreground: fg, background: bg, text_size: textSize }),
  });
  if (!res.ok) throw new Error('Failed to check contrast');
  return res.json();
}
