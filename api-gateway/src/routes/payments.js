/**
 * Payment Service Routes
 * Routes for payment processing and transactions
 */

const express = require('express');
const { proxyRequest } = require('../utils/serviceProxy');

const router = express.Router();

/**
 * POST /api/payments
 * Create payment intent
 */
router.post('/', async (req, res, next) => {
  try {
    const { orderId, amount, currency, paymentMethod } = req.body;

    if (!orderId || !amount || !currency) {
      const err = new Error('Missing required fields: orderId, amount, currency');
      err.statusCode = 400;
      return next(err);
    }

    if (amount <= 0) {
      const err = new Error('Amount must be greater than 0');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'payment', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/payments/process
 * Process payment
 */
router.post('/process', async (req, res, next) => {
  try {
    const { paymentIntentId, cardToken } = req.body;

    if (!paymentIntentId || !cardToken) {
      const err = new Error('Missing required fields: paymentIntentId, cardToken');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'payment', '/process');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/payments/:paymentId
 * Get payment details
 */
router.get('/:paymentId', async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      const err = new Error('Payment ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'payment', `/${paymentId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/payments/:paymentId/refund
 * Refund payment
 */
router.post('/:paymentId/refund', async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      const err = new Error('Payment ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'payment', `/${paymentId}/refund`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
