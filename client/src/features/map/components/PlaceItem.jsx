import React from "react";

export const PlaceItem = ({ place, isSelected, onClick, type }) => {
  const sidebarItemStyle = {
    padding: "12px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    background: isSelected ? "#f0f8ff" : "white",
    borderColor: "#2e8b57",
  };

  return (
    <div style={sidebarItemStyle} onClick={onClick}>
      <strong>{place.display_name.split(",")[0]}</strong>
      <br />
      <small>{Math.round(place.distance)} m</small>
      <br />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ color: "#2e8b57", fontWeight: "bold" }}
      >
        {type === "hospital" ? "➜ Навигирай" : "Навигирай →"}
      </a>
    </div>
  );
};