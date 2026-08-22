const SOSIncident = require('../models/SOSIncident');
const { RESPONDER_SECTORS, ETA_RANGES } = require('../constants');
const logger = require('../config/logger');

/**
 * Create a new SOS incident.
 */
async function dispatchSOS({ pilgrimName, location, emergencyType, medicalDetails, contactPhone, userId }) {
  const incidentId = 'SOS-' + Math.floor(100000 + Math.random() * 900000);
  const responderSector = RESPONDER_SECTORS[Math.floor(Math.random() * RESPONDER_SECTORS.length)];
  const estimatedEta = ETA_RANGES[Math.floor(Math.random() * ETA_RANGES.length)];

  const incident = new SOSIncident({
    incidentId,
    pilgrimName,
    location,
    emergencyType: emergencyType || 'General Emergency SOS',
    medicalDetails: medicalDetails || {},
    contactPhone: contactPhone || '',
    status: 'DISPATCHED',
    responderSector,
    estimatedEta,
    controlRoomNotified: true,
    reportedBy: userId || undefined,
  });

  await incident.save();

  logger.warn('SOS DISPATCHED', {
    incidentId,
    pilgrimName,
    location,
    emergencyType,
    responderSector,
  });

  return {
    success: true,
    incidentId,
    status: 'DISPATCHED',
    responderSector,
    estimatedEta,
    helpline: '112 / 108',
    controlRoomNotified: true,
    timestamp: incident.createdAt.toISOString(),
    details: {
      pilgrimName,
      location,
      emergencyType: emergencyType || 'General Emergency SOS',
      contactPhone: contactPhone || '+91 XXXXXXXXXX',
    },
  };
}

/**
 * Get SOS incident by incidentId.
 */
async function getIncident(incidentId) {
  const incident = await SOSIncident.findOne({ incidentId });
  return incident;
}

/**
 * Get all SOS incidents (admin/official use).
 */
async function getIncidents({ status, page = 1, limit = 20 }) {
  const query = {};
  if (status) query.status = status;

  const total = await SOSIncident.countDocuments(query);
  const incidents = await SOSIncident.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    incidents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { dispatchSOS, getIncident, getIncidents };
