import React from "react";
import { Container, Card, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useLocation } from "react-router-dom";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  // Примерни данни – по-късно ще идват от backend
  const userData = {
    photo: null,
    fname: "Иван",
    lname: "Петров",
    age: 32,
    email: "ivan.petrov@example.com",
    phone: "+359888123456",
    allergies: "Прах, полени",
    conditions: "Хипертония",
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Лична информация</h3>

        <Row>
          {/* Фото */}
          <Col md={4} className="text-center mb-3 mt-0">
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "10px",
                border: "3px solid #2E8B57",
                backgroundColor: "#f8f9fa",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <Image
                src={userData.photo || profileImage}
                alt="Patient"
                fluid
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                }}
              />
            </div>
          </Col>

          {/* Основни данни */}
          <Col md={8}>
            <p>
              <strong>Име:</strong> {userData.fname || "—"}
            </p>
            <p>
              <strong>Фамилия:</strong> {userData.lname || "—"}
            </p>
            <p>
              <strong>Възраст:</strong> {userData.age || "—"}
            </p>
            <p>
              <strong>Имейл:</strong> {userData.email || "—"}
            </p>
            <p>
              <strong>Телефон:</strong> {userData.phone || "—"}
            </p>
          </Col>
        </Row>

        <hr />

        {/* Медицински детайли */}
        <p>
          <strong>Алергии:</strong> {userData.allergies || "—"}
        </p>
        <p>
          <strong>Заболявания:</strong> {userData.conditions || "—"}
        </p>

        <div className="text-center mt-4">
          <Button
            variant="success"
            className="px-4"
            onClick={() => navigate(`${basePath}/personal_information/edit`)}
          >
            ✏️ Редактирай
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PersonalInformation;
