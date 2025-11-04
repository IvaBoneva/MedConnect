import React from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import doctorImage from "../images/doctor.png";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
          <h1 className="fw-bold" style={{ color: "#2E8B57" }}>
            Добре дошли в MedConnect+
          </h1>
          <p className="lead mt-3">
            Вашият личен здравен асистент — управлявайте прегледи, лекарства и
            медицински досиета на едно сигурно място.
          </p>
          <Button
            variant="primary"
            className="mt-3 px-4 py-2 rounded-pill"
            onClick={() => navigate("/register")}
          >
            Да започваме!
          </Button>
        </Col>
        <Col md={6} className="text-center">
          <img
            src={doctorImage}
            alt="Лекар"
            className="img-fluid"
            style={{ maxHeight: "400px" }}
          />
        </Col>
      </Row>

      <Row className="justify-content-center g-4 mt-4">
        <Col xs={12} sm={10} md={4} lg={3}>
          <Card
            className="p-4 text-left h-100 shadow-sm card-hover"
            style={{ minHeight: "320px" }}
          >
            <h5 style={{ color: "#2E8B57" }}>​​👨‍⚕️ Запазване на часове</h5>
            <p className="text-muted mt-3">
              С MedConnect можете лесно да записвате часове при лекари, да
              следите предстоящи консултации и никога повече да не пропускате
              преглед.
            </p>
          </Card>
        </Col>
        <Col xs={12} sm={10} md={4} lg={3}>
          <Card
            className="p-4 text-left h-100 shadow-sm card-hover"
            style={{ minHeight: "320px" }}
          >
            <h5 style={{ color: "#2E8B57" }}>💊 Напомняния за медикаменти</h5>
            <p className="text-muted mt-3">
              Освободете се от стреса при управлението на лечението си.
              Получавайте автоматични известия за всяко лекарство и бъдете в
              крак със своето здраве.
            </p>
          </Card>
        </Col>
        <Col xs={12} sm={10} md={4} lg={3}>
          <Card
            className="p-4 text-left h-100 shadow-sm card-hover"
            style={{ minHeight: "320px" }}
          >
            <h5 style={{ color: "#2E8B57" }}>📁 Защитено хранилище</h5>
            <p className="text-muted mt-3">
              Съхранявайте медицинските си досиета на едно сигурно място и
              имайте достъп до тях по всяко време и навсякъде — надеждно
              защитени и лесни за споделяне с вашия лекар.
            </p>
          </Card>
        </Col>
        <Col xs={12} sm={10} md={4} lg={3}>
          <Card
            className="p-4 text-left h-100 shadow-sm card-hover"
            style={{ minHeight: "320px" }}
          >
            <h5 style={{ color: "#2E8B57" }}>🩺 Проверка на симптоми</h5>
            <p className="text-muted mt-3">
              Въведете своите симптоми и получете автоматично предложение за
              възможна диагноза или подходящ специалист, към когото да се
              обърнете.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
