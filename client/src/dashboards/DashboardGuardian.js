import { Container, Row, Col, Nav } from "react-bootstrap";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Home from "../modules/Guardian/GuardianHome";
import GuardianPersonalInformation from "../modules/Guardian/GuardianPersonalInformation";
import GuardianEditInformation from "../modules/Guardian/GuardianEditInformation";
import Subscriptions from "../modules/Patient/Subscriptions";
import Prescriptions from "../modules/Patient/Prescriptions";
import Appointments from "../modules/Patient/Appointments";
import Storage from "../modules/Patient/Storage";
import PaymentPage from "../modules/Patient/PaymentPage";
import SymptomCheck from "../modules/Patient/SymptomCheck";
import "../App.css";

const DashboardGuardian = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/guardian"
    : "/dashboard/guardian";

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
                Лични данни
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/subscriptions`}>
                Абонамент
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/prescriptions`}>
                Предписания
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/appointments`}>
                Записване на часове
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/storage`}>
                Хранилище
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/symptom_check`}>
                Проверка на симптоми
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main content */}
        <Col xs={12} md={9} lg={10}>
          <Routes>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route
              path="personal_information"
              element={<GuardianPersonalInformation />}
            />
            <Route
              path="personal_information/edit"
              element={<GuardianEditInformation />}
            />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="subscriptions/payment" element={<PaymentPage />} />

            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="storage" element={<Storage />} />
            <Route path="symptom_check" element={<SymptomCheck />} />
            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardGuardian;
