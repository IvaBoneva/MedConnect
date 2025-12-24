import React from "react";
import { Container } from "react-bootstrap";

export const SubscriptionPromo = () => {
  return (
    <div
      style={{
        backgroundColor: "#1b9951ff",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: "10px",
        marginLeft: "0.01rem",
        marginRight: "0.5rem",
        marginBottom: "-1.5rem",
        marginTop: "30px",
      }}
    >
      <Container className="py-5 text-white text-center">
        <h2 className="mb-3">Започни да се грижиш за здравето си още днес!</h2>
        <p className="mb-4" style={{ fontSize: "1.5rem" }}>
          Избери своя абонаментен план и се възползвай от всички функции на
          MedConnect+.
        </p>
      </Container>
    </div>
  );
};
