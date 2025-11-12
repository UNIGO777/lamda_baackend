// Configuration constants for the Lambda-style server
module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Request configuration
  REQUEST_TIMEOUT: 15000,
  MAX_RETRIES: 3,
  
  // AI Models
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
  
  // User agents for rotation
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0'
  ],
  
  // Response messages
  MESSAGES: {
    SERVER_RUNNING: 'Enhanced Lambda-style server running on port',
    HEALTH_CHECK: 'Server is healthy and ready to handle requests',
    MISSING_URL: 'URL parameter is required',
    INVALID_METHOD: 'Invalid HTTP method',
    REQUEST_FAILED: 'Failed to fetch data after retries'
  }
};