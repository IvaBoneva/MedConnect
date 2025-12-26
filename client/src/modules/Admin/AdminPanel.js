import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ padding: "20px", flex: 1 }}>
        <h1>MedConnect – Admin Panel</h1>
        <p>Добре дошъл, администратор.</p>
        <Outlet />
      </div>
    </div>
  );
}
