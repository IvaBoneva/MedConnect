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

export const logIn = ({ email, password }) => {
  // const { email, password } = TEST_LOGIN_JSON;

  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${API_BASE}/login`, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Login failed");
      }
      return res.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    });
};

export const register = (formData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    mode: "cors",
  };

  return fetch(`${API_BASE}/register`, options)
    .then((response) => response.json())
    .then((data) => {
      if (data.code) {
        console.log("Error here broski", data);
      } else {
        console.log("Registration successful", data);
      }
    })
    .catch((error) => {
      console.error("Error during registration:", error);
    });
};

export const testProtected = () => {
  const token = localStorage.getItem("token");
  const options1 = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  fetch(`${RESTRICTED_API}`, options1)
    .then((response) => response.json())
    .then((data) => {
      console.log("Protected data:", data);
    })
    .catch((error) => {
      console.error("Error fetching protected data:", error);
    });
};
