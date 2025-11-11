const API_BASE = "http://localhost:8080/api/user";
const RESTRICTED_API = "http://localhost:8080/api/blog/restricted";
const UNRESTRICTED_API = "http://localhost:8080/api/blog/unrestricted";

const TEST_REGISTER_JSON = {
  email: "new_user@example.com",
  password: "mypassword123",
  name: "New User",
  age: 28,
  phoneNumber: "5551234567",
  role: {
    role: "Patient",
  },
};

const TEST_LOGIN_JSON = {
  email: "murtveca@example.com",
  password: "gooner",
};

export const logIn = () => {
  const params = {
    username: "test_user_new",
    password: "test123A!",
  };
  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
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
      return data; // ✅ return data so the caller can use it
    });
};

export const register = (formData) => {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => response.json());
    mode: "cors",
  };
  fetch(`${API_BASE}/register`, options)
    .then((response) => {
        if (!response.code){
            console.log("Error here broski")
        } 
        // console.log(response)
    })
};*/

export const register = (formData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    mode: "cors",
  };
  fetch(`${API_BASE}/register`, options).then((response) => {
    if (!response.ok) {
      console.log("Error during registration");
    } else {
      console.log("Registration successful");
    }
  });
};

export const testProtected = () => {
  const options1 = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ send token
    },
    mode: "cors",
  };
  fetch(`${RESTRICTED_API}`, options1).then((response) =>
    console.log(response)
  );
};
