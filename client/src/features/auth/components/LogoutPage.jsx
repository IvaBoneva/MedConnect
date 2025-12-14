import { useState } from "react";
import { Container, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuth();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const handleConfirmLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userRole");
    navigate("/");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleCancelLogout = () => {
    navigate(`${basePath}/home`);
  };

  return (
    <Container className="py-5">
      <h3 className="text-success text-left mb-5">🔓 Изход</h3>
      <Card className="p-4 text-center" style={{ maxWidth: "400px" }}>
        <h4 className="text-success mb-4">Наистина ли искате да излезете?</h4>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Излизане...</span>
            </Spinner>
          </div>
        ) : (
          <div className="d-flex justify-content-around">
            <Button variant="secondary" onClick={handleCancelLogout}>
              Отказ
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Изход
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default LogoutPage;
