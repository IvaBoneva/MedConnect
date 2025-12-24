import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currentUser, logIn } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { LoginFormLayout } from "./components/login/LoginFormLayout";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    if (/[а-яА-Я]/.test(email))
      return "Имейл адресът трябва да бъде само на латиница.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Моля, въведете валиден имейл адрес.";
    return "";
  };

  const validatePassword = (password) => {
    if (/[а-яА-Я]/.test(password))
      return "Паролата не може да съдържа кирилица.";
    if (password.length < 8)
      return "Паролата трябва да съдържа поне 8 символа.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setMessage("Моля, коригирайте грешките, преди да продължите.");
      return;
    }

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
    <LoginFormLayout
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errors={errors}
      message={message}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginForm;
