import { Form } from "react-bootstrap";

const LoginInput = ({ label, type, value, onChange, error }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={`Въведете ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        required
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default LoginInput;
