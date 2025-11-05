import React from "react";
import { Card } from "react-bootstrap";

const Prescriptions = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Предписания</h3>
      <p>
        Тук пациентът ще може да въвежда лекарствата си и графика на приема им.
      </p>
    </Card>
  );
};

export default Prescriptions;
