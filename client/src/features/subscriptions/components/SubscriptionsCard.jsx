import React from "react";
import { Card, Button } from "react-bootstrap";

export const SubscriptionCard = ({
  title,
  price,
  description,
  buttonText,
  buttonVariant,
  backgroundColor,
  textColor,
  onClick,
  isActive, 
}) => {
  return (
    <Card
      className={`p-4 shadow-sm h-100 ${isActive ? "border border-success" : "border-0"}`} 
      style={{
        backgroundColor,
        borderRadius: "15px",
        color: textColor,
        width: "100%",
        opacity: isActive ? 0.9 : 1, 
        transition: "transform 0.2s"
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <h4 className="fw-bold mb-3">{title}</h4>
        {isActive && <span className="badge bg-success">✔ Активен</span>}
      </div>

      <h2 className="fw-bold mb-4">{price}</h2>
      <p className="mb-4 flex-grow-1">{description}</p>

      <Button
        variant={isActive ? "secondary" : buttonVariant} 
        className="px-4 rounded-pill w-100 mt-auto"
        onClick={isActive ? null : onClick} 
        disabled={isActive} 
      >
        {isActive ? "Текущ план" : buttonText} 
      </Button>
    </Card>
  );
};