import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="navbar-dark shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MedConnect+
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Начало
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Вход
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Регистрация
            </Nav.Link>
            <Button
              as={Link}
              to="/dashboard"
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
