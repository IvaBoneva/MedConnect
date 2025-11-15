import { Card, Button } from "react-bootstrap";

const DoctorCard = ({ doctor, onSelect }) => (
  <Card className="shadow-sm">
    <Card.Body>
      <Card.Title>{"Д-р " + doctor.fname + " " + doctor.lname}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {doctor.specialty}
      </Card.Subtitle>
      <Card.Text>📍 {doctor.city}</Card.Text>
      <Card.Text>⭐ {doctor.rating}</Card.Text>
      <Button variant="success" onClick={onSelect}>
        Виж профила
      </Button>
    </Card.Body>
  </Card>
);

export default DoctorCard;
