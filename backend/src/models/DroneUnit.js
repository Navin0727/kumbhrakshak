const mongoose = require('mongoose');

const droneUnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    callSign: { type: String, required: true, unique: true },
    unitType: {
      type: String,
      required: true,
      enum: [
        'Lifebuoy Drop & Water Rescue',
        'River Bank Surveillance',
        'Thermal Missing Search',
        'First-Aid Kit Airborne Delivery',
      ],
    },
    sector: { type: String, required: true },
    currentZone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PATROLLING', 'STANDBY', 'MISSION_ACTIVE', 'RETURNING'],
      default: 'STANDBY',
      index: true,
    },
    batteryPercent: { type: Number, default: 100, min: 0, max: 100 },
    altitudeMeters: { type: Number, default: 0 },
    speedKmh: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },
    payloadEquipped: { type: String, default: '' },
    cameraFeedStatus: {
      type: String,
      enum: ['HD LIVE 60FPS', 'INFRARED NIGHT', 'THERMAL SCAN'],
      default: 'HD LIVE 60FPS',
    },
    lastPatrolPing: { type: String, default: '' },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('DroneUnit', droneUnitSchema);
