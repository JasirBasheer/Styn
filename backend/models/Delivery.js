// models/Delivery.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  name: String,
  address: String,
  contactNumber: String,
  // Add other relevant fields
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
