import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import welcomeImage from "../../images/hello_img.png";
import { useAuth } from "../../context/AuthContext";
import GoogleCalendarComponent from "../../dashboards/GoogleCalendar/GoogleCalendarComponent";
import { googleAuthorize, listEvents } from "../../api/googleApi";
import { getAllWorkDays } from "../../api/doctorApi";
import { useState } from "react";


// TEST CALENDAR
// const GoogleCalendar = () => (
//   <iframe
//     title="Google Calendar"
//     src="https://calendar.google.com/calendar/embed?src=bg.bulgarian%23holiday%40group.v.calendar.google.com"
//     style={{ border: 0, width: "100%", height: "400px" }}
//   />
// );

const DoctorHome = () => {
  const { user, isReady } = useAuth();
  // Ако auth още не е готов → чакаме
  if (!isReady) {
    return <Container className="mt-4">Зареждане...</Container>;
  }

  // Ако няма потребител → грешка
  if (!user) {
    return <Container className="mt-4">Не е намерен потребител.</Container>;
  }

  const userName = user.firstName + " " + user.lastName;
  const reviewData = [
    { week: "Седмица 1", rating: 4.5 },
    { week: "Седмица 2", rating: 4.7 },
    { week: "Седмица 3", rating: 4.8 },
    { week: "Седмица 4", rating: 4.6 },
  ];

  return (
    <Container fluid className="p-4">
      {/* Welcome Section */}
      <Card className="d-flex flex-row align-items-center p-4 mb-4 shadow-sm">
        <Image
          src={welcomeImage}
          style={{ width: "120px", height: "160px", marginRight: "20px" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1
            className="fw-semibold mb-1"
            style={{
              color: "#2e7d32",
              fontSize: "30px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Здравейте, Д-р {userName}! 👋
          </h1>
          <p className="text-muted">Ето какво се случва с вашият бизнес.</p>
        </motion.div>
      </Card>

      {/* <GoogleCalendar /> */}

      <Button onClick={googleAuthorize}>
        press for google authorize /google
      </Button>

      {/* <Button onClick={async () => {
        await getAllWorkDays(setWorkingDays)
      }}>
        press to fetch data for current doctor
      </Button> */}

      <GoogleCalendarComponent/>

      {/* Summary Cards */}
      <Row className="g-4 mt-2 mb-4">
        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Subtitle className="text-muted mb-1">
                  Всички часове
                </Card.Subtitle>
                <Card.Title className="fs-3 fw-bold">124</Card.Title>
              </div>
              <div style={{ fontSize: "1.8rem" }}>📅</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Subtitle className="text-muted mb-1">
                  Изпълнени
                </Card.Subtitle>
                <Card.Title className="fs-3 fw-bold text-success">
                  98
                </Card.Title>
              </div>
              <div style={{ fontSize: "1.8rem" }}>✅</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Subtitle className="text-muted mb-1">
                  Отказани
                </Card.Subtitle>
                <Card.Title className="fs-3 fw-bold text-danger">26</Card.Title>
              </div>
              <div style={{ fontSize: "1.8rem" }}>❌</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews Chart */}
      <Card className="shadow-sm">
        <Card.Header className="d-flex align-items-center">
          <span style={{ fontSize: "1.3rem", marginRight: "0.5rem" }}>⭐</span>
          <strong>Месечни ревюта</strong>
        </Card.Header>
        <Card.Body style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reviewData}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#ffc107" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorHome;
