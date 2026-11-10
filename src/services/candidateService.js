// candidateService.js
// All API calls related to candidates go here.

import { SAMPLE_CANDIDATES } from '../data/sampleData';

// Get all candidates
export async function getCandidates() {
  // TODO: const res = await fetch('/api/candidates'); return res.json();
  return Promise.resolve(SAMPLE_CANDIDATES);
}

// Update a candidate's pipeline stage
export async function updateCandidateStage(id, stage) {
  // TODO: const res = await fetch(`/api/candidates/${id}/stage`, { method:'PUT', body: JSON.stringify({ stage }) });
  return Promise.resolve({ id, stage });
}

// Submit a new application (called from BrowseJobs)
export async function submitApplication(formData) {
  // TODO: const res = await fetch('/api/applications', { method:'POST', body: formData });
  return Promise.resolve({ success: true });
}

