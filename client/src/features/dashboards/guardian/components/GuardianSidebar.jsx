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
            <i class="bi bi-house me-1"></i>Начало
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/personal_information`}>
            <i class="bi bi-person me-1"></i>Лични данни
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/subscriptions`}>
            <i class="bi bi-star me-1"></i>Абонамент
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/prescriptions`}>
            <i class="bi bi-prescription2 me-1"></i>Предписания
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/appointments`}>
            <i class="bi bi-calendar me-1"></i>Записване на часове
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/storage`}>
            <i class="bi bi-file-medical me-1"></i>Хранилище
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/symptom_check`}>
            <i class="bi bi-search me-1"></i>Проверка на симптоми
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/vaccines_profilactics`}>
            <i class="bi bi-shield-plus me-1"></i>Имунизации и профилактика
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`${basePath}/pharmacies_hospitals`}>
            <i class="bi bi-geo-alt me-1"></i>Болници и аптеки наоколо
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
