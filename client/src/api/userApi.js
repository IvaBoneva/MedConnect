const API_BASE = "http://localhost:8080/api/user";
const RESTRICTED_API = "http://localhost:8080/api/blog/restricted";
const UNRESTRICTED_API = "http://localhost:8080/api/blog/unrestricted";

// Примерни данни за тест
export const TEST_REGISTER_JSON = {
  email: "new_user@example.com",
  password: "mypassword123",
  name: "New User",
  age: 28,
  phoneNumber: "5551234567",
  role: {
    role: "Patient",
  },
};

export const TEST_LOGIN_JSON = {
  email: "murtveca@example.com",
  password: "gooner",
};

// Функция за логин
export const logIn = async () => {
  const params = {
    username: "test_user_new",
    password: "test123A!",
  };

  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };

  try {
    const res = await fetch(`${API_BASE}/login`, options);
    if (!res.ok) {
      throw new Error("Login failed");
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Функция за регистрация
export const register = async (formData) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    mode: "cors",
  };

  try {
    const res = await fetch(`${API_BASE}/register`, options);
    if (!res.ok) {
      console.log("Error during registration");
    } else {
      console.log("Registration successful");
    }
    return await res.json();
  } catch (error) {
    console.error("Registration error:", error);
  }
};

// Функция за тестване на защитен ресурс
export const testProtected = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  try {
    const res = await fetch(RESTRICTED_API, options);
    const data = await res.json();
    console.log("Protected data:", data);
  } catch (error) {
    console.error("Error fetching protected data:", error);
  }
};
