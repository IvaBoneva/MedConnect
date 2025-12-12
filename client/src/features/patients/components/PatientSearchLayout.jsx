import { Form, Row, Col, InputGroup, Container } from "react-bootstrap";
import { PatientCard } from "./PatientCard";

export const PatientSearchLayout = ({
  query,
  setQuery,
  sort,
  setSort,
  filteredPatients,
  onSelectPatient,
}) => {
  return (
    <Container className="py-3">
      <h3 className="mb-4 text-success">Търсене на пациент</h3>
      <Form className="mb-4">
        <Row className="g-2 align-items-center">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <span role="img" aria-label="лупа">
                  🔍
                </span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Търси по име..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Без сортиране</option>
              <option value="fname">По първо име (възх.)</option>
              <option value="lname">По фамилия (възх.)</option>
              <option value="age">По възраст (възх.)</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Col md={4} key={patient.id} className="mb-3">
              <PatientCard
                patient={patient}
                onSelect={() => onSelectPatient(patient)}
              />
            </Col>
          ))
        ) : (
          <p className="text-muted mt-3">Няма намерени резултати.</p>
        )}
      </Row>
    </Container>
  );
};