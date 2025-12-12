import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DoctorSidebar } from "../components/DoctorSidebar";

export const DoctorDashboardLayout = ({ basePath, children }) => {
  return (
    <Container fluid className="mt-3">
      <Row>
        <Col xs={12} md={3} lg={2}>
          <DoctorSidebar basePath={basePath} />
        </Col>
        <Col xs={12} md={9} lg={10}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};