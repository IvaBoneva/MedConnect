import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { register } from "../api/userApi";


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
    specialization: "",
    patientFName: "",
    patientLName: "",
    patientAge: "",
    hasDisability: "",
    disabilityDetails: "",
  });

  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // за основната парола
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // за потвърждението
  const [ageError, setAgeError] = useState("");
  const [patientAgeError, setPatientAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [patientfnameError, setPatientFNameError] = useState("");
  const [patientlnameError, setPatientLNameError] = useState("");
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

  const formData1 = {
  username: "test_user_new",
  password: "test123A!",
  name: "Test User",
  age: 28,
  phoneNumber: "0888123456",
  roles: [
    { role: "Patient" } // could be "Admin", "Doctor", etc. from RolesEnum
  ]
};

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

    // Проверка телефон
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

    // Проверка потвърждение на паролата
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("Паролите не съвпадат.");
      } else {
        setConfirmPasswordError("");
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

    if (name === "password") setPasswordErrors(validatePassword(value));
    if (name === "role") setShowDoctorFields(value === "doctor");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordErrors.length > 0)
      return setMessage("Моля, коригирайте изискванията за паролата.");

    if (
      ageError ||
      emailError ||
      phoneError ||
      fnameError ||
      lnameError ||
      patientfnameError ||
      patientlnameError
    )
      return setMessage("Моля, проверете въведените данни за грешки.");

    if (formData.password !== formData.confirmPassword)
      return setMessage("Паролите не съвпадат.");

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
          <Form.Label>Име</Form.Label>
          <Form.Control
            type="text"
            name="fname"
            placeholder="Въведете вашето име"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          {fnameError && <p className="text-danger small mt-1">{fnameError}</p>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="lname"
            placeholder="Въведете вашата фамилия"
            value={formData.lname}
            onChange={handleChange}
            required
          />
          {lnameError && <p className="text-danger small mt-1">{lnameError}</p>}
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

        {/* Парола с око */}
        <Form.Group className="mb-3">
          <Form.Label>Парола</Form.Label>
          <div className="d-flex">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Въведете вашата парола"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginLeft: "5px" }}
            >
              {showPassword ? "Скрий" : "Покажи"}
            </Button>
          </div>
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

        {/* Потвърждение на паролата с око */}
        <Form.Group className="mb-3">
          <Form.Label>Потвърдете паролата</Form.Label>
          <div className="d-flex">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Повторете паролата"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ marginLeft: "5px" }}
            >
              {showConfirmPassword ? "Скрий" : "Покажи"}
            </Button>
          </div>
          {confirmPasswordError && (
            <p className="text-danger small mt-1">{confirmPasswordError}</p>
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
              <Form.Label>Име на пациента</Form.Label>
              <Form.Control
                type="text"
                name="patientFName"
                placeholder="Въведете име на пациента"
                value={formData.patientFName}
                onChange={handleChange}
                required
              />
              {patientfnameError && (
                <p className="text-danger small mt-1">{patientfnameError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фамилия на пациента</Form.Label>
              <Form.Control
                type="text"
                name="patientLName"
                placeholder="Въведете фамилия на пациента"
                value={formData.patientLName}
                onChange={handleChange}
                required
              />
              {patientlnameError && (
                <p className="text-danger small mt-1">{patientlnameError}</p>
              )}
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

        <Button type="submit" variant="success" className="w-100" onClick={() => register(formData)}>
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
