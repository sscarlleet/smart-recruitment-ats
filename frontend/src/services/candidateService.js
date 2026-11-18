import { apiRequest } from './api';

export async function getCandidates() {
  const data = await apiRequest('/applications/manage/all');
  return data.applications || [];
}

export async function updateCandidateStage(id, status) {
  const data = await apiRequest(`/applications/manage/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
  return data.application;
}

export async function submitApplication(jobId, formData = {}) {
  const data = await apiRequest(`/applications/apply/${jobId}`, {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  return data.application;
}

export async function getMyApplications() {
  const data = await apiRequest('/applications/my');
  return data.applications || [];
}