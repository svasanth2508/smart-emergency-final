import React from "react";

function Dashboard() {

  const sendSOS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetch("http://localhost:5000/api/sos/trigger", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      });
    });
  };

  return (
    <div>
      <h1>Smart Emergency</h1>
      <button onClick={sendSOS}>🚨 SOS</button>
    </div>
  );
}

export default Dashboard;
