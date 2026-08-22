const { createApp } = require('./app');
const { connectDatabase } = require('./config/database');
const { env, validateEnv } = require('./config/env');
const logger = require('./config/logger');

async function startBackendServer() {
  try {
    // Validate environment variables
    const warnings = validateEnv();
    warnings.forEach((warning) => logger.warn(warning));

    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    const PORT = process.env.BACKEND_PORT || env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 KumbhRakshak Standalone Backend API running on http://localhost:${PORT}`);
      logger.info(`   - API Base: http://localhost:${PORT}/api/v1`);
      logger.info(`   - Health Check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

startBackendServer();
