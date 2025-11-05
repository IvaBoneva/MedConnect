import React from "react";
import { Card } from "react-bootstrap";

const Storage = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Хранилище</h3>
      <p>
        Тук пациентът ще може да качва, разглежда и сваля своите медицински
        документи.
      </p>
    </Card>
  );
};

export default Storage;
