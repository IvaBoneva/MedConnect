import React from "react";
import { Container } from "react-bootstrap";

const SymptomCheck = () => {
  return (
    <>
      <Container className="py-5">
        <h3 className="text-success text-left mb-5">🩺 Проверка на симптоми</h3>{" "}
        <iframe
          title="Symptom Checker"
          src=""
          style={{ border: 0, width: "100%", height: "400px" }}
        />
      </Container>
    </>
  );
};

export default SymptomCheck;
