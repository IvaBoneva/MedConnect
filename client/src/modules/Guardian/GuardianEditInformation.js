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
import { useState } from "react";

const GuardianEditInformation = () => {
  const [formData, setFormData] = useState({
    photo: null,
    patientFName: "",
    patientLName: "",
    patientAge: "",
    disabilities: "",
    allergies: "",
    diseases: "",
    fname: "",
    lname: "",
    age: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/guardian"
    : "/dashboard/guardian";

  // Грешки
  const [ageError, setAgeError] = useState("");
  const [patientAgeError, setPatientAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [patientFNameError, setPatientFNameError] = useState("");
  const [patientLNameError, setPatientLNameError] = useState("");
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
    if (name === "age" || name === "patientAge") {
      newValue = value.replace(/\D/g, ""); // само цифри
      const num = parseInt(newValue, 10);

      if (name === "age") {
        if (num < 18)
          setAgeError("Регистрацията е достъпна само за лица над 18 години.");
        else if (num > 120)
          setAgeError("Максималната възможна стойност е 120 години.");
        else setAgeError("");
      }

      if (name === "patientAge") {
        if (num < 0) setPatientAgeError("Възрастта не може да е отрицателна.");
        else if (num > 120)
          setPatientAgeError("Максималната възможна стойност е 120 години.");
        else setPatientAgeError("");
      }
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

    // Проверка имена
    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;

    if (name === "patientFName") {
      if (value && !namePattern.test(value)) {
        setPatientFNameError(
          "Името трябва да започва с главна буква и да съдържа само кирилица. Позволено е едно тире. Без интервали и цифри."
        );
      } else setPatientFNameError("");
    }

    if (name === "patientLName") {
      if (value && !namePattern.test(value)) {
        setPatientLNameError(
          "Фамилията трябва да започва с главна буква и да съдържа само кирилица. Позволено е едно тире. Без интервали и цифри."
        );
      } else setPatientLNameError("");
    }

    if (name === "fname") {
      if (value && !namePattern.test(value)) {
        setFNameError(
          "Името трябва да започва с главна буква и да съдържа само кирилица. Позволено е едно тире. Без интервали и цифри."
        );
      } else setFNameError("");
    }

    if (name === "lname") {
      if (value && !namePattern.test(value)) {
        setLNameError(
          "Фамилията трябва да започва с главна буква и да съдържа само кирилица. Позволено е едно тире. Без интервали и цифри."
        );
      } else setLNameError("");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Запазване
  const handleSubmit = (e) => {
    e.preventDefault();

    if (ageError || emailError || phoneError || fnameError || lnameError) {
      setMessage("Моля, коригирайте грешките във формата.");
      return;
    }

    setMessage("✅ Информацията е успешно запазена!");

    // Пренасочване след кратка пауза (примерно 2 секунди)
    setTimeout(() => navigate(`${basePath}/personal_information`), 2000);
  };

  // Изчистване
  const handleClear = () => {
    setFormData({
      photo: null,
      patientFName: "",
      patientLName: "",
      patientAge: "",
      disabilities: "",
      allergies: "",
      diseases: "",
      fname: "",
      lname: "",
      age: "",
      email: "",
      phone: "",
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
                <Form.Label>Име на пациент</Form.Label>
                <Form.Control
                  type="text"
                  name="patientFName"
                  placeholder="Въведете името на пациента"
                  value={formData.patientFName}
                  onChange={handleChange}
                />
                {patientFNameError && (
                  <p className="text-danger small mt-1">{patientFNameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фамилия на пациент</Form.Label>
                <Form.Control
                  type="text"
                  name="patientLName"
                  placeholder="Въведете фамилията на пациента"
                  value={formData.patientLName}
                  onChange={handleChange}
                />
                {patientLNameError && (
                  <p className="text-danger small mt-1">{patientLNameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Възраст на пациент</Form.Label>
                <Form.Control
                  type="number"
                  name="patientAge"
                  placeholder="Въведете възраст на пациент"
                  min="0"
                  max="120"
                  value={formData.patientAge}
                  onChange={handleChange}
                />
                {patientAgeError && (
                  <p className="text-danger small mt-1">{patientAgeError}</p>
                )}
              </Form.Group>

              {/* Медицински детайли */}
              <Form.Group className="mb-3">
                <Form.Label>Увреждания</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="disabilities"
                  placeholder="Опишете уврежданията на пациента"
                  value={formData.disabilities}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Алергии</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="allergies"
                  placeholder="Опишете известни алергии на пациента (по желание)"
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
                  placeholder="Опишете хронични заболявания на пациента (по желание)"
                  value={formData.diseases}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          {/* Детайли за настойник*/}
          <Form.Group className="mb-3">
            <Form.Label>Име на настойник</Form.Label>
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
            <Form.Label>Фамилия на настойник</Form.Label>
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
            <Form.Label>Възраст на настойник</Form.Label>
            <Form.Control
              type="number"
              name="age"
              placeholder="Въведете вашата възраст"
              min="18"
              max="120"
              value={formData.age}
              onChange={handleChange}
            />
            {ageError && <p className="text-danger small mt-1">{ageError}</p>}
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

          {/* Бутони */}
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

export default GuardianEditInformation;
