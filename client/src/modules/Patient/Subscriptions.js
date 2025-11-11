import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Image,
  Container,
  Modal,
} from "react-bootstrap";
import paymentImg from "../../images/payment.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Subscriptions = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";
  const navigate = useNavigate();

  // Симулираме текущия абонамент
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    // Винаги започваме с Premium за теста
    return "premium"; // игнорирай localStorage за сега
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    body: "",
    action: null,
  });

  const handleFreePlanClick = () => {
    if (subscriptionStatus === "free") {
      // Ако сме вече Free
      setModalContent({
        title: "Информация",
        body: "В момента вече сте на безплатния план.",
        action: null,
      });
    } else if (subscriptionStatus === "premium") {
      // Ако сме Premium
      setModalContent({
        title: "Потвърждение",
        body: "Имате активен Premium абонамент. Искате ли да го прекратите и да преминете на Free?",
        action: confirmCancelPremium,
      });
    }
    setShowModal(true);
  };

  const handlePremiumPlanClick = () => {
    if (subscriptionStatus === "premium") {
      // Вече сме Premium
      setModalContent({
        title: "Информация",
        body: "Вече имате активен Premium абонамент.",
        action: null,
      });
    } else {
      // Пренасочване към плащане
      setModalContent({
        title: "Потвърждение",
        body: "Искате ли да преминете към Premium план и да платите абонамента?",
        action: () => navigate(`${basePath}/subscriptions/payment`),
      });
    }
    setShowModal(true);
  };

  const confirmCancelPremium = () => {
    // Прекратяване на Premium (симулирано)
    setSubscriptionStatus("free");
    localStorage.setItem("subscriptionStatus", "free");
    setShowModal(false);
  };

  return (
    <>
      <Container className="py-5">
        <h3 className="text-success text-left mb-5">
          Избор на абонаментен план
        </h3>

        <Row className="justify-content-center align-items-start g-4">
          {/* Free Plan */}
          <Col xs={12} md={6} lg={4}>
            <Card
              className="p-4 shadow-sm border-0"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                color: "#2E8B57",
                width: "100%",
              }}
            >
              <h4 className="fw-bold mb-3">🟢 MedConnect Free</h4>
              <h2 className="fw-bold mb-4" style={{ color: "#2E8B57" }}>
                0 лв / месец
              </h2>
              <p className="text-muted mb-4">
                Идеален за потребители, които искат основна функционалност:
                записване на часове при лекари, напомняния за посещения и достъп
                до личен архив с ограничено пространство за документи.
              </p>
              <Button
                variant="outline-success"
                className="px-4 rounded-pill w-100"
                onClick={handleFreePlanClick}
              >
                Избери безплатен план
              </Button>
            </Card>
          </Col>

          {/* Premium Plan */}
          <Col xs={12} md={6} lg={4}>
            <Card
              className="p-4 shadow-sm border-0"
              style={{
                backgroundColor: "#000000",
                borderRadius: "15px",
                color: "#ffffff",
                width: "100%",
              }}
            >
              <h4 className="fw-bold mb-3" style={{ color: "#2E8B57" }}>
                💎 MedConnect Premium
              </h4>
              <h2 className="fw-bold mb-4" style={{ color: "#7CFC00" }}>
                19.99 лв / месец
              </h2>
              <p className="text-light mb-4">
                Пълният пакет: всички функционалности от безплатната версия плюс
                неограничено пространство в хранилището и включени в календара
                предстоящи ваксини и профилактични прегледи.
              </p>
              <Button
                variant="success"
                className="px-4 rounded-pill w-100"
                onClick={handlePremiumPlanClick}
              >
                Избери Premium план
              </Button>
            </Card>
          </Col>

          {/* Изображение (само на lg+) */}
          <Col
            xs={12}
            lg={4}
            className="text-center d-none d-lg-block"
            style={{ marginLeft: "-80px", marginBottom: "-62px" }}
          >
            <Image
              src={paymentImg}
              fluid
              style={{
                maxHeight: "470px",
                borderRadius: "15px",
              }}
            />
          </Col>
        </Row>
      </Container>

      {/* Зелената секция под всичко */}
      <div
        style={{
          backgroundColor: "#2E8B57",
          borderRadius: "15px",
          minHeight: "300px",
          width: "100%",
        }}
      >
        <Container className="py-5 text-white">
          <h2 className="mb-3">
            Започни да се грижиш за здравето си още днес!
          </h2>
          <p className="mb-4" style={{ fontSize: "1.2rem" }}>
            Избери своя абонаментен план и се възползвай от всички функции на
            MedConnect.
          </p>
        </Container>
      </div>

      {/* Модален прозорец */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отказ
          </Button>
          {modalContent.action && (
            <Button variants="success" onClick={modalContent.action}>
              Потвърди
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Subscriptions;
