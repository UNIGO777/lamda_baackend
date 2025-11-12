/**
 * CORS middleware for handling cross-origin requests
 */
const corsMiddleware = (req, res, next) => {
  // Set CORS headers - allow specific origin for credentials
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    // Allow all private IP ranges
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/127\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    // Allow all URLs
    /.*/
  ].filter(Boolean);

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some((o) => {
    if (!origin) return false;
    if (typeof o === 'string') return o === origin;
    if (o instanceof RegExp) return o.test(origin);
    return false;
  });

  // Vary by Origin to avoid caching issues
  res.header('Vary', 'Origin');
  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

module.exports = corsMiddleware;