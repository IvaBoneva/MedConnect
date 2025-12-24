import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth(); // вземаме и текущия потребител

  useEffect(() => {
    const timer = setTimeout(async () => {
      await refreshUser();

      // Пренасочване според role
      if (user?.role === "guardian") {
        navigate("/dashboard/guardian/subscriptions");
      } else if (user?.role === "patient") {
        // patient
        navigate("/dashboard/patient/subscriptions");
      } else {
        navigate("/error");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [refreshUser, navigate, user]);

  if (!user || (user.role !== "guardian" && user.role !== "patient"))
    return null;

  return (
    <div className="container text-center mt-5">
      <h1>Успешно плащане!</h1>
      <p>Обновяваме абонамента ти...</p>
    </div>
  );
};

export default PaymentSuccess;
