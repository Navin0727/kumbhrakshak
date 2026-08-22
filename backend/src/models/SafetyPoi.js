const mongoose = require('mongoose');

const AREAS = ['NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];
const CATEGORIES = ['hospital', 'police', 'petrol', 'booth', 'ghat', 'water', 'drone', 'shuttle', 'food'];

const safetyPoiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    sector: { type: String, required: true },
    area: { type: String, required: true, enum: AREAS, index: true },
    distanceKm: { type: Number, default: 0 },
    openStatus: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    is24x7: { type: Boolean, default: false },
    facilities: [{ type: String }],
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

safetyPoiSchema.index({ category: 1, area: 1 });

module.exports = mongoose.model('SafetyPoi', safetyPoiSchema);
