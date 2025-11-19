import { Image, Card } from "react-bootstrap";
import welcomeImage from "../../images/hello_img.png";
import { motion } from "framer-motion";
import GoogleCalendarComponent from "../../dashboards/GoogleCalendar/GoogleCalendarComponent";



const Home = () => {
  const userName = localStorage.getItem("userName") || "Име";

  return (

    <div>
      <Card
        className="d-flex flex-row align-items-center p-4 mb-4 shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "15px",
        }}
      >
        <Image
          src={welcomeImage}
          style={{ width: "120px", height: "160px", marginRight: "20px" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            style={{
              color: "#2e7d32",
              fontSize: "30px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Здравейте, {userName}! 👋
          </h1>
          <p className="text-muted">Ето какво се случва с вашето здраве.</p>
        </motion.div>
      </Card>

      <GoogleCalendarComponent/>
    </div>
  );
};

export default Home;
