import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const AdminSidebar = ({ basePath = "/admin" }) => {
  return (
    <div
      className="mb-3 sidebar"
      style={{
        backgroundColor: "#2e8b57",
        borderRadius: "10px",
        padding: "15px",
        minHeight: "90vh",
      }}
    >
      <h5 className="text-white mb-4">Администратор</h5>

      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/users`} end>
            👥 Потребители
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/doctors`}>
            🩺 Лекари
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/appointments`}>
            📅 Прегледи
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/reviews`}>
            ⭐ Отзиви
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
