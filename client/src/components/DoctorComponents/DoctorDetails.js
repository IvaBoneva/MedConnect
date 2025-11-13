import { Button, Image } from "react-bootstrap";
import DoctorReviews from "./DoctorReviews";

const DoctorDetails = ({ doctor, onBack }) => (
  <div>
    <Button variant="secondary" onClick={onBack} className="mb-3">
      ← Назад към търсачката
    </Button>

    <div className="p-4 bg-light rounded shadow-sm mb-4 d-flex align-items-center">
      {/* Снимка на лекаря */}
      <Image
        src={doctor.photo}
        alt={doctor.name}
        rounded
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          marginRight: "20px",
          borderRadius: "10px",
          border: "3px solid #2E8B57",
          backgroundColor: "#f8f9fa",
          overflow: "hidden",
        }}
      />

      <div>
        <h4>{doctor.name}</h4>
        <p>{doctor.specialty}</p>
        <p>⭐ {doctor.rating}</p>
        <p>📍 {doctor.city}</p>
        <p>🏥 {doctor.hospital}</p>
        <p>🩺 Опит: 12 години</p>
        <p>
          📞 Контакт: dr.{doctor.name.split(" ")[1].toLowerCase()}@medconnect.bg
        </p>
      </div>
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

export default DoctorDetails;
