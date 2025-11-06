import React, { useState } from "react";
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
import profileImage from "../../images/profile.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EditPersonalInformation = () => {
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    age: "",
    email: "",
    phone: "",
    allergies: "",
    conditions: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  // Грешки
  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");

  // Смяна на снимка
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  // Промяна на полета с валидации
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Възраст
    if (name === "age") {
      newValue = value.replace(/\D/g, ""); // само цифри
      const num = parseInt(newValue, 10);
      if (num < 18) setAgeError("Възрастта трябва да е поне 18 години.");
      else if (num > 120)
        setAgeError("Възрастта не може да надвишава 120 години.");
      else setAgeError("");
    }

    // Имейл
    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!latinOnly.test(value))
        setEmailError("Имейлът трябва да съдържа само латински букви.");
      else if (!emailFormat.test(value))
        setEmailError("Моля, въведете валиден имейл адрес.");
      else setEmailError("");
    }

    // Телефон
    if (name === "phone") {
      const onlyDigitsOrPlus = /^[0-9+]+$/;
      const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;

      if (!onlyDigitsOrPlus.test(value)) {
        setPhoneError("Телефонният номер трябва да съдържа само цифри.");
      } else if (!bgMobileRegex.test(value)) {
        setPhoneError(
          "Моля, въведете валиден български мобилен номер (напр. 08[7-9]******* или +3598[7-9]*******)."
        );
      } else {
        setPhoneError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Запазване
  const handleSubmit = (e) => {
    e.preventDefault();

    if (ageError || emailError || phoneError) {
      setMessage("Моля, коригирайте грешките във формата.");
      return;
    }

    setMessage("✅ Информацията е успешно запазена!");
  };

  // Изчистване
  const handleClear = () => {
    setFormData({
      photo: null,
      name: "",
      age: "",
      email: "",
      phone: "",
      allergies: "",
      conditions: "",
    });
    setAgeError("");
    setEmailError("");
    setPhoneError("");
    setMessage("");
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Лична информация</h3>

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
            {/* Фото */}
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
                      objectFit: "contain", // показва цялата снимка
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

            {/* Основни данни */}
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Имена</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Въведете вашите имена"
                  value={formData.name}
                  onChange={handleChange}
                />
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

          {/* Медицински детайли */}
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
              name="conditions"
              placeholder="Опишете хронични заболявания (по желание)"
              value={formData.conditions}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Бутони */}
          <div className="text-center">
            <Button
              variant="success"
              type="submit"
              className="px-4 me-2"
              onClick={() => navigate(`${basePath}/personal_information`)}
            >
              Запази
            </Button>
            <Button
              variant="success"
              type="button"
              className="px-4 mx-4"
              onClick={handleClear}
            >
              Изчисти
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditPersonalInformation;
