import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SubscriptionPageLayout } from "./components/SubscriptionsPageLayout.jsx";
import paymentImg from "../../images/payment.png";

const SubscriptionPage = () => {
  const location = useLocation();

  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [modalState, setModalState] = useState({
    show: false,
    content: { title: "", body: "", action: null },
  });

  const PRICE_IDS = {
    monthly: "price_1SSFR9RTNyC3ef1LQhZ0VACG",
    yearly: "price_1SSFR9RTNyC3ef1L5o89uciw",
  };

  useEffect(() => {
    const fetchUserSubscription = async () => {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");

      if (!email || !token) {
        console.warn("Липсва имейл или токен. Спиране на заявката.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/patient/subscription?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data.subscriptionStatus.toLowerCase());
          setSubscriptionType(data.subscriptionType?.toLowerCase() || null);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };

    fetchUserSubscription();
  }, [location]);

  const confirmCancelPremium = () => {
    setSubscriptionStatus("free");
    setSubscriptionType(null);
    localStorage.setItem("subscriptionStatus", "free");
    localStorage.removeItem("subscriptionType");
    setModalState({ ...modalState, show: false });
  };

  const handleFreePlanClick = () => {
    if (subscriptionStatus === "free") {
      setModalState({
        show: true,
        content: {
          title: "Информация",
          body: "В момента вече сте на безплатния план.",
          action: null,
        },
      });
    } else {
      setModalState({
        show: true,
        content: {
          title: "Потвърждение",
          body: "Имате активен Premium абонамент. Искате ли да го прекратите и да преминете на Free?",
          action: confirmCancelPremium,
        },
      });
    }
  };

  const handlePremiumPlanClick = (planType) => {
    const planLabel = planType === "yearly" ? "годишен" : "месечен";
    const priceId = PRICE_IDS[planType];
    const loggedInUserEmail = localStorage.getItem("userEmail");

    if (subscriptionType === planType) {
      setModalState({
        show: true,
        content: {
          title: "Информация",
          body: `Вече имате активен ${planLabel} Premium абонамент.`,
          action: null,
        },
      });
    } else {
      setModalState({
        show: true,
        content: {
          title: "Потвърждение",
          body: `Искате ли да преминете към ${planLabel} Premium план и да платите абонамента?`,
          action: async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                alert("Моля, влезте в профила си, за да платите.");
                return;
              }

              const response = await fetch(
                "http://localhost:8080/api/stripe/create-checkout-session",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    planId: priceId,
                    userEmail: loggedInUserEmail,
                  }),
                }
              );

              if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
              }

              const data = await response.json();
              if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
              } else {
                alert(
                  "Грешка при създаване на Stripe сесия: " +
                    (data.error || "Непозната грешка")
                );
              }
            } catch (error) {
              console.error("Payment error:", error);
              alert("Неуспешно създаване на Stripe сесия.");
            }
          },
        },
      });
    }
  };

  const subscriptionPlans = [
    {
      key: "free",
      title: "MedConnect+",
      price: "0 лв / месец",
      description:
        "Основна функционалност: записване на часове при лекари, следене на график с лекарства и достъп до личен архив с ограничено място.",
      buttonText: "Избери безплатен план",
      buttonVariant: "outline-success",
      isActive: subscriptionStatus === "free",
      onClick: handleFreePlanClick,
    },
    {
      key: "monthly",
      title: "MedConnect+ Premium",
      price: "19.99 лв / месец",
      description:
        "Пълният пакет: неограничено хранилище, списъци с ваксини и профилактични прегледи, проверка на симптоми, СМС съобщения",
      buttonText: "Избери месечен план",
      buttonVariant: "success",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      isActive:
        subscriptionStatus === "premium" && subscriptionType === "monthly",
      onClick: () => handlePremiumPlanClick("monthly"),
    },
    {
      key: "yearly",
      title: "MedConnect+ Premium",
      price: "220.00 лв / година",
      description: "Всички Premium функции плюс 1 безплатен месец.",
      buttonText: "Избери годишен план",
      buttonVariant: "success",
      backgroundColor: "#111111",
      textColor: "#ffffff",
      isActive:
        subscriptionStatus === "premium" && subscriptionType === "yearly",
      onClick: () => handlePremiumPlanClick("yearly"),
    },
  ];

  const closeModal = () => setModalState({ ...modalState, show: false });

  return (
    <SubscriptionPageLayout
      plans={subscriptionPlans}
      paymentImage={paymentImg}
      modalState={modalState}
      closeModal={closeModal}
    />
  );
};

export default SubscriptionPage;
