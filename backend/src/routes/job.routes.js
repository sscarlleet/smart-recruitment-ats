
const express = require('express');
const router = express.Router();

const {
  createJob,
  getPublishedJobs,
  getPublishedJobById,
  getManageableJobs,
  updateJob,
  publishJob,
  closeJob,
  archiveJob
} = require('../controllers/job.controller');

const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth.middleware');

const hrAdminOnly = [
  authenticateToken,
  authorizeRoles('HR', 'ADMIN')
];

// Public routes
router.get('/', getPublishedJobs);

// HR/Admin routes — keep these before /:id
router.get('/manage/all', ...hrAdminOnly, getManageableJobs);
router.post('/', ...hrAdminOnly, createJob);
router.patch('/:id', ...hrAdminOnly, updateJob);
router.patch('/:id/publish', ...hrAdminOnly, publishJob);
router.patch('/:id/close', ...hrAdminOnly, closeJob);
router.patch('/:id/archive', ...hrAdminOnly, archiveJob);

// Public: only published job details
router.get('/:id', getPublishedJobById);

module.exports = router;
