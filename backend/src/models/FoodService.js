const mongoose = require('mongoose');

const AREAS = ['NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];

const foodServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        'Maha Prasad Annakshetra',
        'Free Seva Langar',
        'Pilgrim Dining Hall',
        'Sadhus & Senior Bhojanalaya',
      ],
    },
    organizer: { type: String, default: '' },
    area: { type: String, required: true, enum: AREAS },
    location: { type: String, required: true },
    distanceKm: { type: Number, default: 0 },
    currentStatus: {
      type: String,
      enum: ['Serving Now', 'Next Batch in 15m', 'Evening Dinner Preps'],
      default: 'Serving Now',
    },
    mealTimings: { type: String, default: '' },
    todayMenu: [{ type: String }],
    queueWaitMins: { type: Number, default: 0 },
    mealsServedToday: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    fssaiCertified: { type: Boolean, default: false },
    cleanlinessRating: { type: Number, default: 0, min: 0, max: 5 },
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

module.exports = mongoose.model('FoodService', foodServiceSchema);
