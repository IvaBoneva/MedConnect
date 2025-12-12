import React from "react";
import { Button } from "react-bootstrap"; 

export const MapControls = ({ gpsEnabled, setGpsEnabled, darkMode, setDarkMode }) => {
  return (
    <div className="mb-3">
      <button
        onClick={() => setGpsEnabled(!gpsEnabled)}
        style={{
          display: "inline-block",
          backgroundColor: "#2e8b57",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 16px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        {gpsEnabled ? "Спри GPS" : "Активирай GPS"}
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          display: "block",
          backgroundColor: darkMode ? "#333" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        {darkMode ? "🌞 Светла карта" : "🌙 Тъмна карта"}
      </button>
    </div>
  );
};