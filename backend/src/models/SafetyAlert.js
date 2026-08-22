const mongoose = require('mongoose');

const safetyAlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    severity: {
      type: String,
      required: true,
      enum: ['critical', 'warning', 'info', 'safe'],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['CROWD', 'TRAFFIC', 'WEATHER', 'AARTI', 'MEDICAL'],
    },
    location: { type: String, required: true },
    timeAgo: { type: String, default: '' },
    message: { type: String, required: true },
    actionGuidance: { type: String, default: '' },
    verifiedSource: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
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

module.exports = mongoose.model('SafetyAlert', safetyAlertSchema);
