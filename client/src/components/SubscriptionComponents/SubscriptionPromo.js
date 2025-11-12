import React from "react";
import { Container } from "react-bootstrap";

const SubscriptionPromo = () => {
  return (
    <div
      style={{
        backgroundColor: "#2E8B57",
        borderRadius: "10px",
        minHeight: "300px",
        width: "100%",
      }}
    >
      <Container className="py-5 text-white text-center">
        <h2 className="mb-3">Започни да се грижиш за здравето си още днес!</h2>
        <p className="mb-4" style={{ fontSize: "1.5 rem" }}>
          Избери своя абонаментен план и се възползвай от всички функции на MedConnect.
        </p>
      </Container>
    </div>
  );
};

export default SubscriptionPromo;
