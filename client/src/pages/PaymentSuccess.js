import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await refreshUser(); // fetch latest subscription info from backend
      navigate("/dashboard/patient/subscriptions");
    }, 1500); // small delay for webhook to finish

    return () => clearTimeout(timer);
  }, [refreshUser, navigate]);

  return (
    <div className="container text-center mt-5">
      <h1>Успешно плащане!</h1>
      <p>Обновяваме абонамента ти...</p>
    </div>
  );
};

export default PaymentSuccess;
