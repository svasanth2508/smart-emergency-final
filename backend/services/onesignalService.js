const axios = require("axios");

const sendNotification = async (message, data = {}) => {
  try {
    if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_API_KEY) {
      console.log("⚠️ OneSignal keys missing in backend .env");
      return;
    }

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { en: "EmergX Alert" },
        contents: { en: message },
        data,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
        },
      }
    );

    console.log("✅ OneSignal notification sent:", response.data.id || response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ OneSignal error:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendNotification;