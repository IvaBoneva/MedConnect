// This component is a card that sums up all the features placed on home page
import { Col, Card } from "react-bootstrap";

const FeatureCard = ({title, description}) => {
  return (
    <Col xs={12} sm={10} md={4} lg={3}>
      <Card
        className="p-4 text-left h-100 shadow-sm card-hover"
        style={{ minHeight: "320px" }}
      >
        <h5 style={{ color: "#2E8B57" }}>{title}</h5>
        <p className="text-muted mt-3">
          {description}
        </p>
      </Card>
    </Col>
  );
};

export default FeatureCard;
