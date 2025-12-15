import { Button } from "react-bootstrap";

export const DashboardButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="light"
      className="ms-3 px-3 rounded-pill"
    >
      <strong>Вашето табло</strong>
    </Button>
  );
};