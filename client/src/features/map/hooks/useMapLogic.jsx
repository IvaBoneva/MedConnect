import { useState, useEffect, useRef } from "react";
import { getDistance } from "geolib";

export const useMapLogic = () => {
  const [coords, setCoords] = useState({ lat: 42.6977, lng: 23.3219 });
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const watchIdRef = useRef(null);
  const lastCoordsRef = useRef(null);

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

  return {
    coords,
    pharmacies,
    hospitals,
    gpsEnabled,
    setGpsEnabled,
    loading,
  };
};
