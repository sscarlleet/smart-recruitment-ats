const express = require('express');

const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth.middleware');

const {
  getMyProfile,
  updateMyProfile
} = require('../controllers/profile.controller');

const {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/education.controller');

const {
  uploadResume,
  downloadResume,
  deleteResume
} = require('../controllers/resume.controller');

const {
  handleResumeUpload
} = require('../middleware/resume.middleware');

const router = express.Router();

// Authentication and candidate-only access
router.use(authenticateToken);
router.use(authorizeRoles('CANDIDATE'));

// Candidate profile
router.get('/', getMyProfile);
router.put('/', updateMyProfile);

// Education
router.get('/education', getEducation);
router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Resume
router.post('/resume', handleResumeUpload, uploadResume);
router.get('/resume', downloadResume);
router.delete('/resume', deleteResume);

module.exports = router;