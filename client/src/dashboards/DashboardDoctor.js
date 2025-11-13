import { Container, Row, Col, Nav } from "react-bootstrap";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import DoctorHome from "../modules/Doctor/DoctorHome";
import DoctorPersonalInformation from "../modules/Doctor/DoctorPersonalInformation";
import DoctorPatients from "../modules/Doctor/DoctorPatients";
import DoctorReviews from "../modules/Doctor/DoctorReviews";

const DashboardDoctor = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/Doctor"
    : "/dashboard/Doctor";

  return (
    <Container fluid className="mt-3">
      <Row>
        {/* Sidebar */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="mb-3 sidebar"
          style={{
            backgroundColor: "#2e8b57",
            borderRadius: "10px",
            padding: "15px",
            minHeight: "90vh",
          }}
        >
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/home`} end>
                🏠 Начало
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/personal_information`}>
                Лична информация
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/patients`}>
                Пациенти
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/doctor_reviews`}>
                Отзиви
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main content */}
        <Col xs={12} md={9} lg={10}>
          <Routes>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<DoctorHome />} />
            <Route
              path="personal_information"
              element={<DoctorPersonalInformation />}
            />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="doctor_reviews" element={<DoctorReviews />} />
            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardDoctor;
