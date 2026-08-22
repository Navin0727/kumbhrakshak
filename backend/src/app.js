const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./config/logger');

/**
 * Create and configure the Express application.
 * Exported separately from server so it can be mounted in the existing server.ts.
 */
function createApp() {
  const app = express();

  // ─── Security ──────────────────────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: false, // Let frontend handle CSP
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: process.env.APP_URL || '*',
    credentials: true,
  }));

  // ─── Parsing ───────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── Rate Limiting ────────────────────────────────────────────
  app.use('/api/', generalLimiter);

  // ─── Request Logging ──────────────────────────────────────────
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')?.substring(0, 80),
      });
    }
    next();
  });

  // ─── API Routes ───────────────────────────────────────────────
  app.use('/api/v1', routes);

  // ─── Legacy route compatibility (frontend uses /api/ without v1) ─
  // Mount the same routes on /api/ for backward compatibility with
  // existing frontend calls to /api/sos/dispatch and /api/ai/safety-assistant
  app.use('/api', routes);

  // ─── 404 for unmatched API routes ─────────────────────────────
  app.use('/api/*', notFoundHandler);

  // ─── Centralized Error Handler ────────────────────────────────
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
