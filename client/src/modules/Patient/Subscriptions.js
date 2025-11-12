import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import paymentImg from "../../images/payment.png";

import SubscriptionCard from "../../components/SubscriptionComponents/SubscriptionCard.js";
import SubscriptionModal from "../../components/SubscriptionComponents/SubscriptionModal.js";
import SubscriptionPromo from "../../components/SubscriptionComponents/SubscriptionPromo.js";

const Subscriptions = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";
  const navigate = useNavigate();

  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "", action: null });

  const PRICE_IDS = {
    monthly: "price_1SSFR9RTNyC3ef1LQhZ0VACG",
    yearly: "price_1SSFR9RTNyC3ef1L5o89uciw",
  };

  const confirmCancelPremium = () => {
    setSubscriptionStatus("free");
    localStorage.setItem("subscriptionStatus", "free");
    setShowModal(false);
  };

  const handleFreePlanClick = () => {
    if (subscriptionStatus === "free") {
      setModalContent({ title: "Информация", body: "В момента вече сте на безплатния план.", action: null });
    } else if (subscriptionStatus === "premium") {
      setModalContent({
        title: "Потвърждение",
        body: "Имате активен Premium абонамент. Искате ли да го прекратите и да преминете на Free?",
        action: confirmCancelPremium,
      });
    }
    setShowModal(true);
  };

  const handlePremiumPlanClick = (planType) => {
    const planLabel = planType === "yearly" ? "годишен" : "месечен";
    const priceId = PRICE_IDS[planType];

    if (subscriptionStatus === "premium") {
      setModalContent({ title: "Информация", body: "Вече имате активен Premium абонамент.", action: null });
    } else {
      setModalContent({
        title: "Потвърждение",
        body: `Искате ли да преминете към ${planLabel} Premium план и да платите абонамента?`,
        action: async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              alert("Моля, влезте в профила си, за да платите.");
              return;
            }

            const response = await fetch("http://localhost:8080/api/stripe/create-checkout-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ planId: priceId }),
            });

            if (!response.ok) {
              const text = await response.text();
              throw new Error(`HTTP ${response.status}: ${text}`);
            }

            const data = await response.json();
            if (data.checkoutUrl) {
              window.location.href = data.checkoutUrl;
            } else {
              alert("Грешка при създаване на Stripe сесия: " + (data.error || "Непозната грешка"));
            }
          } catch (error) {
            console.error("Payment error:", error);
            alert("Неуспешно създаване на Stripe сесия.");
          }
        },
      });
    }
    setShowModal(true);
  };

  const subscriptionPlans = [
    {
      key: "free",
      title: "🟢 MedConnect Free",
      price: "0 лв / месец",
      description: "Основна функционалност: записване на часове при лекари, напомняния и достъп до личен архив с ограничено място.",
      buttonText: "Избери безплатен план",
      buttonVariant: "outline-success",
      onClick: handleFreePlanClick,
    },
    {
      key: "monthly",
      title: "💎 MedConnect Premium (Месечен)",
      price: "19.99 лв / месец",
      description: "Пълният пакет: неограничено хранилище, ваксинации и профилактични прегледи в календара.",
      buttonText: "Избери месечен план",
      buttonVariant: "success",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      onClick: () => handlePremiumPlanClick("monthly"),
    },
    {
      key: "yearly",
      title: "💎 MedConnect Premium (Годишен)",
      price: "220.00 лв / година",
      description: "Всички Premium функции плюс 1 безплатен месец.",
      buttonText: "Избери годишен план",
      buttonVariant: "success",
      backgroundColor: "#111111",
      textColor: "#ffffff",
      onClick: () => handlePremiumPlanClick("yearly"),
    },
  ];

  return (
    <>
      <Container className="py-5">
        <h3 className="text-success text-center mb-5">Избор на абонаментен план</h3>
        <Row className="justify-content-center g-4">
          {subscriptionPlans.map((plan) => (
            <Col key={plan.key} xs={12} md={6} lg={3} className="d-flex">
              <SubscriptionCard {...plan} className="flex-fill" />
            </Col>
          ))}

          <Col xs={12} lg={3} className="text-center d-none d-lg-block" style={{ marginLeft: "-80px", marginBottom: "-62px" }}>
            <Image src={paymentImg} fluid style={{ maxHeight: "470px", borderRadius: "15px" }} />
          </Col>
        </Row>
      </Container>

      <SubscriptionPromo />

      <SubscriptionModal show={showModal} onHide={() => setShowModal(false)} modalContent={modalContent} />
    </>
  );
};

export default Subscriptions;
