import { useState, useEffect } from "react";
import { Container, Card, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useAuth } from "../../context/AuthContext";

const DoctorPersonalInformation = ({ user: mockUser, readOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [displayUser, setDisplayUser] = useState(mockUser || authUser || {});

  const basePath = location.pathname.startsWith("/test")
    ? "/test/doctor"
    : "/dashboard/doctor";

  useEffect(() => {
    // Ако вече имаме mockUser, няма нужда да fetch-ваме
    if (mockUser || !authUser?.id) return;

    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/doctor/${authUser.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDisplayUser(data);
        }
      } catch (error) {
        console.error("Грешка при зареждане на профила:", error);
      }
    };

    fetchLatestData();
  }, [authUser?.id, mockUser]);

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Лични данни</h3>

        <Row>
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
                alt="Доктор"
                fluid
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
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
          <strong>Специализация:</strong>{" "}
          {displayUser?.specialization || "—"}
        </p>
        <p>
          <strong>Опит (години):</strong>{" "}
          {displayUser?.yearsOfExperience || "—"}
        </p>
        <p>
          <strong>Град:</strong> {displayUser?.city || "—"}
        </p>
        <p>
          <strong>Кабинет:</strong> {displayUser?.hospital || "—"}
        </p>

        {!readOnly && (
          <div className="text-center mt-4">
            <Button
              variant="success"
              className="px-4"
              onClick={() =>
                navigate(`${basePath}/personal_information/edit`)
              }
            >
              ✏️ Редактирай
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default DoctorPersonalInformation;
