import React from "react";
import { Card } from "react-bootstrap";

const Appointments = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Записване на часове</h3>
      <p>
        Тук ще се търсят и филтрират лекари и ще може да се запише час при
        конкретен специалист.
      </p>
    </Card>
  );
};

export default Appointments;
