import { Container, Row, Col, Nav } from "react-bootstrap";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


import Home from "../modules/Patient/Home";
import PersonalInformation from "../modules/Patient/PersonalInformation";
import EditPersonalInformation from "../modules/Patient/EditPersonalInformation";
import Subscriptions from "../modules/Patient/Subscriptions";
import Prescriptions from "../modules/Patient/Prescriptions";
import Appointments from "../modules/Patient/Appointments";
import Storage from "../modules/Patient/Storage";
import PaymentPage from "../modules/Patient/PaymentPage";
import SymptomCheck from "../modules/Patient/SymptomCheck";
import PharmacyMap from "../modules/Patient/Pharmacies";
import "../App.css";
import VaccinesAndProfilactics from "../modules/Patient/VaccinesAndProfilactics";
import { useAuth } from "../context/AuthContext";
import { DoctorNewPersonalDetails } from "../components/DoctorComponents/DoctorPersonalDetailsComponents/DoctorNewPersonalDetails";

const DashboardPatient = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const { user } = useAuth();

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
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/vaccines_profilactics`}>
                Имунизации и профилактика
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to={`${basePath}/pharmacies_hospitals`}>
                Болници и аптеки наоколо
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
              element={<PersonalInformation />}
            />
            <Route
              path="personal_information/edit"
              element={<EditPersonalInformation />}
            />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="subscriptions/payment" element={<PaymentPage />} />

            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="appointments" element={<Appointments />} />
            {/* НОВО: детайли на доктор */}
            <Route
              path="appointments/doctor/:slug"
              element={<DoctorNewPersonalDetails />}
            />
            <Route path="storage" element={<Storage userId={user?.id} />} />
            <Route path="symptom_check" element={<SymptomCheck />} />
            <Route
              path="vaccines_profilactics"
              element={
                <VaccinesAndProfilactics
                  isPremium={true} // за development
                  patientAge={user?.age}
                  userId={user?.id}
                />
              }
            />
            <Route path="pharmacies_hospitals" element={<PharmacyMap />} />
            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPatient;
