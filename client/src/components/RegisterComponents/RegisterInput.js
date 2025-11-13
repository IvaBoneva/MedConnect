import { Form } from "react-bootstrap";

const RegisterInput = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = true,
  error = "",
  min,
  max,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
      {error && <p className="text-danger small mt-1">{error}</p>}
    </Form.Group>
  );
};

export default RegisterInput;
