import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { GuardianSidebar } from "../components/GuardianSidebar";

export const GuardianDashboardLayout = ({ basePath, children }) => {
  return (
    <Container fluid className="mt-3">
      <Row>
        <Col xs={12} md={3} lg={2}>
          <GuardianSidebar basePath={basePath} />
        </Col>
        <Col xs={12} md={9} lg={10}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};
