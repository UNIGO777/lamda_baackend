/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log incoming request
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  
  // Log request body for POST requests (excluding sensitive data)
  if (req.method === 'POST' && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive fields if any
    delete logBody.password;
    delete logBody.token;
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody, null, 2));
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    const responseTimestamp = new Date().toISOString();
    
    console.log(`[${responseTimestamp}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    // Log response body for development (truncated for large responses)
    if (process.env.NODE_ENV === 'development') {
      const responseStr = JSON.stringify(body);
      const truncatedResponse = responseStr.length > 500 
        ? responseStr.substring(0, 500) + '...[truncated]'
        : responseStr;
      console.log(`[${responseTimestamp}] Response:`, truncatedResponse);
    }
    
    return originalJson.call(this, body);
  };

  next();
};

module.exports = requestLogger;