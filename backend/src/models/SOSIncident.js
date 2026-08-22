const mongoose = require('mongoose');

const sosIncidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    pilgrimName: { type: String, required: true },
    location: { type: String, required: true },
    emergencyType: { type: String, required: true },
    medicalDetails: {
      bloodGroup: { type: String, default: 'Unknown' },
      allergies: { type: String, default: 'None' },
      conditions: { type: String, default: 'None' },
    },
    contactPhone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'DISPATCHED', 'ARRIVED', 'RESOLVED'],
      default: 'DISPATCHED',
      index: true,
    },
    responderSector: { type: String, default: '' },
    estimatedEta: { type: String, default: '' },
    controlRoomNotified: { type: Boolean, default: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
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

module.exports = mongoose.model('SOSIncident', sosIncidentSchema);
