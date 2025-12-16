import { useState, useEffect } from "react"; // Ако се ползва
import { Container, Row, Col, Card, Image } from "react-bootstrap";
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

// Импорт на календара от новата му локация
import GoogleCalendarComponent from "./calendar/DoctorCalendarComponent";
import DoctorCalendarComponent from "./calendar/DoctorCalendarComponent";
import { fetchAppointmentStatistics } from "../../api/appointmentApi";

const DoctorHome = () => {
  const { user, isReady, token } = useAuth();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const refreshStats = async () => 
  {
    try{
      const loadStatistics = await fetchAppointmentStatistics(user.id, token);
      setStats(loadStatistics);
    }
    catch(error){
      console.error("Failed to load appointment statistics:", error);
    }
  }

  useEffect(() => {
    if (!user?.id || !token) return;

    async function loadStatistics() {
      try {
        const data = await fetchAppointmentStatistics(user.id, token);
        setStats(data);
        setLoadingStats(false);
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    }

    loadStatistics(); 

    const handleForceUpdate = () => loadStatistics();
    
    window.addEventListener("force-stats-update", handleForceUpdate);

    return () => {
      window.removeEventListener("force-stats-update", handleForceUpdate);
    };

  }, [user?.id, token]);
  

  if (!isReady) {
    return <Container className="mt-4">Зареждане...</Container>;
  }

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

      {/* Календарът */}
      {/* I Separated Calendar into google and doctor one */}
      <DoctorCalendarComponent onAppointmentUpdate = {refreshStats} />
       {/* <GoogleCalendarComponent />  */}

      {/* Summary Cards */}
      <Row className="g-4 mt-2 mb-4 justify-content-center">
        <Col xs={12} md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Subtitle className="text-muted mb-1">
                  Всички часове
                </Card.Subtitle>
                <Card.Title className="fs-3 fw-bold">{loadingStats ? "..." : stats.totalAppointments}</Card.Title>
              </div>
              <div style={{ fontSize: "1.8rem" }}>📅</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Subtitle className="text-muted mb-1">
                  Изпълнени
                </Card.Subtitle>
                <Card.Title className="fs-3 fw-bold text-success">
                  {loadingStats ? "..." : stats.completedAppointments}
                </Card.Title>
              </div>
              <div style={{ fontSize: "1.8rem" }}>✅</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorHome;