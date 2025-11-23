import { Container, Card, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GuardianPersonalInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/guardian"
    : "/dashboard/guardian";

  const { user } = useAuth();

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Лични данни</h3>

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
                src={user?.photoURL || profileImage}
                alt="Пациент"
                fluid
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>

          {/* Основни данни – ПАЦИЕНТ */}
          <Col md={8}>
            <p>
              <strong>Име на пациент:</strong> {user?.wardFirstName || "—"}
            </p>
            <p>
              <strong>Фамилия на пациент:</strong> {user?.wardLastName || "—"}
            </p>
            <p>
              <strong>Възраст на пациент:</strong> {user?.wardAge || "—"}
            </p>

            {/* Медицински детайли */}
            <p>
              <strong>Увреждания:</strong>{" "}
              {user?.wardDisabilityDescription || "—"}
            </p>
            <p>
              <strong>Алергии:</strong> {user?.wardAllergies || "—"}
            </p>
            <p>
              <strong>Заболявания:</strong> {user?.wardDiseases || "—"}
            </p>
          </Col>
        </Row>

        <hr />

        {/* Детайли за настойник – ДАННИТЕ ОТ BACKEND */}
        <p>
          <strong>Име на настойник:</strong> {user?.firstName}
        </p>
        <p>
          <strong>Фамилия на настойник:</strong> {user?.lastName}
        </p>
        <p>
          <strong>Възраст на настойник:</strong> {user?.age}
        </p>
        <p>
          <strong>Имейл:</strong> {user?.email}
        </p>
        <p>
          <strong>Телефон:</strong> {user?.phoneNumber || "—"}
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

export default GuardianPersonalInformation;
