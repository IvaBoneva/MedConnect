import { useState } from "react";
import { Form, Row, Col, InputGroup, Container } from "react-bootstrap";
import PatientCard from "./PatientCard";
import patient1 from "../../images/patient1.jpg";
import patient2 from "../../images/patient2.jpg";
import patient3 from "../../images/patient3.jpg";

const mockPatients = [
  {
    id: 1,
    photo: patient3,
    fname: "Ивана",
    lname: "Петрова",
    age: 36,
    email: "petrovа@example.com",
    phone: "0887642143",
    allergies: "Полени",
    diseases: "Хипертония",
    disabilities: "Няма",
  },
  {
    id: 2,
    photo: patient2,
    fname: "Мария",
    lname: "Георгиева",
    age: 40,
    email: "karina_d@example.com",
    phone: "0887561422",
    allergies: "Прах",
    diseases: "Няма",
    disabilities: "Слепота",
  },
  {
    id: 3,
    photo: patient1,
    fname: "Николай",
    lname: "Костов",
    age: 51,
    email: "nikkostov@example.com",
    phone: "0888646913",
    allergies: "Полени",
    diseases: "Няма",
    disabilities: "Няма",
  },
];

const PatientSearch = ({ onSelectPatient }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");

  const filteredPatients = mockPatients
    .filter((patient) =>
      (patient.fname + " " + patient.lname)
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "age") return a.age - b.age;
      if (sort === "fname") return a.fname.localeCompare(b.fname);
      if (sort === "lname") return a.lname.localeCompare(b.lname);
      return 0;
    });

  return (
    <Container className="py-3">
      <h3 className="mb-4 text-success">Търсене на пациент</h3>
      <Form className="mb-4">
        <Row className="g-2 align-items-center">
          {/* Поле за търсене с иконка */}
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

          {/* Сортиране */}
          <Col md={2}>
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

export default PatientSearch;
