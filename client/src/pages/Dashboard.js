// src/pages/Dashboard.js
import { Navigate } from "react-router-dom";
import DashboardPatient from "../dashboards/DashboardPatient";
import DashboardDoctor from "../dashboards/DashboardDoctor";
import DashboardGuardian from "../dashboards/DashboardGuardian";
import DashboardAdmin from "../dashboards/DashboardAdmin";

const Dashboard = () => {
  const role = localStorage.getItem("role"); // "patient", "doctor", "guardian", "admin"

  switch (role) {
    case "patient":
      return <DashboardPatient />;
    case "doctor":
      return <DashboardDoctor />;
    case "guardian":
      return <DashboardGuardian />;
    case "admin":
      return <DashboardAdmin />;
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboard;
