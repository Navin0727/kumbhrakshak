const mongoose = require('mongoose');

const AREAS = ['NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];

const shuttleVehicleSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    driverName: { type: String, default: '' },
    driverPhone: { type: String, default: '' },
    currentStop: { type: String, default: '' },
    nextStop: { type: String, default: '' },
    etaMins: { type: Number, default: 0 },
    occupancy: { type: Number, default: 0 },
    totalSeats: { type: Number, default: 20 },
    isElectric: { type: Boolean, default: true },
    isWheelchairAccessible: { type: Boolean, default: false },
    speedKmh: { type: Number, default: 0 },
  },
  { _id: false }
);

const shuttleRouteSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, required: true },
    routeName: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    area: { type: String, required: true, enum: AREAS },
    operatingHours: { type: String, default: '' },
    frequencyMins: { type: Number, default: 10 },
    fare: { type: String, default: 'Free Pilgrim Seva (₹0)' },
    activeBusesCount: { type: Number, default: 0 },
    stops: [{ type: String }],
    vehicles: [shuttleVehicleSchema],
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

module.exports = mongoose.model('ShuttleRoute', shuttleRouteSchema);
