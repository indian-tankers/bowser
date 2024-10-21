const mongoose = require('mongoose');
const { bowsersDatabaseConnection } = require('../../config/database');

const fuelingOrdersSchema = new mongoose.Schema({
  orderId: mongoose.Schema.Types.ObjectId,
  vehicleNumber: { type: String, required: true },
  driverId: { type: String, required: true },
  driverName: { type: String, required: true },
  driverMobile: { type: String },
  quantityType: {
    type: String,
    enum: ['Full', 'Part'],
    required: true
  },
  fuelQuantity: { type: Number, required: true },
  bowserDriver: {
    _id: mongoose.Schema.Types.ObjectId,
    userName: { type: String, },
    userId: { type: String, required: true }
  }
});

// Validate the quantityType
fuelingOrdersSchema.methods.validateQuantityType = function () {
  return ['Full', 'Part'].includes(this.quantityType);
};
module.exports = bowsersDatabaseConnection.model('FuelingOrders', fuelingOrdersSchema, 'FuelingOrdersCollection');