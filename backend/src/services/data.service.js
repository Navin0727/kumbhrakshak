const SafetyPoi = require('../models/SafetyPoi');
const Temple = require('../models/Temple');
const SafetyAlert = require('../models/SafetyAlert');
const LostPersonCase = require('../models/LostPersonCase');
const WaterStation = require('../models/WaterStation');
const DroneUnit = require('../models/DroneUnit');
const ShuttleRoute = require('../models/ShuttleRoute');
const FoodService = require('../models/FoodService');
const ApiError = require('../utils/ApiError');

// ─── Safety Metrics ─────────────────────────────────────────────
async function getSafetyMetrics() {
  // In production, this would aggregate real-time sensor/IoT data
  return {
    crowdStatus: 'Normal',
    crowdColor: '#46DFA6',
    trafficStatus: 'Moderate',
    trafficColor: '#FFD700',
    activeEmergencies: 0,
    currentSector: 'Nashik Sector 4 (Panchavati - Ramkund)',
    totalPilgrimsEstimated: '1.4M',
    waterQualityIndex: 'Safe (BOD < 3 mg/L)',
    weather: {
      temp: '31°C',
      condition: 'Clear Sky',
      humidity: '42%',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// ─── POIs ────────────────────────────────────────────────────────
async function getPois({ category, area } = {}) {
  const query = {};
  if (category) query.category = category;
  if (area) query.area = area.toUpperCase();
  return SafetyPoi.find(query).sort({ distanceKm: 1 });
}

async function getPoiById(id) {
  const poi = await SafetyPoi.findById(id);
  if (!poi) throw ApiError.notFound('POI not found');
  return poi;
}

// ─── Temples ─────────────────────────────────────────────────────
async function getTemples() {
  return Temple.find().sort({ distanceKm: 1 });
}

async function getTempleById(id) {
  const temple = await Temple.findById(id);
  if (!temple) throw ApiError.notFound('Temple not found');
  return temple;
}

// ─── Alerts ──────────────────────────────────────────────────────
async function getAlerts({ severity, category, active = true } = {}) {
  const query = {};
  if (severity) query.severity = severity;
  if (category) query.category = category;
  if (active !== undefined) query.isActive = active;
  return SafetyAlert.find(query).sort({ createdAt: -1 });
}

// ─── Lost Person Cases ──────────────────────────────────────────
async function getCases({ status } = {}) {
  const query = {};
  if (status) query.status = status;
  return LostPersonCase.find(query).sort({ createdAt: -1 });
}

async function getCaseById(id) {
  const c = await LostPersonCase.findById(id);
  if (!c) throw ApiError.notFound('Case not found');
  return c;
}

async function reportCase(data, userId) {
  const caseDoc = new LostPersonCase({
    ...data,
    reportedBy: userId,
  });
  await caseDoc.save();
  return caseDoc;
}

async function updateCase(id, updates) {
  const c = await LostPersonCase.findById(id);
  if (!c) throw ApiError.notFound('Case not found');
  if (updates.status) c.status = updates.status;
  if (updates.notes) c.notes = updates.notes;
  await c.save();
  return c;
}

// ─── Water Stations ─────────────────────────────────────────────
async function getWaterStations({ area } = {}) {
  const query = {};
  if (area) query.area = area.toUpperCase();
  return WaterStation.find(query).sort({ distanceKm: 1 });
}

// ─── Drone Units ────────────────────────────────────────────────
async function getDroneUnits({ status } = {}) {
  const query = {};
  if (status) query.status = status;
  return DroneUnit.find(query).sort({ distanceKm: 1 });
}

// ─── Shuttle Routes ─────────────────────────────────────────────
async function getShuttleRoutes({ area } = {}) {
  const query = {};
  if (area) query.area = area.toUpperCase();
  return ShuttleRoute.find(query);
}

// ─── Food Services ──────────────────────────────────────────────
async function getFoodServices({ area } = {}) {
  const query = {};
  if (area) query.area = area.toUpperCase();
  return FoodService.find(query).sort({ distanceKm: 1 });
}

module.exports = {
  getSafetyMetrics,
  getPois,
  getPoiById,
  getTemples,
  getTempleById,
  getAlerts,
  getCases,
  getCaseById,
  reportCase,
  updateCase,
  getWaterStations,
  getDroneUnits,
  getShuttleRoutes,
  getFoodServices,
};
