import { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup, Container } from "react-bootstrap";
import DoctorCard from "./DoctorCard";
import { getDoctors } from "../../api/doctorApi";

const DoctorSearch = () => {
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sort, setSort] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter((doc) =>
      ("Д-р " + doc.fname + " " + doc.lname)
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .filter((doc) =>
      specialtyFilter ? doc.specialty === specialtyFilter : true
    )
    .filter((doc) => (cityFilter ? doc.city === cityFilter : true))
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "fname") return a.fname.localeCompare(b.fname);
      if (sort === "lname") return a.lname.localeCompare(b.lname);
      return 0;
    });

  return (
    <Container className="py-3">
      <h3 className="mb-4 text-success">Търсене на лекар</h3>
      <Form className="mb-4">
        <Row className="g-2 align-items-center">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                🔍
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
            <Form.Select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">Всички специалности</option>
              <option value="Кардиолог">Кардиолог</option>
              <option value="Невролог">Невролог</option>
              <option value="Дерматолог">Дерматолог</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">Всички градове</option>
              <option value="София">София</option>
              <option value="Пловдив">Пловдив</option>
              <option value="Варна">Варна</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Без сортиране</option>
              <option value="rating">По рейтинг (низх.)</option>
              <option value="fname">По първо име (възх.)</option>
              <option value="lname">По фамилия (възх.)</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Col md={4} key={doctor.id} className="mb-3">
              <DoctorCard doctor={doctor} />
            </Col>
          ))
        ) : (
          <p className="text-muted mt-3">Няма намерени резултати.</p>
        )}
      </Row>
    </Container>
  );
};

export default DoctorSearch;
