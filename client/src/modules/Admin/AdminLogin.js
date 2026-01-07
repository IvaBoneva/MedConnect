import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { currentUser, logIn } from "../../api/userApi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthData } = useAuth();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
        e.preventDefault();
        
    
        setMessage("");
        setLoading(true);
    
        try {
          const res = await logIn({ email, password });
          if (res && res.token) {
            try {
              const currentUserData = await currentUser();
              setAuthData(res.token, currentUserData);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
            setTimeout(() => navigate("/"), 1500);
          }
        } catch (error) {
          console.error("Login error:", error);
    
          if (error.status) {
            if (error.status === 409) {
              setMessage(error.body?.message || "Потребителят не е регистриран.");
            } else if (error.status === 401) {
              setMessage("Грешен имейл или парола.");
            } else {
              setMessage("Възникна грешка при вход. Моля, опитайте отново.");
            }
          } else {
            setMessage("Няма връзка със сървъра.");
          }
        } finally {
          setLoading(false);
        }
  
    
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Вход за администратор</h2>

      <form onSubmit={handleLogin}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

