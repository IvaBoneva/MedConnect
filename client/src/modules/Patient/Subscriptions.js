import React from "react";
import { Card } from "react-bootstrap";

const Subscriptions = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Абонамент</h3>
      <p>
        Тук пациентът ще може да избере безплатен или платен план и да плати
        през платежната система.
      </p>
    </Card>
  );
};

export default Subscriptions;
