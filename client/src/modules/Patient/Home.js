import React from "react";
import { Image, Card } from "react-bootstrap";
import welcomeImage from "../../images/hello_img.png";

const GoogleCalendar = () => (
  <div
    style={{
      height: "400px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      marginTop: "20px",
      padding: "10px",
      textAlign: "center",
      backgroundColor: "#ffffff",
    }}
  >
    Google Calendar на пациента ще се покаже тук
  </div>
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
      </Card>

      <GoogleCalendar />
    </div>
  );
};

export default Home;
