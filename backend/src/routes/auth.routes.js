const express = require('express');

const {
  registerUser,
  loginUser
} = require('../controllers/auth.controller');

const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route: any logged-in user
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

// HR and Admin only
router.get(
  '/hr-check',
  authenticateToken,
  authorizeRoles('HR', 'ADMIN'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'HR/Admin access granted'
    });
  }
);

// Admin only
router.get(
  '/admin-check',
  authenticateToken,
  authorizeRoles('ADMIN'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Admin access granted'
    });
  }
);

module.exports = router;