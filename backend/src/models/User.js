const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ageGroup: {
      type: String,
      enum: ['18-30', '31-50', '51-65', '65+', ''],
      default: '',
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'mr', 'gu', 'sa'],
      default: 'en',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    allergies: { type: String, default: 'None' },
    medicalConditions: { type: String, default: 'None' },
    currentMedications: { type: String, default: 'None' },
    mobilityAssistance: { type: Boolean, default: false },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: {
        type: String,
        enum: ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other', ''],
        default: '',
      },
    },
    pilgrimId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['pilgrim', 'volunteer', 'official', 'admin'],
      default: 'pilgrim',
    },
    isRegistered: { type: Boolean, default: true },
    originCity: { type: String, default: '' },
    badgeNumber: { type: String, default: '' },
    dutySector: { type: String, default: '' },
    // OTP management
    otpCode: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.otpCode;
        delete ret.otpExpiresAt;
        return ret;
      },
    },
  }
);

// Index for phone number lookups
userSchema.index({ phoneNumber: 1 });

// Virtual for QR code URL
userSchema.virtual('emergencyQrCode').get(function () {
  const name = encodeURIComponent(this.fullName);
  const blood = this.bloodGroup;
  const emgPhone = this.emergencyContact?.phone || '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:${this.pilgrimId}:${name}:Blood_${blood}:EMG_${encodeURIComponent(emgPhone)}`;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
