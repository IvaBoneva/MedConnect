// In DoctorMapLocation.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const DoctorMapLocation = ({ doctor, coords }) => {
  if (
    !coords ||
    typeof coords.lat !== "number" ||
    typeof coords.lng !== "number"
  ) {
    return null;
  }

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[coords.lat, coords.lng]}>
        <Popup>
          <b>{doctor.hospital}</b> <br />
          {doctor.city} <br />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "10px",
              display: "inline-block",
              color: "#007bff",
            }}
          >
            Навигирай →
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
};
