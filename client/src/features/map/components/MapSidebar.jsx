import React from "react";
import { MapControls } from "./MapControls";
import { PlaceItem } from "./PlaceItem";

export const MapSidebar = ({
  isMobile,
  gpsEnabled,
  setGpsEnabled,
  darkMode,
  setDarkMode,
  loading,
  pharmacies,
  hospitals,
  selectedPharmacy,
  setSelectedPharmacy,
  selectedHospital,
  setSelectedHospital,
}) => {
  return (
    <div
      style={{
        width: isMobile ? "100%" : "300px",
        flexShrink: 0,
        overflowY: "auto",
        padding: "20px",
        borderRight: isMobile ? "none" : "1px solid #ccc",
        borderBottom: isMobile ? "1px solid #ccc" : "none",
        background: "#f9f9f9",
        maxHeight: "100%", // Взима височината на контейнера
      }}
    >
      <h4 className="mb-3">Близки места</h4>

      <MapControls
        gpsEnabled={gpsEnabled}
        setGpsEnabled={setGpsEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {!gpsEnabled && (
        <p className="text-muted small">
          Активирай GPS, за да видиш близките аптеки и болници.
        </p>
      )}
      {loading && <p>Зареждане на места...</p>}

      {gpsEnabled && pharmacies.length > 0 && (
        <>
          <h5 className="mt-3 text-success">💊 Аптеки</h5>
          {pharmacies.map((p, i) => (
            <PlaceItem
              key={`ph-${i}`}
              place={p}
              type="pharmacy"
              isSelected={selectedPharmacy === i}
              onClick={() => {
                setSelectedPharmacy(i);
                setSelectedHospital(null);
              }}
            />
          ))}
        </>
      )}

      {gpsEnabled && hospitals.length > 0 && (
        <>
          <h5 className="mt-3 text-success">🏥 Болници</h5>
          {hospitals.map((h, i) => (
            <PlaceItem
              key={`h-${i}`}
              place={h}
              type="hospital"
              isSelected={selectedHospital === i}
              onClick={() => {
                setSelectedHospital(i);
                setSelectedPharmacy(null);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
