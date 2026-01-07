import { Col, Card, Badge } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

export const FeatureCard = ({ title, description, isPremium = false }) => {
  const { user, token } = useAuth();
  return (
    <Col xs={12} sm={10} md={4} lg={3} style={{ marginBottom: "40px" }}>
      <Card
        className="p-4 text-left h-100 shadow-sm card-hover"
        style={{
          minHeight: "320px",
          border: isPremium ? "2px solid #d4af37" : "none",
          marginBottom: "40px",
        }}
      >
        {/* PREMIUM BADGE */}
        {isPremium && (
          <Badge
            bg="warning"
            text="dark"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
              marginTop: "-20px",
            }}
          >
            PREMIUM
          </Badge>
        )}
        <h5 style={{ color: "#2E8B57" }}>{title}</h5>
        <p className="text-muted mt-3">{description}</p>
      </Card>
    </Col>
  );
};
