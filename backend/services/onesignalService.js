const axios = require("axios");

exports.sendNotification = async (message) => {
  await axios.post(
    "https://onesignal.com/api/v1/notifications",
    {
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ["All"],
      contents: { en: message }
    },
    {
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
      }
    }
  );
};
