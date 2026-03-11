/**
 * Auth Service - JWT Token Management
 * Handles authentication, token generation, and verification
 */

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');

// Health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({
    ready: true,
    service: 'auth-service'
  });
});

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_ERROR',
    message: err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Auth Service terminated');
    process.exit(0);
  });
});

module.exports = app;
