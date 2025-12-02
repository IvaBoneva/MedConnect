import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getDistance } from "geolib";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Икони
delete L.Icon.Default.prototype._getIconUrl;

const pharmacyIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // примерна икона за избрано
  iconRetinaUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  shadowUrl: markerShadow,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
});

const PharmacyMap = () => {
  const [coords, setCoords] = useState({ lat: 42.6977, lng: 23.3219 }); // Default София
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const watchIdRef = useRef(null);
  const lastCoordsRef = useRef(null); // за throttle

  // Слушаме resize за responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (gpsEnabled) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => stopTracking();
  }, [gpsEnabled]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Геолокацията не е поддържана от вашия браузър.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(newCoords);
        fetchIfFarEnough(newCoords);
      },
      (err) => {
        console.error("Грешка при геолокация:", err);
      },
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const fetchIfFarEnough = ({ lat, lng }) => {
    if (!lastCoordsRef.current) {
      lastCoordsRef.current = { lat, lng };
      fetchNearbyPharmacies({ lat, lng });
      fetchNearbyHospitals({ lat, lng });
      return;
    }
    const distance = getDistance(lastCoordsRef.current, {
      latitude: lat,
      longitude: lng,
    });
    if (distance > 50) {
      lastCoordsRef.current = { lat, lng };
      fetchNearbyPharmacies({ lat, lng });
      fetchNearbyHospitals({ lat, lng });
    }
  };

  const fetchNearbyPharmacies = async ({ lat, lng }) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&amenity=pharmacy&addressdetails=1&limit=20&bounded=1&viewbox=${
        lng - 0.01
      },${lat + 0.01},${lng + 0.01},${lat - 0.01}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "MedConnect/1.0" },
      });
      const data = await res.json();

      const enhanced = data.map((p) => ({
        ...p,
        distance: getDistance(
          { latitude: lat, longitude: lng },
          { latitude: p.lat, longitude: p.lon }
        ),
      }));

      enhanced.sort((a, b) => a.distance - b.distance);
      setPharmacies(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyHospitals = async ({ lat, lng }) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&amenity=hospital&addressdetails=1&limit=20&bounded=1&viewbox=${
        lng - 0.02
      },${lat + 0.02},${lng + 0.02},${lat - 0.02}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "MedConnect/1.0" },
      });
      const data = await res.json();

      const enhanced = data.map((h) => ({
        ...h,
        distance: getDistance(
          { latitude: lat, longitude: lng },
          { latitude: h.lat, longitude: h.lon }
        ),
      }));

      enhanced.sort((a, b) => a.distance - b.distance);
      setHospitals(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const FlyToMarker = ({ pos, zoom = 16 }) => {
    const map = useMap();
    useEffect(() => {
      if (pos) map.flyTo([pos.lat, pos.lon], zoom);
    }, [pos, map, zoom]);
    return null;
  };

  const sidebarItemStyle = {
    padding: "12px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: isMobile ? "100%" : "350px",
            maxHeight: isMobile ? "300px" : "100%",
            overflowY: "auto",
            padding: "20px",
            borderRight: isMobile ? "none" : "1px solid #ccc",
            borderBottom: isMobile ? "1px solid #ccc" : "none",
            background: "#f9f9f9",
            marginBottom: isMobile ? "30px" : "0px",
          }}
        >
          <h4>Близки места</h4>

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
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#256d45")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#2e8b57")
            }
          >
            {gpsEnabled ? "Спри GPS" : "Активирай GPS"}
          </button>

          {!gpsEnabled && (
            <p>Активирай GPS, за да видиш близките аптеки и болници.</p>
          )}
          {loading && <p>Зареждане на места...</p>}

          {/* Аптеки */}
          {gpsEnabled && pharmacies.length > 0 && (
            <>
              <h5>Аптеки</h5>
              {pharmacies.map((p, i) => (
                <div
                  key={`ph-${i}`}
                  style={{
                    ...sidebarItemStyle,
                    background: selectedPharmacy === i ? "#f0f8ff" : "white",
                    borderColor: "#2e8b57",
                  }}
                  onClick={() => {
                    setSelectedPharmacy(i);
                    setSelectedHospital(null);
                  }}
                >
                  <strong>{p.display_name.split(",")[0]}</strong>
                  <br />
                  <small>{Math.round(p.distance)} m</small>
                  <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Навигирай →
                  </a>
                </div>
              ))}
            </>
          )}

          {/* Болници */}
          {gpsEnabled && hospitals.length > 0 && (
            <>
              <h5>Болници</h5>
              {hospitals.map((h, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    ...sidebarItemStyle,
                    background: selectedHospital === i ? "#f0f8ff" : "white",
                    borderColor: "#2e8b57",
                  }}
                  onClick={() => {
                    setSelectedHospital(i);
                    setSelectedPharmacy(null);
                  }}
                >
                  <strong>{h.display_name.split(",")[0]}</strong>
                  <br />
                  <small>{Math.round(h.distance)} m</small>
                  <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ➜ Навигирай
                  </a>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Map */}
        <div style={{ flex: 1, height: isMobile ? "400px" : "100%" }}>
          <MapContainer
            center={coords}
            zoom={14}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords} icon={pharmacyIcon}>
              <Popup>Ти си тук</Popup>
            </Marker>

            {/* Аптеки */}
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

            {/* Болници */}
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

            {/* Fly to selected */}
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
      </div>
    </div>
  );
};

export default PharmacyMap;
