const dataService = require('../services/data.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── Safety Metrics ──────────────────────────────────────────────
const getSafetyMetrics = asyncHandler(async (req, res) => {
  const metrics = await dataService.getSafetyMetrics();
  ApiResponse.success(res, metrics);
});

// ─── POIs ────────────────────────────────────────────────────────
const getPois = asyncHandler(async (req, res) => {
  const { category, area } = req.query;
  const pois = await dataService.getPois({ category, area });
  ApiResponse.success(res, pois);
});

const getPoiById = asyncHandler(async (req, res) => {
  const poi = await dataService.getPoiById(req.params.id);
  ApiResponse.success(res, poi);
});

// ─── Temples ─────────────────────────────────────────────────────
const getTemples = asyncHandler(async (req, res) => {
  const temples = await dataService.getTemples();
  ApiResponse.success(res, temples);
});

const getTempleById = asyncHandler(async (req, res) => {
  const temple = await dataService.getTempleById(req.params.id);
  ApiResponse.success(res, temple);
});

// ─── Alerts ──────────────────────────────────────────────────────
const getAlerts = asyncHandler(async (req, res) => {
  const { severity, category } = req.query;
  const alerts = await dataService.getAlerts({ severity, category });
  ApiResponse.success(res, alerts);
});

// ─── Cases ───────────────────────────────────────────────────────
const getCases = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const cases = await dataService.getCases({ status });
  ApiResponse.success(res, cases);
});

const getCaseById = asyncHandler(async (req, res) => {
  const c = await dataService.getCaseById(req.params.id);
  ApiResponse.success(res, c);
});

const reportCase = asyncHandler(async (req, res) => {
  const c = await dataService.reportCase(req.body, req.user?._id);
  ApiResponse.created(res, c, 'Case reported successfully');
});

const updateCase = asyncHandler(async (req, res) => {
  const c = await dataService.updateCase(req.params.id, req.body);
  ApiResponse.success(res, c, 'Case updated');
});

// ─── Services ────────────────────────────────────────────────────
const getWaterStations = asyncHandler(async (req, res) => {
  const { area } = req.query;
  const stations = await dataService.getWaterStations({ area });
  ApiResponse.success(res, stations);
});

const getDroneUnits = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const drones = await dataService.getDroneUnits({ status });
  ApiResponse.success(res, drones);
});

const getShuttleRoutes = asyncHandler(async (req, res) => {
  const { area } = req.query;
  const routes = await dataService.getShuttleRoutes({ area });
  ApiResponse.success(res, routes);
});

const getFoodServices = asyncHandler(async (req, res) => {
  const { area } = req.query;
  const services = await dataService.getFoodServices({ area });
  ApiResponse.success(res, services);
});

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
