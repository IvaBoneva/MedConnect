// src/components/ProtectedRoute.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import doctorImage from "../images/access.png";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken"); // може и от Context/Auth state

  if (!isAuthenticated) {
    return (
      <Container className="text-center mt-5 p-5 bg-light rounded shadow-sm">
        <h2 className="text-success mb-3">🔒 Ограничен достъп</h2>
        <p className="text-muted">
          Трябва да влезете в профила си, за да получите достъп до личното си
          табло.
        </p>
        <Button
          variant="success"
          onClick={() => navigate("/login")}
          className="mt-1 mb-5 px-4"
        >
          Вход
        </Button>

        <img
          src={doctorImage}
          alt="Лекар"
          className="img-fluid mt-2"
          style={{ maxHeight: "250px" }}
        />
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
