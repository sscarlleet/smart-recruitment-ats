// jobService.js
// All API calls related to jobs go here.
// Currently returns sample data. Replace with real fetch() calls later.

import { SAMPLE_JOBS } from '../data/sampleData';

// Get all jobs from the backend
export async function getJobs() {
  // TODO: replace with → const res = await fetch('/api/jobs'); return res.json();
  return Promise.resolve(SAMPLE_JOBS);
}

// Get a single job by ID
export async function getJobById(id) {
  // TODO: replace with → const res = await fetch(`/api/jobs/${id}`); return res.json();
  const job = SAMPLE_JOBS.find((j) => j.id === id);
  return Promise.resolve(job || null);
}

// Create a new job
export async function createJob(jobData) {
  // TODO: replace with → const res = await fetch('/api/jobs', { method:'POST', body: JSON.stringify(jobData) });
  return Promise.resolve({ ...jobData, id: `J${Date.now()}` });
}

// Update an existing job
export async function updateJob(id, jobData) {
  // TODO: replace with → const res = await fetch(`/api/jobs/${id}`, { method:'PUT', body: JSON.stringify(jobData) });
  return Promise.resolve({ ...jobData, id });
}

// Delete a job
export async function deleteJob(id) {
  // TODO: replace with → await fetch(`/api/jobs/${id}`, { method:'DELETE' });
  return Promise.resolve({ success: true });
}

