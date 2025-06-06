const mongoose = require('mongoose');
const moment = require("moment-timezone");
require('./fuelingOrders');
const { bowsersDatabaseConnection } = require('../../config/database');

const fuelRequestSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    capacity: { type: String, required: false },
    odometer: { type: String, required: false },
    tripStatus: String,
    loadStatus: String,
    trip: String,
    startDate: Date,
    manager: [String],
    driverId: { type: String, required: false },
    driverName: { type: String, required: true },
    driverMobile: { type: String, required: true },
    location: { type: String, required: true },
    fulfilled: { type: Boolean, default: false },
    message: { type: String, required: false },
    tripId: { type: String, required: false },
    seen: { type: Boolean, default: false },
    allocation: { type: mongoose.Types.ObjectId, ref: 'FuelingOrder' },
    createdAt: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
});

module.exports = bowsersDatabaseConnection.model('FuelRequest', fuelRequestSchema, 'FuelRequests');
