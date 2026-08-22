const mongoose = require('mongoose');

const AREAS = ['NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];

const waterStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    sector: { type: String, required: true },
    area: { type: String, required: true, enum: AREAS },
    distanceKm: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['Chilled RO', 'Electrolyte ORS + RO', 'Normal Purified', 'Mineral Kiosk'],
      default: 'Chilled RO',
    },
    tankLevelPercent: { type: Number, default: 100, min: 0, max: 100 },
    dispensersCount: { type: Number, default: 1 },
    queueWaitMins: { type: Number, default: 0 },
    isOperating: { type: Boolean, default: true },
    refilledAtAgo: { type: String, default: '' },
    managedBy: { type: String, default: '' },
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

module.exports = mongoose.model('WaterStation', waterStationSchema);
