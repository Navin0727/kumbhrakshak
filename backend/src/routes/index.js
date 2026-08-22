const express = require('express');
const authRoutes = require('./auth.routes');
const dataRoutes = require('./data.routes');
const sosRoutes = require('./sos.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'KumbhRakshak',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/', dataRoutes);      // POIs, temples, alerts, cases, services, safety
router.use('/sos', sosRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
