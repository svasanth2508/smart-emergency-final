const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { sendNotification } = require("../services/onesignalService");

router.post("/trigger", async (req, res) => {
  const { lat, lng } = req.body;
  const alert = await Alert.create({ lat, lng });
  await sendNotification("🚨 Emergency Nearby!");
  res.json(alert);
});

router.get("/active", async (req, res) => {
  const alerts = await Alert.find({ status: "active" });
  res.json(alerts);
});

module.exports = router;
