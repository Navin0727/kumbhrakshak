const mongoose = require('mongoose');

const lostPersonCaseSchema = new mongoose.Schema(
  {
    personName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Child'] },
    lastSeenLocation: { type: String, required: true },
    lastSeenTime: { type: String, required: true },
    clothing: { type: String, default: '' },
    guardianName: { type: String, required: true },
    guardianContact: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    status: {
      type: String,
      required: true,
      enum: ['MISSING', 'INVESTIGATING', 'REUNITED'],
      default: 'MISSING',
      index: true,
    },
    notes: { type: String, default: '' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

module.exports = mongoose.model('LostPersonCase', lostPersonCaseSchema);
