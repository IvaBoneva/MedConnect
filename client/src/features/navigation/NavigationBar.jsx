import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NavigationLayout } from "./components/NavigationLayout";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const getDashboardPath = () => {
    if (!isAuthenticated) return "/login"; 
    
    switch (user?.role) {
      case "patient":
        return "/dashboard/patient/home";
      case "doctor":
        return "/dashboard/doctor/home";
      case "guardian":
        return "/dashboard/guardian/home";
      case "admin":
        return "/dashboard/admin/home";
      default:
        return "/dashboard";
    }
  };

  const handleDashboardClick = () => {
    navigate(getDashboardPath());
  };

  const isPremium = user?.subscription === "premium";

  return (
    <NavigationLayout
      isPremium={isPremium}
      isAuthenticated={isAuthenticated}
      onDashboardClick={handleDashboardClick}
    />
  );
};

export default NavigationBar;