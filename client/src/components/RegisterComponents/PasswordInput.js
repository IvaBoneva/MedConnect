import { Form, Button } from "react-bootstrap";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  passwordErrors = [],
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex">
        <Form.Control
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={`Въведете вашата ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          required
        />
        <Button
          variant="outline-secondary"
          type="button"
          onClick={toggleShowPassword}
          style={{ marginLeft: "5px" }}
        >
          {showPassword ? "Скрий" : "Покажи"}
        </Button>
      </div>

      {/* Password validation messages (optional) */}
      {passwordErrors.length > 0 ? (
        <ul className="text-danger small mt-1">
          {passwordErrors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ) : (
        value && name === "password" && (
          <p className="text-success small mt-1">
            ✅ Паролата отговаря на всички изисквания.
          </p>
        )
      )}
    </Form.Group>
  );
};

export default PasswordInput;