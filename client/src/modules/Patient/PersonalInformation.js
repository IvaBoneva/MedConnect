import { Container, Card, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const { user } = useAuth();
  const [displayUser, setDisplayUser] = useState(user || {});

  useEffect(() => {
    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      
      if (!user?.id || !token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/user/patient/${user.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          setDisplayUser(data);
        }
      } catch (error) {
        console.error("Грешка при зареждане на профила:", error);
      }
    };

    fetchLatestData();
  }, [user?.id]);

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
                src={displayUser?.photoURL || profileImage}
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

          <Col md={8}>
            <p>
              <strong>Име:</strong> {displayUser?.firstName || "—"}
            </p>
            <p>
              <strong>Фамилия:</strong> {displayUser?.lastName || "—"}
            </p>
            <p>
              <strong>Възраст:</strong> {displayUser?.age || "—"}
            </p>
            <p>
              <strong>Имейл:</strong> {displayUser?.email || "—"}
            </p>
            <p>
              <strong>Телефон:</strong> {displayUser?.phoneNumber || "—"}
            </p>
          </Col>
        </Row>

        <hr />
        <p>
          <strong>Алергии:</strong> {displayUser?.allergies || "—"}
        </p>
        <p>
          <strong>Заболявания:</strong> {displayUser?.diseases || "—"}
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