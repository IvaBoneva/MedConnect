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

  // Примерни данни – по-късно ще идват от backend
  const userData = {
    photo: null,
    fname: "Иван",
    lname: "Петров",
    age: 32,
    email: "ivan.petrov@example.com",
    phone: "+359888123456",
    patientFName: "Калоян",
    patientLName: "Георгиев",
    patientAge: 67,
    disabilities: "Слепота",
    allergies: "Няма",
    diseases: "Хипертония",
  };

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
                src={userData.photo || profileImage}
                alt="Пациент"
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
              <strong>Име на пациент:</strong> {userData.patientFName || "—"}
                {/* <p><strong>Име на пациент:</strong> {user.firstName}</p>  Coming from backend - TEST */}

            </p>
            <p>
              <strong>Фамилия на пациент:</strong>{" "}
              {userData.patientLName || "—"}
              {/* <strong>Име на пациент:</strong> {user.lastName} Coming from the backend  */}
            </p>
            <p>
              <strong>Възраст на пациент:</strong> {userData.patientAge || "—"}
            </p>

            {/* Медицински детайли */}
            <p>
              <strong>Увреждания:</strong> {userData.disabilities || "—"}
            </p>
            <p>
              <strong>Алергии:</strong> {userData.allergies || "—"}
            </p>
            <p>
              <strong>Заболявания:</strong> {userData.diseases || "—"}
            </p>
          </Col>
        </Row>

        <hr />

        {/* Детайли за настойник */}

        <p>
          <strong>Име на настойник:</strong> {userData.fname || "—"}
        </p>
        <p>
          <strong>Фамилия на настойник:</strong> {userData.lname || "—"}
        </p>
        <p>
          <strong>Възраст на настойник:</strong> {userData.age || "—"}
        </p>
        <p>
          <strong>Имейл:</strong> {userData.email || "—"}
        </p>
        <p>
          <strong>Телефон:</strong> {userData.phone || "—"}
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
