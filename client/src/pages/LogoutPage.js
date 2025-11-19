import { useState } from "react";
import { Container, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuth(); // 👈 use the same context function

  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const handleConfirmLogout = () => {
    setLoading(true); // показваме spinner
    localStorage.removeItem("token"); // изчистваме токени
    setToken(null); // This will clear localStorage and axios headers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userRole");
    navigate("/"); // пренасочваме към главната страница
    localStorage.removeItem("user");
    setUser(null);

    // Симулираме кратка обработка (напр. API call)
    // setTimeout(() => {
    //   setLoading(false);
    //   navigate("/"); // пренасочваме към главната страница
    // }, 2000);
  };

  //   const handleConfirmLogout = () => {
  //   setLoading(true);
  //   setToken(null); // this triggers re-render
  //   // Give React a tick to process the context update before navigating
  //   setTimeout(() => {
  //     setLoading(false);
  //     navigate("/", { replace: true });
  //   }, 500); // 0.5 s is plenty; don't use 2000
  // };

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
