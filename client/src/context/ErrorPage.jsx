import { useRouteError, Link } from "react-router-dom";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import errorImage from "../images/error.png";
import "../App.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100); 
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container
      fluid
      className={`d-flex justify-content-center align-items-center fade-in-container ${
        visible ? "visible" : ""
      }`}
      style={{ minHeight: "100vh", padding: "0 20px" }}
    >
      <Row className="align-items-center">
        <Col md="auto" className="text-center mb-4 mb-md-0">
          <Image
            src={errorImage}
            fluid
            alt="Аватар на приложението"
            style={{
              width: "400px",
              height: "600px",
              padding: "5px",
            }}
          />
        </Col>

        <Col md="auto" className="text-center text-md-start">
          <h1 style={{ fontSize: "5rem" }}>🩺 404</h1>
          <h2>Тази страница е в карантина!</h2>
          <p className="text-muted" style={{ fontSize: "1.2rem" }}>
            {error?.status === 404
              ? "Страницата, която търсиш, вероятно се намира в изолация."
              : "Опа! Нещо се обърка в системата. Не се притеснявай, медиците са на ход!"}
          </p>

          <Button
            as={Link}
            to="/"
            variant="success"
            size="lg"
            style={{ marginTop: "1.5rem" }}
          >
            ⬅ Върни се към началото
          </Button>

          <p className="mt-4 text-muted" style={{ fontStyle: "italic" }}>
            💊 Лекарството срещу изгубени страници все още се разработва...
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
