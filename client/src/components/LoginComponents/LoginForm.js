import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../api/userApi";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import RegisterRedirect from "./RegisterRedirect";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../../context/AuthContext";


const LoginForm = () => {
  const navigate = useNavigate();
    const { setToken } = useAuth(); // 👈 get the setToken from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setMessage("Моля, коригирайте грешките, преди да продължите.");
      return;
    }

    setMessage("");
    setLoading(true);

    // В момента можем да симулираме успешен вход
    setMessage("Вход успешен! Пренасочване към Вашето табло...");

    try {
      const res = await logIn({ email, password });
        console.log(res);
        
      if (res && res.token) {
        setToken(res.token);
        setMessage("Вход успешен! Пренасочване към таблото...");
        setTimeout(() => {
          navigate("/"); 
        }, 1500);
      } else {
        setMessage("Грешен имейл или парола.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Възникна грешка при входа. Опитайте отново.");
    } finally {
      setLoading(false);
    }
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

        {message && (
          <Alert variant="info" className="d-flex align-items-center">
            {loading && <LoadingSpinner />}
            <span>{message}</span>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Email input */}
          <LoginInput
            label={"Имейл адрес"}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          {/* Password Input */}
          <LoginInput
            label={"Парола"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          {/* Login button */}
          <LoginButton loading={loading} text={"Вход"} />

          {/* Redirect if not created acc */}
          <RegisterRedirect
            textBefore="Все още нямате акаунт?"
            linkText="Регистрация"
            to="/register"
          />
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;
