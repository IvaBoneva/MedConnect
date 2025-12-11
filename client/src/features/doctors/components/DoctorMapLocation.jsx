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
  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[coords.lat, coords.lon]}>
        <Popup>
          <b>{doctor.hospital}</b> <br />
          {doctor.city} <br />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lon}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ➜ Навигирай
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
};