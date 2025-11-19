const API_BASE = "http://localhost:8080/api/user";

export const logIn = ({ email, password }) => {
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
  let endpoint = `${API_BASE}/user/register`;

  switch (formData.role) {
    case "doctor":
      endpoint = `${API_BASE}/doctor/register`;
      break;
    case "guardian":
      endpoint = `${API_BASE}/guardian/register`;
      break;
    case "patient":
      endpoint = `${API_BASE}/patient/register`;
      break;
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    mode: "cors",
  };

  return fetch(endpoint, options)
    .then(res => {
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    });
};

export const currentUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return Promise.reject("No token found, user is not authenticated");
    }

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        mode: "cors",
    };

    return fetch(`${API_BASE}/auth/me`, options)
        .then((res) => {
            console.log("Response status:", res.status);
            if (!res.ok) {
                throw new Error("Failed to fetch current user data");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Current user data:", data);
            return data; 
        })
        .catch((error) => {
            console.error("Error fetching current user:", error);
            throw error; 
        });
};
