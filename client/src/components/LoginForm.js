import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    if (/[а-яА-Я]/.test(email))
      return "Имейл адресът трябва да бъде само на латиница.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Моля, въведете валиден имейл адрес.";
    return "";
  };

  const validatePassword = (password) => {
    if (/[а-яА-Я]/.test(password))
      return "Паролата не може да съдържа кирилица.";
    if (password.length < 8)
      return "Паролата трябва да съдържа поне 8 символа.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setMessage("Моля, коригирайте грешките, преди да продължите.");
      return;
    }

    setMessage("");
    alert(`Влезли сте като: ${email}`);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className="p-4 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          border: "1px solid #dcdcdc",
        }}
      >
        <h3 className="text-center mb-3" style={{ color: "#2E8B57" }}>
          Вход
        </h3>

        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имейл адрес</Form.Label>
            <Form.Control
              type="email"
              placeholder="Въведете вашия имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              required
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Парола</Form.Label>
            <Form.Control
              type="password"
              placeholder="Въведете вашата парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              required
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button
            type="submit"
            className="w-100 mt-2"
            variant="success"
            style={{ backgroundColor: "#2E8B57", border: "none" }}
          >
            Вход
          </Button>

          <div className="text-center mt-3">
            <p className="text-muted">
              Все още нямате акаунт?{" "}
              <Link
                to="/register"
                className="text-success fw-semibold text-decoration-none"
              >
                Регистрация
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;
