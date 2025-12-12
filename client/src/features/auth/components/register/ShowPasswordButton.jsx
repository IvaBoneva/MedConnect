import { Button } from "react-bootstrap";

export const ShowPasswordButton = ({ showPassword, toggleShowPassword }) => {
  return (
    <Button
      variant="outline-secondary"
      type="button"
      onClick={toggleShowPassword}
      style={{ marginLeft: "5px" }}
    >
      {showPassword ? "Скрий" : "Покажи"}
    </Button>
  );
};