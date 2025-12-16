import { Container, Card, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"; 

const GuardianPersonalInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/guardian"
    : "/dashboard/guardian";

  const { user } = useAuth();
  
  const [displayUser, setDisplayUser] = useState(user || {});

  useEffect(() => {
    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      if (!user?.id || !token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/user/guardian/${user.id}`, {
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
        console.error("Error fetching profile:", error);
      }
    };

    fetchLatestData();
  }, [user?.id]);

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Лични данни</h3>
        <Row>
          <Col md={4} className="text-center mb-3 mt-0">
             <Image src={displayUser?.photoURL || profileImage} fluid style={{ width: "150px", height: "150px", objectFit: "cover" }} />
          </Col>
          <Col md={8}>
            <p><strong>Име на пациент:</strong> {displayUser?.wardFirstName || "—"}</p>
            <p><strong>Фамилия на пациент:</strong> {displayUser?.wardLastName || "—"}</p>
            <p><strong>Възраст на пациент:</strong> {displayUser?.wardAge || "—"}</p>
            <p><strong>Увреждания:</strong> {displayUser?.wardDisabilityDescription || "—"}</p>
            <p><strong>Алергии:</strong> {displayUser?.wardAllergies || "—"}</p>
            <p><strong>Заболявания:</strong> {displayUser?.wardDiseases || "—"}</p>
          </Col>
        </Row>
        <hr />
        <p><strong>Име на настойник:</strong> {displayUser?.firstName}</p>
        <p><strong>Фамилия на настойник:</strong> {displayUser?.lastName}</p>
        <p><strong>Възраст на настойник:</strong> {displayUser?.age}</p>
        <p><strong>Имейл:</strong> {displayUser?.email}</p>
        <p><strong>Телефон:</strong> {displayUser?.phoneNumber || "—"}</p>

        <div className="text-center mt-4">
          <Button variant="success" onClick={() => navigate(`${basePath}/personal_information/edit`)}>
            ✏️ Редактирай
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default GuardianPersonalInformation;