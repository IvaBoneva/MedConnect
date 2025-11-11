// test functions - no need to worry or delete :_)

const API_BASE = "http://localhost:8080/api/user";
const RESTRICTED_API = "http://localhost:8080/api/blog/restricted";

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

let token;

export const logIn = () => {
  const params = {
    username: "test_user_new",
    password: "test123A!",
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    mode: "cors",
  };
  fetch(`${API_BASE}/login`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.token);
      token = data.token;
      localStorage.setItem("jwt-token", data.token);
      testProtected();
    });
};

/*export const register = (formData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
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
