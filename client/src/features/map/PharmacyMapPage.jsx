import React, { useState, useEffect } from "react";
import { useMapLogic } from "./hooks/useMapLogic";
import { MapSidebar } from "./components/MapSidebar";
import { MapView } from "./components/MapView";

const PharmacyMapPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const { coords, pharmacies, hospitals, gpsEnabled, setGpsEnabled, loading } =
    useMapLogic();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
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
