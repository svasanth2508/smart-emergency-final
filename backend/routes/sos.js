const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const sendNotification = require("../services/onesignalService");

// GET all recent alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new SOS alert
router.post("/", async (req, res) => {
  try {
    const { userId, lat, lng } = req.body;

    if (!userId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        error: "userId, lat and lng are required",
      });
    }

    const alert = new Alert({
      userId,
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },
      status: "active",
    });

    await alert.save();

    await sendNotification(
      "🚨 Emergency alert! Help needed nearby.",
      {
        alertId: alert._id.toString(),
        userId,
        lat: Number(lat),
        lng: Number(lng),
        type: "sos_alert",
      }
    );

    if (req.io) {
      req.io.emit("newAlert", {
        _id: alert._id,
        userId: alert.userId,
        location: alert.location,
        status: alert.status,
        createdAt: alert.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "SOS alert created successfully",
      alert,
    });
  } catch (err) {
    console.error("❌ SOS route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;