import React, { useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import DoctorCard from "./DoctorCard";
import doctor1 from "../images/doctor1.jpg";
import doctor2 from "../images/doctor2.jpg";
import doctor3 from "../images/doctor3.jpg";

const mockDoctors = [
  {
    id: 1,
    photo: doctor2,
    name: "Д-р Иван Петров",
    specialty: "Кардиолог",
    hospital: "Болница Пирогов",
    rating: 4.8,
    city: "София",
  },
  {
    id: 2,
    photo: doctor1,
    name: "Д-р Мария Георгиева",

    specialty: "Невролог",
    hospital: "Клиника Здраве",
    rating: 4.6,
    city: "Пловдив",
  },
  {
    id: 3,
    photo: doctor3,
    name: "Д-р Николай Костов",
    specialty: "Дерматолог",
    hospital: "Болница Света Анна",
    rating: 4.9,
    city: "Варна",
  },
];

const DoctorSearch = ({ onSelectDoctor }) => {
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sort, setSort] = useState("");

  const filteredDoctors = mockDoctors
    .filter((doc) => doc.name.toLowerCase().includes(query.toLowerCase()))
    .filter((doc) =>
      specialtyFilter ? doc.specialty === specialtyFilter : true
    )
    .filter((doc) => (cityFilter ? doc.city === cityFilter : true))
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div>
      <h3 className="mb-4 text-success">Намери лекар</h3>
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
              <option value="Кардиолог">Кардиолог</option>
              <option value="Невролог">Невролог</option>
              <option value="Дерматолог">Дерматолог</option>
            </Form.Select>
          </Col>

          {/* Филтър по град */}
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

          {/* Сортиране */}
          <Col md={2}>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Без сортиране</option>
              <option value="rating">По рейтинг</option>
              <option value="name">По име</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Col md={4} key={doctor.id} className="mb-3">
              <DoctorCard
                doctor={doctor}
                onSelect={() => onSelectDoctor(doctor)}
              />
            </Col>
          ))
        ) : (
          <p className="text-muted mt-3">Няма намерени резултати.</p>
        )}
      </Row>
    </div>
  );
};

export default DoctorSearch;
