import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";


export default function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>MedConnect – Admin Panel</h1>
        <p>Добре дошъл, администратор.</p>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>1</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>john@example.com</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>PATIENT</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>2</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>mary@example.com</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>DOCTOR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
