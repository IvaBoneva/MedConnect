import { Card, Button } from "react-bootstrap";

const PatientCard = ({ patient, onSelect }) => (
  <Card className="shadow-sm">
    <Card.Body>
      <Card.Title>{patient.fname + " " + patient.lname}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {patient.age} години
      </Card.Subtitle>
      <Card.Text>🦠 {patient.allergies}</Card.Text>
      <Card.Text>🚑 {patient.diseases}</Card.Text>
      <Card.Text>♿ {patient.disabilities}</Card.Text>
      <Button variant="success" onClick={onSelect}>
        Виж профила
      </Button>
    </Card.Body>
  </Card>
);

export default PatientCard;
