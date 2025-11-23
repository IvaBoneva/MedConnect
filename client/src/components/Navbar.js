import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const NavigationBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  //const { user } = useAuth();
  let { user } = useAuth();
  //user = { ...user, subscription: "premium" }; // simulating premium (to see how it looks) - delete if you want

  // Определяме към кой dashboard да води бутона
  const getDashboardPath = () => {
    if (!isAuthenticated) return "/dashboard"; // ако не е логнат
    switch (user.role) {
      case "patient":
        return "/dashboard/patient/home";
      case "doctor":
        return "/dashboard/doctor/home";
      case "guardian":
        return "/dashboard/guardian/home";
      case "admin":
        return "/dashboard/admin/home";
      default:
        return "/dashboard";
    }
  };

  const handleDashboardClick = () => {
    navigate(getDashboardPath());
  };

  return (
    <Navbar expand="lg" className="navbar-dark shadow-lg" sticky="top">
      <Container>
        {user?.subscription === "premium" ? (
          <Navbar.Brand as={Link} to="/">
            MedConnect+{" "}
            <i style={{ fontSize: "15px", color: "#e8f5e9" }}>Premium</i>
          </Navbar.Brand>
        ) : (
          <Navbar.Brand as={Link} to="/">
            MedConnect+
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Начало
            </Nav.Link>
            {!token && (
              <Nav.Link as={Link} to="/login">
                Вход
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link as={Link} to="/register">
                Регистрация
              </Nav.Link>
            )}
            {token && (
              <Nav.Link as={Link} to="/logout">
                Излизане
              </Nav.Link>
            )}
            <Button
              onClick={handleDashboardClick}
              variant="light"
              className="ms-3 px-3 rounded-pill"
            >
              Вашето табло
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
