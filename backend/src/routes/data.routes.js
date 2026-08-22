const express = require('express');
const dataController = require('../controllers/data.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const caseValidator = require('../validators/case.validator');

const router = express.Router();

// ─── Safety Metrics (public) ────────────────────────────────────
router.get('/safety/metrics', dataController.getSafetyMetrics);

// ─── POIs (public) ──────────────────────────────────────────────
router.get('/pois', dataController.getPois);
router.get('/pois/:id', dataController.getPoiById);

// ─── Temples (public) ───────────────────────────────────────────
router.get('/temples', dataController.getTemples);
router.get('/temples/:id', dataController.getTempleById);

// ─── Alerts (public) ────────────────────────────────────────────
router.get('/alerts', dataController.getAlerts);

// ─── Lost Person Cases ──────────────────────────────────────────
router.get('/cases', dataController.getCases);
router.get('/cases/:id', dataController.getCaseById);
router.post(
  '/cases',
  optionalAuth,
  validate(caseValidator.reportCase),
  dataController.reportCase
);
router.put(
  '/cases/:id',
  authenticate,
  validate(caseValidator.updateCase),
  dataController.updateCase
);

// ─── Pilgrim Services (public) ──────────────────────────────────
router.get('/services/water-stations', dataController.getWaterStations);
router.get('/services/drone-units', dataController.getDroneUnits);
router.get('/services/shuttle-routes', dataController.getShuttleRoutes);
router.get('/services/food', dataController.getFoodServices);

module.exports = router;
