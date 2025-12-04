import { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup, Container, Button } from "react-bootstrap";
import DoctorCard from "./DoctorCards";
import doctor1 from "../../images/doctor1.jpg";
import doctor2 from "../../images/doctor2.jpg";
import doctor3 from "../../images/doctor3.jpg";
import { getDoctors } from "../../api/doctorApi";

const DoctorSearch = () => {
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sort, setSort] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [cities, setCities] = useState([]); // New state for cities
  const [specialties, setSpecialties] = useState([]); // State for doctor specializations

  const fetchDoctors = async () => {
    try {
      const doctorsData = await getDoctors();
      setDoctors(doctorsData);
      const topCities = [
        ...new Set(doctorsData.map((doc) => doc.city).filter((city) => city)), // Remove any null or undefined cities
      ];
      setCities(topCities.slice(0, 5));

      const topSpecialities = [
        ...new Set(
          doctorsData
            .map((doc) => doc.specialization)
            .filter((specialty) => specialty)
        ), // Remove any null or undefined cities
      ];
      setSpecialties(topSpecialities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter((doc) =>
      `${doc.firstName} ${doc.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .filter((doc) =>
      specialtyFilter ? doc.specialization === specialtyFilter : true
    )
    .filter((doc) => (cityFilter ? doc.city === cityFilter : true))
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "fname") return a.firstName.localeCompare(b.firstName);
      if (sort === "lname") return a.lastName.localeCompare(b.lastName);
      return 0;
    });

  return (
    <Container className="py-3">
      <h3 className="mb-4 text-success">Търсене на лекар</h3>
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

          {/* Филтър по специалност */}
          <Col md={3}>
            <Form.Select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">Всички специалности</option>
              {specialties.map((speciality, index) => (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              ))}
              {specialties.length > 5 && (
                <option value="other">Други...</option>
              )}
            </Form.Select>
          </Col>


          {/* Филтър по град */}
          <Col md={3}>
            <Form.Select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">Всички градове</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
              {cities.length > 5 && <option value="other">Други...</option>}
            </Form.Select>
          </Col>

          {/* Сортиране */}
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
