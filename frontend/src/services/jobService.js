import { apiRequest } from './api';

export async function getJobs(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const data = await apiRequest(`/jobs${query}`);
  return data.jobs || [];
}

export async function getManageableJobs() {
  const data = await apiRequest('/jobs/manage/all');
  return data.jobs || [];
}

export async function getJobById(id) {
  const data = await apiRequest(`/jobs/${id}`);
  return data.job || null;
}

export async function createJob(jobData) {
  const data = await apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
  return data.job;
}

export async function updateJob(id, jobData) {
  const data = await apiRequest(`/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(jobData)
  });
  return data.job;
}

export async function publishJob(id) {
  const data = await apiRequest(`/jobs/${id}/publish`, {
    method: 'PATCH'
  });
  return data.job;
}

export async function closeJob(id) {
  const data = await apiRequest(`/jobs/${id}/close`, {
    method: 'PATCH'
  });
  return data.job;
}

export async function archiveJob(id) {
  const data = await apiRequest(`/jobs/${id}/archive`, {
    method: 'PATCH'
  });
  return data.job;
}
