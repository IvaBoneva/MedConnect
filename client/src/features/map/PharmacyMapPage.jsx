import React, { useState, useEffect } from "react";
import { useMapLogic } from "./hooks/useMapLogic";
import { MapSidebar } from "./components/MapSidebar";
import { MapView } from "./components/MapView";

const PharmacyMapPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const { coords, pharmacies, hospitals, gpsEnabled, setGpsEnabled, loading } =
    useMapLogic();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true); // винаги показан на desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Височината на контейнера задаваме на 800px, може да се променя
  const containerHeight = 800;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: containerHeight,
        gap: "10px",
        position: "relative",
      }}
    >
      {/* MOBILE TOGGLE BUTTON */}
      {isMobile && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "#2e8b57",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "6px 14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {showSidebar ? "⬇ Скрий списъка" : "⬆ Покажи списъка"}
        </button>
      )}

      {/* SIDEBAR */}
      {(!isMobile || showSidebar) && (
        <div
          style={{
            flex: isMobile ? "0 0 auto" : "0 0 320px",
            maxHeight: isMobile ? "45vh" : "100%",
            overflowY: "auto",
            borderBottom: isMobile ? "1px solid #ddd" : "none",
          }}
        >
          <MapSidebar
            isMobile={isMobile}
            gpsEnabled={gpsEnabled}
            setGpsEnabled={setGpsEnabled}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            loading={loading}
            pharmacies={pharmacies}
            hospitals={hospitals}
            selectedPharmacy={selectedPharmacy}
            setSelectedPharmacy={setSelectedPharmacy}
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
          />
        </div>
      )}

      {/* MAP */}
      <div
        style={{
          flex: 1,
          minHeight: isMobile && !showSidebar ? "100%" : "auto",
        }}
      >
        <MapView
          coords={coords}
          darkMode={darkMode}
          pharmacies={pharmacies}
          hospitals={hospitals}
          selectedPharmacy={selectedPharmacy}
          selectedHospital={selectedHospital}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default PharmacyMapPage;
