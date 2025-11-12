import React from "react";
import { Card, Button } from "react-bootstrap";

const SubscriptionCard = ({
  title,
  price,
  description,
  buttonText,
  buttonVariant,
  backgroundColor,
  textColor,
  onClick,
}) => {
  return (
    <Card
      className="p-4 shadow-sm border-0"
      style={{ backgroundColor, borderRadius: "15px", color: textColor, width: "100%" }}
    >
      <h4 className="fw-bold mb-3">{title}</h4>
      <h2 className="fw-bold mb-4">{price}</h2>
      <p className="mb-4">{description}</p>
      <Button variant={buttonVariant} className="px-4 rounded-pill w-100" onClick={onClick}>
        {buttonText}
      </Button>
    </Card>
  );
};

export default SubscriptionCard;
