const sosService = require('../services/sos.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const dispatchSOS = asyncHandler(async (req, res) => {
  const result = await sosService.dispatchSOS({
    ...req.body,
    userId: req.user?._id,
  });
  // Return the same response shape the frontend expects
  res.status(200).json(result);
});

const getIncident = asyncHandler(async (req, res) => {
  const incident = await sosService.getIncident(req.params.incidentId);
  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }
  ApiResponse.success(res, incident);
});

module.exports = { dispatchSOS, getIncident };
