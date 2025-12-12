import { Container, Card, Alert, Form } from "react-bootstrap";
import { LoginInput } from "./LoginInput";
import { LoginButton } from "./LoginButton";
import { RegisterRedirect } from "./RegisterRedirect";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoginFormLayout = ({
  email,
  setEmail,
  password,
  setPassword,
  errors,
  message,
  loading,
  onSubmit,
}) => {
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

        <Form onSubmit={onSubmit}>
          <LoginInput
            label={"Имейл адрес"}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <LoginInput
            label={"Парола"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <LoginButton loading={loading} text={"Вход"} />

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