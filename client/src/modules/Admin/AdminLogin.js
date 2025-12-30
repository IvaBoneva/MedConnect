import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleLogin = () => {
    if (email === "admin@medconnect.bg" && password === "admin123") {
      setAuthData("dummyAdminToken", { email, role: "admin" });
      navigate("/admin");
    } else {
      alert("Невалидни администраторски данни");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Вход за администратор</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

