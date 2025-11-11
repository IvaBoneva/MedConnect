import React from "react";
import { Image, Card } from "react-bootstrap";
import welcomeImage from "../../images/hello_img.png";
import { motion } from "framer-motion";

const GoogleCalendar = () => (
  <iframe
    title="Google Calendar"
    src="https://calendar.google.com/calendar/embed?src=bg.bulgarian%23holiday%40group.v.calendar.google.com"
    style={{ border: 0, width: "100%", height: "400px" }}
  />
);

const Home = () => {
  const userName = localStorage.getItem("userName") || "Пациент";

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
          Здравей, {userName}!
        </h1>
        </motion.div>
      </Card>

      <GoogleCalendar />
    </div>
  );
};

export default Home;
