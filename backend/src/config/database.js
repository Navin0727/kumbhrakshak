const mongoose = require('mongoose');
const logger = require('./logger');
const { env } = require('./env');

/**
 * Connect to MongoDB with retry logic.
 */
async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      // Mongoose 8 uses the new driver defaults — no deprecated options needed
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    // Retry after 5 seconds
    logger.info('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDatabase, 5000);
  }
}

/**
 * Graceful disconnect.
 */
async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = { connectDatabase, disconnectDatabase };
