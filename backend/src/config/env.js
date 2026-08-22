const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root (parent of backend/)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3001,
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kumbhrakshak',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'kumbhrakshak-dev-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // OTP
  OTP_DEMO_MODE: process.env.OTP_DEMO_MODE !== 'false', // default true
  OTP_DEMO_CODE: process.env.OTP_DEMO_CODE || '2027',
  
  // App
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
};

/**
 * Validate required environment variables for production.
 */
function validateEnv() {
  const warnings = [];
  
  if (env.NODE_ENV === 'production') {
    if (env.JWT_SECRET === 'kumbhrakshak-dev-secret-change-in-production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    if (!env.GEMINI_API_KEY) {
      warnings.push('GEMINI_API_KEY not set — AI assistant will use fallback responses');
    }
    if (env.OTP_DEMO_MODE) {
      warnings.push('OTP_DEMO_MODE is enabled in production — disable for real SMS');
    }
  }
  
  return warnings;
}

module.exports = { env, validateEnv };
