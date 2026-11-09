
const express = require('express');
const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  downloadApplicationResume,
  updateApplicationStatus
} = require('../controllers/application.controller');

const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth.middleware');

const candidateOnly = [
  authenticateToken,
  authorizeRoles('CANDIDATE')
];

const hrAdminOnly = [
  authenticateToken,
  authorizeRoles('HR', 'ADMIN')
];

// Candidate routes
router.post('/apply/:jobId', ...candidateOnly, applyForJob);
router.get('/my', ...candidateOnly, getMyApplications);

// HR/Admin routes
router.get('/manage/all', ...hrAdminOnly, getAllApplications);

// Candidate profile and resume belonging to an application
router.get(
  '/manage/:id/resume',
  ...hrAdminOnly,
  downloadApplicationResume
);

// Application details include candidate profile and education
router.get('/manage/:id', ...hrAdminOnly, getApplicationById);

// Update application status
router.patch(
  '/manage/:id/status',
  ...hrAdminOnly,
  updateApplicationStatus
);

module.exports = router;
