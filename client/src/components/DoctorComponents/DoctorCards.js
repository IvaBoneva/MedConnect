import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";



const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  
  const handleSelect = () => {
    navigate(`/doctor/${doctor.slug}`);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>
          {"Д-р " + doctor.firstName + " " + doctor.lastName}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {doctor.specialization}
        </Card.Subtitle>
        <Card.Text>📍 {doctor.city}</Card.Text>
        <Card.Text>⭐ {doctor.rating}</Card.Text>
        <Button variant="success" onClick={handleSelect}>
          Виж профила
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
