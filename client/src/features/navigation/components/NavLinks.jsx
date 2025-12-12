import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavLinks = ({ isAuthenticated }) => {
  return (
    <>
      <Nav.Link as={Link} to="/">
        Начало
      </Nav.Link>
      
      {!isAuthenticated && (
        <Nav.Link as={Link} to="/login">
          Вход
        </Nav.Link>
      )}
      
      {!isAuthenticated && (
        <Nav.Link as={Link} to="/register">
          Регистрация
        </Nav.Link>
      )}
      
      {isAuthenticated && (
        <Nav.Link as={Link} to="/logout">
          Излизане
        </Nav.Link>
      )}
    </>
  );
};