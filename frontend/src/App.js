import { useEffect, useState } from "react";
import { initOneSignal } from "./services/onesignal";
import LiveAlertMap from "./components/LiveAlertMap";

function App() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    initOneSignal();
  }, []);

  const handleSOS = async () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported");
      return;
    }

    setSending(true);
    setMessage("Getting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setMessage("Sending SOS...");

          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/sos`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: "test-user-001",
                lat,
                lng,
              }),
            }
          );

          const data = await res.json();

          if (res.ok) {
            setMessage("✅ SOS Sent Successfully");
          } else {
            setMessage("❌ Failed: " + data.error);
          }
        } catch (err) {
          console.error(err);
          setMessage("❌ Error sending SOS");
        } finally {
          setSending(false);
        }
      },
      () => {
        setMessage("❌ Location permission denied");
        setSending(false);
      }
    );
  };

  return (
    <div
      style={{
        background: "#0b1220",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚨 EmergX Dashboard</h1>
      <p>Real-time Emergency System</p>

      <button
        onClick={handleSOS}
        disabled={sending}
        style={{
          padding: "14px 30px",
          fontSize: "18px",
          background: "#e63946",
          border: "none",
          borderRadius: "10px",
          color: "white",
          cursor: "pointer",
        }}
      >
        {sending ? "Sending..." : "🚨 SOS"}
      </button>

      <p>{message}</p>

      <LiveAlertMap />
    </div>
  );
}

export default App;