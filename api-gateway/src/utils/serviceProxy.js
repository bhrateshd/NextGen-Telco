/**
 * Service Proxy Utility
 * Handles request proxying to microservices
 */

const axios = require('axios');

const SERVICE_URLS = {
  user: process.env.USER_SERVICE_URL || 'http://user-service:8080',
  plan: process.env.PLAN_SERVICE_URL || 'http://plan-service:8080',
  device: process.env.DEVICE_SERVICE_URL || 'http://device-service:8080',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:8080',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8080'
};

/**
 * Proxy request to microservice
 */
async function proxyRequest(req, service, path) {
  const url = `${SERVICE_URLS[service]}${path || req.path.replace(`/api/${service}`, '')}`;
  
  const config = {
    method: req.method,
    url: url,
    headers: {
      ...req.headers,
      'X-Forwarded-For': req.ip,
      'X-Request-ID': req.id,
      'X-Gateway-Host': req.hostname
    },
    validateStatus: () => true, // Don't throw on any status code
    timeout: 30000 // 30 second timeout
  };

  // Add data for non-GET requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    config.data = req.body;
  }

  // Add query parameters
  if (Object.keys(req.query).length > 0) {
    config.params = req.query;
  }

  try {
    const response = await axios(config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers
    };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        status: 503,
        data: {
          status: 'error',
          code: 'SERVICE_UNAVAILABLE',
          message: `${service} service is unavailable`,
          requestId: req.id
        }
      };
    }

    if (error.code === 'ENOTFOUND') {
      return {
        status: 503,
        data: {
          status: 'error',
          code: 'SERVICE_NOT_FOUND',
          message: `Cannot resolve ${service} service hostname`,
          requestId: req.id
        }
      };
    }

    return {
      status: 504,
      data: {
        status: 'error',
        code: 'GATEWAY_TIMEOUT',
        message: 'Request to microservice timed out',
        requestId: req.id
      }
    };
  }
}

module.exports = {
  proxyRequest,
  SERVICE_URLS
};
