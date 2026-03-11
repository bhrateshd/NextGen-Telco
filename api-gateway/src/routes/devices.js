/**
 * Device Service Routes
 * Routes for device inventory and catalog management
 */

const express = require('express');
const { proxyRequest } = require('../utils/serviceProxy');

const router = express.Router();

/**
 * GET /api/devices
 * Get all devices with optional filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await proxyRequest(req, 'device', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/devices/search
 * Search devices by query parameters
 */
router.get('/search', async (req, res, next) => {
  try {
    const result = await proxyRequest(req, 'device', '/search');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/devices/:deviceId
 * Get specific device details
 */
router.get('/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      const err = new Error('Device ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'device', `/${deviceId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/devices
 * Create new device (admin only)
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, brand, model, price, specs } = req.body;

    if (!name || !brand || !model || !price) {
      const err = new Error('Missing required fields: name, brand, model, price');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'device', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/devices/:deviceId
 * Update device details
 */
router.put('/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      const err = new Error('Device ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'device', `/${deviceId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
