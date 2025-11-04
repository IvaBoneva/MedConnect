import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
    specialization: "",
    patientName: "",
    patientAge: "",
    hasDisability: "",
    disabilityDetails: "",
  });

  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [ageError, setAgeError] = useState("");
  const [patientAgeError, setPatientAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");

  // Валидация на паролата
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Поне 8 символа");
    if (!/[A-Z]/.test(password)) errors.push("Поне една главна буква");
    if (!/[0-9]/.test(password)) errors.push("Поне една цифра");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      errors.push("Поне един специален символ");
    return errors;
  };

  // Обработка на промени
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Проверка възраст
    if (name === "age" || name === "patientAge") {
      newValue = value.replace(/\D/g, "");
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

    // Проверка имейл
    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!latinOnly.test(value))
        setEmailError("Имейл адресът трябва да е само на латиница.");
      else if (!emailFormat.test(value))
        setEmailError("Моля, въведете валиден имейл адрес.");
      else setEmailError("");
    }

    // Проверка телефон — само мобилни номера в България
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

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "password") setPasswordErrors(validatePassword(value));
    if (name === "role") setShowDoctorFields(value === "doctor");
  };

  // Изпращане
  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordErrors.length > 0)
      return setMessage("Моля, коригирайте изискванията за паролата.");

    if (ageError || emailError || phoneError)
      return setMessage("Моля, проверете въведените данни за грешки.");

    if (formData.role === "doctor") {
      setMessage(
        "Регистрацията е изпратена. Профилът ще бъде прегледан от администратор."
      );
    } else {
      setMessage("Регистрацията беше успешна! Можете да влезете в профила си.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center text-success">
        Създайте своя MedConnect акаунт
      </h3>

      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Имена */}
        <Form.Group className="mb-3">
          <Form.Label>Имена</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Въведете вашите имена"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Възраст */}
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
            required
          />
          {ageError && <p className="text-danger small mt-1">{ageError}</p>}
        </Form.Group>

        {/* Имейл */}
        <Form.Group className="mb-3">
          <Form.Label>Имейл адрес</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Въведете вашия имейл"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <p className="text-danger small mt-1">{emailError}</p>}
        </Form.Group>

        {/* Телефон */}
        <Form.Group className="mb-3">
          <Form.Label>Телефонен номер</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            placeholder="Въведете вашия телефонен номер"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {phoneError && <p className="text-danger small mt-1">{phoneError}</p>}
        </Form.Group>

        {/* Парола */}
        <Form.Group className="mb-3">
          <Form.Label>Парола</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Въведете вашата парола"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Form.Text muted>
            Паролата трябва да съдържа поне:
            <ul className="mb-1 mt-1">
              <li>8 символа</li>
              <li>1 главна буква</li>
              <li>1 цифра</li>
              <li>1 специален символ</li>
            </ul>
          </Form.Text>
          {passwordErrors.length > 0 ? (
            <ul className="text-danger small mt-1">
              {passwordErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          ) : (
            formData.password && (
              <p className="text-success small mt-1">
                ✅ Паролата отговаря на всички изисквания.
              </p>
            )
          )}
        </Form.Group>

        {/* Роля */}
        <Form.Group className="mb-3">
          <Form.Label>Роля</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Пациент</option>
            <option value="guardian">Настойник</option>
            <option value="doctor">Лекар</option>
          </Form.Select>
        </Form.Group>

        {/* Настойник – Детайли за пациента */}
        {formData.role === "guardian" && (
          <>
            <h6 className="mt-3 text-secondary">Детайли за пациента</h6>
            <Form.Group className="mb-3">
              <Form.Label>Имена на пациента</Form.Label>
              <Form.Control
                type="text"
                name="patientName"
                placeholder="Въведете имената на пациента"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Възраст на пациента</Form.Label>
              <Form.Control
                type="number"
                name="patientAge"
                placeholder="Въведете възрастта на пациента"
                min="0"
                max="120"
                value={formData.patientAge}
                onChange={handleChange}
                required
              />
              {patientAgeError && (
                <p className="text-danger small mt-1">{patientAgeError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пациент с увреждания</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Да"
                  name="hasDisability"
                  value="yes"
                  checked={formData.hasDisability === "yes"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Не"
                  name="hasDisability"
                  value="no"
                  checked={formData.hasDisability === "no"}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            {formData.hasDisability === "yes" && (
              <Form.Group className="mb-3">
                <Form.Label>Описание на заболяването</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="disabilityDetails"
                  placeholder="Опишете заболяването или състоянието"
                  value={formData.disabilityDetails}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </>
        )}

        {/* Лекар */}
        {showDoctorFields && (
          <>
            <h6 className="mt-3 text-secondary">Детайли за лекар</h6>
            <Form.Group className="mb-3">
              <Form.Label>Специализация</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                placeholder="Въведете вашата специализация"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="success" className="w-100">
          Регистрация
        </Button>

        <div className="text-center mt-2">
          <p className="text-muted">
            Вече имате акаунт?{" "}
            <Link
              to="/login"
              className="text-success fw-semibold text-decoration-none"
            >
              Вход
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
