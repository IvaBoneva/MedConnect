import { Col } from "react-bootstrap";
import doctorImage from "../../../images/doctor.png"; 

export const HeroImage = () => {
    return (
        <Col md={6} className="text-center">
          <img
            src={doctorImage}
            alt="Лекар"
            className="img-fluid"
            style={{ maxHeight: "430px", marginBottom: "-13px" }}
          />
        </Col>
    )
}
