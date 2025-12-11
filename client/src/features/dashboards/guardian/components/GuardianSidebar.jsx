import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const GuardianSidebar = ({ basePath }) => {
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
            Лични данни
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/subscriptions`}>
            Абонамент
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/prescriptions`}>
            Предписания
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/appointments`}>
            Записване на часове
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/storage`}>
            Хранилище
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/symptom_check`}>
            Проверка на симптоми
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/vaccines_profilactics`}>
            Имунизации и профилактика
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/pharmacies_hospitals`}>
            Болници и аптеки наоколо
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};