import { Image } from "react-bootstrap";
import {StarDisplay} from "./StarDisplay";

export const DoctorDetailsCard = ({doctor}) => {
  return (
    <div
      className="doctor-info"
      style={{
        flex: "1",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex align-items-center">
        <Image
          src={doctor.photoURL}
          alt={"Д-р " + doctor.firstName + " " + doctor.lastName}
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
          <h4 style={{ fontWeight: 700 }}>
            {"Д-р " + doctor.firstName + " " + doctor.lastName}
          </h4>
          <p>{doctor.specialization}</p>
          <div className="mb-2">
             <StarDisplay rating={doctor.rating} />
          </div>
          <p>📍 {doctor.city}</p>
          <p>🏥 {doctor.hospital}</p>
          <p>🩺 Опит: {doctor.yearsOfExperience} години</p>
          <p>
            📞 Контакти:
            <br />
            {doctor.email}
            <br />
            {doctor.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsCard;
