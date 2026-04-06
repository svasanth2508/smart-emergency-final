const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
