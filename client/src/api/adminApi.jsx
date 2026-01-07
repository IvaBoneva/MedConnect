const ADMIN_API_BASE = "http://localhost:8080/api/admin";


export const getAllRegisterRequests = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(`${ADMIN_API_BASE}/doctor_register_requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch register requests");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};



export const adminLogIn = ({ email, password }) => {
  return fetch(`${ADMIN_API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const responseBody = await res.text(); // JWT or error message

      if (!res.ok) {
        const error = new Error(responseBody || "Admin login failed");
        error.status = res.status;
        throw error;
      }
      
      localStorage.setItem("adminToken", responseBody);
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("role", "admin");

      return responseBody;
    });
};



