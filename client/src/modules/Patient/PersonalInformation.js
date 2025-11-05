import React from "react";
import { Card } from "react-bootstrap";

const PersonalInformation = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-success mb-3">Лични данни</h3>
      <p>
        Тук ще се показва информацията за пациента – име, имейл, алергии,
        хронични заболявания и снимка.
      </p>
    </Card>
  );
};

export default PersonalInformation;
