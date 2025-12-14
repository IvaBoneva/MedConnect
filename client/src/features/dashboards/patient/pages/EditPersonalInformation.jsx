import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Image,
  Alert,
} from "react-bootstrap";
import profileImage from "../../../../images/profile.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { uploadToCloudinary } from "../../../../api/cloudinaryApi";

const EditPersonalInformation = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const [formData, setFormData] = useState({
    photo: user.photoURL,
    fname: user.firstName,
    lname: user.lastName,
    age: user.age,
    email: user.email,
    phone: user.phoneNumber,
    allergies: user.allergies,
    diseases: user.diseases,
  });

  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      if (!user?.id || !token) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/patient/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          setFormData((prev) => ({
            ...prev,
            photo: data.photoURL,
            fname: data.firstName,
            lname: data.lastName,
            age: data.age,
            email: data.email,
            phone: data.phoneNumber,
            allergies: data.allergies,
            diseases: data.diseases,
          }));
        }
      } catch (error) {
        console.error("Грешка при зареждане на данни:", error);
      }
    };

    fetchLatestData();
  }, [user.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); 
      setFormData({ ...formData, photo: URL.createObjectURL(file) }); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "age") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      if (num < 18) setAgeError("Възрастта трябва да е поне 18 години.");
      else if (num > 120)
        setAgeError("Възрастта не може да надвишава 120 години.");
      else setAgeError("");
    }

    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!latinOnly.test(value))
        setEmailError("Имейлът трябва да съдържа само латински букви.");
      else if (!emailFormat.test(value))
        setEmailError("Моля, въведете валиден имейл адрес.");
      else setEmailError("");
    }

    if (name === "phone") {
      const onlyDigitsOrPlus = /^[0-9+]+$/;
      const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;
      if (!onlyDigitsOrPlus.test(value)) {
        setPhoneError("Телефонният номер трябва да съдържа само цифри.");
      } else if (!bgMobileRegex.test(value)) {
        setPhoneError("Моля, въведете валиден български мобилен номер.");
      } else {
        setPhoneError("");
      }
    }

    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;
    if (name === "fname") {
      if (value && !namePattern.test(value)) {
        setFNameError("Името трябва да започва с главна буква (Кирилица).");
      } else {
        setFNameError("");
      }
    }
    if (name === "lname") {
      if (value && !namePattern.test(value)) {
        setLNameError("Фамилията трябва да започва с главна буква (Кирилица).");
      } else {
        setLNameError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (ageError || emailError || phoneError || fnameError || lnameError) {
      setMessage("Моля, коригирайте грешките във формата.");
      return;
    }

    try {
      let finalPhotoURL = formData.photo; 

      if (photoFile) {
        const uploadedUrl = await uploadToCloudinary(photoFile);
        if (uploadedUrl) {
          finalPhotoURL = uploadedUrl;
        } else {
          throw new Error("Неуспешно качване на снимка.");
        }
      }

      const payload = {
        firstName: formData.fname,
        lastName: formData.lname,
        age: formData.age,
        email: formData.email,
        phoneNumber: formData.phone,
        allergies: formData.allergies,
        diseases: formData.diseases,
        photoURL: finalPhotoURL 
      };

      const response = await fetch(
        `http://localhost:8080/api/user/patient/update/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Грешка при обновяване на данните.");
      }

      const updatedUser = await response.json();

      const newUserData = { ...user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserData));

      setTimeout(() => navigate(`${basePath}/personal_information`, { replace: true }), 1000);

    } catch (error) {
      console.error(error);
      setMessage("❌ Грешка: " + error.message);
    }
  };

  const handleClear = () => {
    setFormData({
      photo: null,
      fname: "",
      lname: "",
      age: "",
      email: "",
      phone: "",
      allergies: "",
      diseases: "",
    });
    setAgeError("");
    setEmailError("");
    setPhoneError("");
    setMessage("");
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">
          Редактиране на лични данни
        </h3>

        {message && (
          <Alert
            variant={message.startsWith("✅") ? "success" : "danger"}
            className="text-center"
          >
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center mb-3 mt-4">
              <div className="d-flex flex-column align-items-center">
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "10px",
                    border: "3px solid #2E8B57",
                    backgroundColor: "#f8f9fa",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={formData.photo || profileImage}
                    alt="Patient"
                    fluid
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="mt-3">
                  <Form.Label
                    htmlFor="photo"
                    className="btn btn-outline-success btn-sm"
                  >
                    Смени снимката
                  </Form.Label>
                  <Form.Control
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </Col>

            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Име</Form.Label>
                <Form.Control
                  type="text"
                  name="fname"
                  placeholder="Въведете вашето име"
                  value={formData.fname}
                  onChange={handleChange}
                />
                {fnameError && (
                  <p className="text-danger small mt-1">{fnameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  name="lname"
                  placeholder="Въведете вашата фамилия"
                  value={formData.lname}
                  onChange={handleChange}
                />
                {lnameError && (
                  <p className="text-danger small mt-1">{lnameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Възраст</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Въведете вашата възраст"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                />
                {ageError && (
                  <p className="text-danger small mt-1">{ageError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Имейл</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Въведете вашия имейл"
                  value={formData.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-danger small mt-1">{emailError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Въведете вашия телефон"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {phoneError && (
                  <p className="text-danger small mt-1">{phoneError}</p>
                )}
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <Form.Group className="mb-3">
            <Form.Label>Алергии</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="allergies"
              placeholder="Опишете известни алергии (по желание)"
              value={formData.allergies}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Заболявания</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="diseases"
              placeholder="Опишете хронични заболявания (по желание)"
              value={formData.diseases}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" className="px-4 me-2">
              💾 Запази
            </Button>

            <Button
              variant="secondary"
              type="button"
              className="px-4 mx-4"
              onClick={handleClear}
            >
              🗑️ Изчисти
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditPersonalInformation;
