const mongoose = require('mongoose');

const aartiItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, default: '' },
    crowdLevel: { type: String, enum: ['Safe', 'Moderate', 'Heavy'], default: 'Safe' },
  },
  { _id: false }
);

const templeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    distanceKm: { type: Number, default: 0 },
    photoUrl: { type: String, default: '' },
    photoCredit: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    statusLabel: { type: String, default: '' },
    nextAarti: { type: String, default: '' },
    mahaAartiTime: { type: String, default: '' },
    description: { type: String, default: '' },
    darshanTimings: { type: String, default: '' },
    aartiSchedule: [aartiItemSchema],
    guidelines: [{ type: String }],
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

module.exports = mongoose.model('Temple', templeSchema);
