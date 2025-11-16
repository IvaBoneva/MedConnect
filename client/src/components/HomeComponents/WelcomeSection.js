import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WelcomeSection = ({ title, description, redirectUrl }) => {
  const navigate = useNavigate();

  return (
    <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
      <h1 className="fw-bold" style={{ color: "#2E8B57" }}>
        {title}
      </h1>
      <p className="lead mt-4">{description}</p>
      <Button
        variant="primary"
        className="mt-5 px-4 py-2 rounded-pill"
        onClick={() => navigate(redirectUrl)}
      >
        Да започваме!
      </Button>
    </Col>
  );
};

export default WelcomeSection;
