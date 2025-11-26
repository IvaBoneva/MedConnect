import { Button, Image } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import DoctorReviews from "./DoctorReviews";

// Фикс за leaflet иконите
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DoctorDetails = ({ doctor, onBack }) => {
  const [coords, setCoords] = useState(null);

  // Търси координати на кабинета
  useEffect(() => {
    const fetchCoords = async () => {
      if (!doctor.hospital) return;

      const query = encodeURIComponent(`${doctor.hospital} ${doctor.city}`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        });
      }
    };

    fetchCoords();
  }, [doctor.hospital, doctor.city]);

  return (
    <div>
      <Button variant="secondary" onClick={onBack} className="mb-3">
        ← Назад към търсачката
      </Button>

      <div className="p-4 bg-light rounded shadow-sm mb-4 d-flex align-items-center">
        <Image
          src={doctor.photo}
          alt={"Д-р " + doctor.fname + " " + doctor.lname}
          rounded
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginRight: "20px",
            borderRadius: "10px",
            border: "3px solid #2E8B57",
            backgroundColor: "#f8f9fa",
          }}
        />

        <div>
          <h4>{"Д-р " + doctor.fname + " " + doctor.lname}</h4>
          <p>{doctor.specialty}</p>
          <p>⭐ Рейтинг: {doctor.rating}</p>
          <p>📍 Град: {doctor.city}</p>
          <p>🏥 Кабинет: {doctor.hospital}</p>
          <p>🩺 Опит: {doctor.experience} години</p>
          <p>
            📞 Контакти:
            <br />
            {doctor.email}
            <br />
            {doctor.phone}
          </p>
        </div>
      </div>

      {/* ⭐ Мини карта за кабинета */}
      <div className="mb-4">
        <h5>🗺️ Местоположение на кабинета</h5>

        {coords ? (
          <div
            style={{
              width: "100%",
              height: "250px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={16}
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
          </div>
        ) : (
          <p>Зареждане на локацията…</p>
        )}
      </div>

      <div className="mb-4">
        <h5>📅 График и записване</h5>
        <iframe
          title="Google Calendar"
          src="https://calendar.google.com/calendar/embed?src=bg.bulgarian%23holiday%40group.v.calendar.google.com"
          style={{ border: 0, width: "100%", height: "400px" }}
        />
      </div>

      <DoctorReviews doctorId={doctor.id} />
    </div>
  );
};

export default DoctorDetails;
