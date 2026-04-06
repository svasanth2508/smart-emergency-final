import OneSignal from "react-onesignal";

export const initOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: process.env.REACT_APP_ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: { enable: true },
    });

    await OneSignal.showSlidedownPrompt();

    console.log("✅ OneSignal initialized");
  } catch (err) {
    console.error("❌ OneSignal error:", err);
  }
};