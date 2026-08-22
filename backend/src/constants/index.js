// Responder sectors for SOS dispatch assignment
const RESPONDER_SECTORS = [
  'Panchavati Sector 4 Rapid Response Unit #12',
  'Ramkund Ghat NDRF Rescue Unit #7',
  'Tapovan Mela Control Room Unit #3',
  'Trimbakeshwar Hill Response Team #9',
  'Nashik City Central Command #1',
];

// ETA ranges based on severity
const ETA_RANGES = ['2-3 minutes', '3-5 minutes', '5-8 minutes', '8-12 minutes'];

// User roles
const ROLES = {
  PILGRIM: 'pilgrim',
  VOLUNTEER: 'volunteer',
  OFFICIAL: 'official',
  ADMIN: 'admin',
};

module.exports = {
  RESPONDER_SECTORS,
  ETA_RANGES,
  ROLES,
};
