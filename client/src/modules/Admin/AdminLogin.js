import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Card, Form, Button } from "react-bootstrap";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleLogin = () => {
    if (email === "admin@medconnect.bg" && password === "admin123") {
      setAuthData("dummyAdminToken", { email, role: "admin" });
      navigate("/admin");
    } else {
      alert("Невалидни администраторски данни");
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
        <h3 className="text-center mb-4" style={{ color: "#2E8B57" }}>
          Вход за администратор
        </h3>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Имейл адрес</Form.Label>
            <Form.Control
              type="email"
              placeholder="Въведи имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Парола</Form.Label>
            <Form.Control
              type="password"
              placeholder="Въведи парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100"
            style={{ borderRadius: "10px" }}
          >
            Вход
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
