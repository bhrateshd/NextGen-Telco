/**
 * Request Logger Middleware
 * Logs incoming requests and response times
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'WARN' : 'INFO';
    
    console.log(`[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    return originalJson(data);
  };

  next();
};

module.exports = requestLogger;
