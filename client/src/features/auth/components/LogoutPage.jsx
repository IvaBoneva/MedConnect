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
    <Container
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: "85vh" }}
    >
      <Card
        className="p-4 text-center"
        style={{
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
          borderRadius: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="mb-4">
           <h3 className="text-success">🔓 Изход</h3>
        </div>
        
        <h5 className="text-secondary mb-4">
          Наистина ли искате да излезете?
        </h5>

        {loading ? (
          <div className="d-flex justify-content-center my-3">
            <Spinner animation="border" role="status" variant="success">
              <span className="visually-hidden">Излизане...</span>
            </Spinner>
          </div>
        ) : (
          <div className="d-flex justify-content-around mt-3">
            <Button 
              variant="secondary" 
              onClick={handleCancelLogout}
              style={{ minWidth: "100px" }}
            >
              Отказ
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmLogout}
              style={{ minWidth: "100px" }}
            >
              Изход
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default LogoutPage;
