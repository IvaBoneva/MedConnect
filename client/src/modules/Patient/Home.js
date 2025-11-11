import React from "react";
import { Image, Card } from "react-bootstrap";
import welcomeImage from "../../images/hello_img.png";

const GoogleCalendar = () => (
  <iframe
    title="Google Calendar"
    src="https://calendar.google.com/calendar/embed?src=bg.bulgarian%23holiday%40group.v.calendar.google.com"
    style={{ border: 0, width: "100%", height: "400px" }}
  />
);

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
        <h1
          style={{
            color: "#2e7d32",
            fontSize: "30px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Здравейте, {userName}!
        </h1>
      </Card>

      <GoogleCalendar />
    </div>
  );
};

export default Home;
