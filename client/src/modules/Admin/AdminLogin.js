import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { currentUser, logIn } from "../../api/userApi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleLogin = async () => {

      const res = await logIn({ email, password });
      if (res && res.token) {
        try {
          const currentUserData = await currentUser();
          setAuthData(res.token, currentUserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setTimeout(() => navigate("/admin"), 1500);
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

