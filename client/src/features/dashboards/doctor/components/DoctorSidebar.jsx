import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const DoctorSidebar = ({ basePath }) => {
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
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/home`} end>
            <i class="bi bi-house me-1"></i>Начало
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/personal_information`}>
            <i class="bi bi-person me-1"></i>Лични данни
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/patients`}>
            <i class="bi bi-people me-1"></i>Пациенти
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/doctor_reviews`}>
            <i class="bi bi-chat me-1"></i>Отзиви
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
