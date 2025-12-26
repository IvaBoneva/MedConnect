import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const AdminSidebar = ({ basePath = "/admin" }) => {
  return (
    <div
      className="mb-3 sidebar"
      style={{
        backgroundColor: "#2e8b57",
        borderRadius: "10px",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/users`} end>
            <i className="bi bi-people me-1"></i>Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/doctors`}>
            <i className="bi bi-person-badge me-1"></i>Doctors
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/appointments`}>
            <i className="bi bi-calendar-check me-1"></i>Appointments
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/reviews`}>
            <i className="bi bi-chat-left-text me-1"></i>Reviews
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
