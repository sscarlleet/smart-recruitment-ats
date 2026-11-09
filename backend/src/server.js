require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const prisma = require('./config/prisma');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const profileRoutes = require('./routes/profile.routes');

const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Request logging
app.use(morgan('dev'));

// Parse JSON requests
app.use(express.json({ limit: '10kb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Recruitment ATS Backend is running!'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Database check
app.get('/api/db-check', async (req, res, next) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      message: 'Database connected successfully!',
      userCount
    });
  } catch (error) {
    next(error);
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ATS Backend running at http://localhost:${PORT}`);
});