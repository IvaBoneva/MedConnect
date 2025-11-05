import React from "react";
import { Card } from "react-bootstrap";

const SymptomCheck = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Проверка на симптоми</h3>
      <p>
        Тук пациентът ще може да въведе симптоми и системата ще му предложи
        възможни диагнози или специалист.
      </p>
    </Card>
  );
};

export default SymptomCheck;
