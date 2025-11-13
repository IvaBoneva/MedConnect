import { Button } from "react-bootstrap";

const ShowPasswordButton = ({ showPassword, toggleShowPassword }) => {
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

export default ShowPasswordButton;
