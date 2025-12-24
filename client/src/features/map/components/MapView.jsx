import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

const pharmacyIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconRetinaUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  shadowUrl: markerShadow,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
});

const FlyToMarker = ({ pos, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo([pos.lat, pos.lon], zoom);
  }, [pos, map, zoom]);
  return null;
};

export const MapView = ({
  coords,
  darkMode,
  pharmacies,
  hospitals,
  selectedPharmacy,
  selectedHospital,
  isMobile,
}) => {
  return (
    <div style={{ flex: 1, height: "100%" }}>
      <MapContainer
        center={coords}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <Marker position={coords} icon={pharmacyIcon}>
          <Popup>Ти си тук</Popup>
        </Marker>

        {pharmacies.map((p, i) => (
          <Marker
            key={`ph-${i}`}
            position={[p.lat, p.lon]}
            icon={selectedPharmacy === i ? selectedIcon : pharmacyIcon}
          >
            <Popup>
              <strong>{p.display_name}</strong>
              <br />
              Разстояние: {Math.round(p.distance)} m
            </Popup>
          </Marker>
        ))}

        {hospitals.map((h, i) => (
          <Marker
            key={`h-${i}`}
            position={[h.lat, h.lon]}
            icon={selectedHospital === i ? selectedIcon : pharmacyIcon}
          >
            <Popup>
              <strong>{h.display_name}</strong>
              <br />
              Разстояние: {Math.round(h.distance)} m
            </Popup>
          </Marker>
        ))}

        {(selectedPharmacy !== null || selectedHospital !== null) && (
          <FlyToMarker
            pos={
              selectedPharmacy !== null
                ? pharmacies[selectedPharmacy]
                : hospitals[selectedHospital]
            }
          />
        )}
      </MapContainer>
    </div>
  );
};
