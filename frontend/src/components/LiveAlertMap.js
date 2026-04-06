import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "../services/socket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LiveAlertMap() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/sos`
        );
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("❌ Error fetching alerts:", error);
      }
    };

    fetchAlerts();

    socket.on("newAlert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      socket.off("newAlert");
    };
  }, []);

  const defaultCenter =
    alerts.length > 0
      ? [alerts[0].location.lat, alerts[0].location.lng]
      : [10.9601, 78.0766];

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        marginTop: "20px",
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts.map((alert) => (
          <Marker
            key={alert._id}
            position={[alert.location.lat, alert.location.lng]}
          >
            <Popup>
              <div>
                <strong>🚨 Emergency Alert</strong>
                <br />
                User: {alert.userId}
                <br />
                Status: {alert.status}
                <br />
                Lat: {alert.location.lat}
                <br />
                Lng: {alert.location.lng}
                <br />
                Time:{" "}
                {alert.createdAt
                  ? new Date(alert.createdAt).toLocaleString()
                  : "Now"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default LiveAlertMap;