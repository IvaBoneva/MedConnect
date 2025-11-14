const API_BASE = "http://localhost:8080/api/user";

export const logIn = ({email,password}) => {

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

// export const register = (formData) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//     mode: "cors",
//   };

//   return fetch(`${API_BASE}/register`, options)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.code) {
//         console.log("Error here broski", data); 
//       } else {
//         console.log("Registration successful", data);
//       }
//     })
//     .catch((error) => {
//       console.error("Error during registration:", error);
//     });
// };


export const register = (formData) => {
  // choose the right endpoint based on the role
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
    default:
      console.warn("Unknown role, defaulting to /user/register");
      break;
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
      return res.json();
    })
    .then((data) => {
      console.log("Registration successful", data);
      return data;
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      throw error;
    });
};