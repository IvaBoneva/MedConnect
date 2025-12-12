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
            🏠 Начало
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/personal_information`}>
            👤Лични данни
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/patients`}>
            Пациенти
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/doctor_reviews`}>
            Отзиви
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};