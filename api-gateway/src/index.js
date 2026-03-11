/**
 * NextGen Telco API Gateway
 * Central request router for all microservices
 * Routes frontend requests to appropriate backend services
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');
const requestValidator = require('./middleware/requestValidator');

// Import routes
const userRoutes = require('./routes/users');
const planRoutes = require('./routes/plans');
const deviceRoutes = require('./routes/devices');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

// ============ GLOBAL MIDDLEWARE ============
// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: { action: 'deny' }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:80'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
if (NODE_ENV !== 'test') {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
}
app.use(requestLogger);

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Rate limiting
app.use(rateLimiter);

// Request validation
app.use(requestValidator);

// ============ HEALTH CHECK ENDPOINTS ============
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

app.get('/ready', async (req, res) => {
  try {
    // Check service connectivity
    const services = {
      user: process.env.USER_SERVICE_URL || 'http://user-service:8080',
      plan: process.env.PLAN_SERVICE_URL || 'http://plan-service:8080',
      device: process.env.DEVICE_SERVICE_URL || 'http://device-service:8080',
      order: process.env.ORDER_SERVICE_URL || 'http://order-service:8080',
      payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8080'
    };

    res.status(200).json({
      ready: true,
      services: Object.keys(services),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error.message
    });
  }
});

// ============ API ROUTES ============
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// ============ ROOT ENDPOINT ============
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'NextGen Telco API Gateway',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      ready: '/ready',
      api: '/api/*'
    }
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.id
  });
});

// ============ ERROR HANDLING ============
app.use(errorHandler);

// ============ SERVER STARTUP ============
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  NextGen Telco API Gateway                 ║
║  Environment: ${NODE_ENV.padEnd(31)}║
║  Port: ${PORT.toString().padEnd(36)}║
║  Status: Running ✓                         ║
╚════════════════════════════════════════════╝
  `);
  console.log('Service URLs configured:');
  console.log(`  User Service:    ${process.env.USER_SERVICE_URL || 'http://user-service:8080'}`);
  console.log(`  Plan Service:    ${process.env.PLAN_SERVICE_URL || 'http://plan-service:8080'}`);
  console.log(`  Device Service:  ${process.env.DEVICE_SERVICE_URL || 'http://device-service:8080'}`);
  console.log(`  Order Service:   ${process.env.ORDER_SERVICE_URL || 'http://order-service:8080'}`);
  console.log(`  Payment Service: ${process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8080'}`);
  console.log('\nEndpoints:');
  console.log(`  Health Check:  http://localhost:${PORT}/health`);
  console.log(`  API Base:      http://localhost:${PORT}/api\n`);
});

// ============ GRACEFUL SHUTDOWN ============
process.on('SIGTERM', () => {
  console.log('SIGTERM received, gracefully shutting down...');
  server.close(() => {
    console.log('API Gateway server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, gracefully shutting down...');
  server.close(() => {
    console.log('API Gateway server closed');
    process.exit(0);
  });
});

module.exports = app;
