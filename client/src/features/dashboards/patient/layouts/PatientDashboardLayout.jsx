import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { PatientSidebar } from "../components/PatientSidebar"; 

export const PatientDashboardLayout = ({ basePath, children }) => {
  return (
    <Container fluid className="p-0">
      
      <Row className="g-0">
        
        <Col xs={12} md={3} lg={2} style={{ minHeight: 'calc(100vh - 61px)' }}> 
          <PatientSidebar basePath={basePath} />
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};