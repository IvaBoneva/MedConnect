import { Card, Button } from "react-bootstrap";

export const PatientCard = ({ patient, onSelect }) => (
  <Card className="shadow-sm h-100">
    <Card.Body>
      <Card.Title>{patient.fname + " " + patient.lname}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {patient.age} години
      </Card.Subtitle>
      <Card.Text>🦠 {patient.allergies}</Card.Text>
      <Card.Text>🚑 {patient.diseases}</Card.Text>
      <Card.Text>♿ {patient.disabilities}</Card.Text>
      <Button variant="success" onClick={onSelect} className="w-100 mt-3">
        Виж профила
      </Button>
    </Card.Body>
  </Card>
);