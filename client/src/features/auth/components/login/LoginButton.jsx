import { Button } from "react-bootstrap";

export const LoginButton = ({ loading = false, text = "Вход" }) => {
  return (
    <Button
      type="submit"
      className="w-100 mt-2"
      variant="success"
      style={{ backgroundColor: "#2E8B57", border: "none" }}
      disabled={loading}
    >
      {text}
    </Button>
  );
};
