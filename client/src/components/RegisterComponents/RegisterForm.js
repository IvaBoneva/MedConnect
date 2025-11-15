import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logIn, register } from "../../api/userApi";
import RegisterInput from "./RegisterInput";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "./PasswordInput";
import { uploadToCloudinary } from "../../api/cloudinaryApi";



const transformFormToBackend = (form) => {
  const baseUser = {
    email: form.email,
    password: form.password,
    firstName: form.fname,
    lastName: form.lname,
    age: Number(form.age) || null,
    phoneNumber: form.phone,
    role: form.role || "",
        photoURL: form.photoURL || null,

  };

  switch (form.role) {
    case "doctor":
      return {
        ...baseUser,
        specialization: form.specialization,
      };

    case "guardian":
      return {
        ...baseUser,
        wardFirstName: form.patientFName || null,
        wardLastName: form.patientLName || null,
        wardAge: form.patientAge ? Number(form.patientAge) : null,
        isWardDisabled: form.hasDisability === "yes",
        wardDisabilityDescription:
          form.hasDisability === "yes" ? form.disabilityDetails || null : null,
        wardAllergies: form.wardAllergies || null,
        wardDiseases: form.wardDiseases || null,
      };

    case "patient":
    default:
      return {
        ...baseUser,
        allergies: form.allergies || null,
        diseases: form.diseases || null,
      };
  }
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

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
    experience: "",
    city: "",
    hospital: "",
    patientFName: "",
    patientLName: "",
    patientAge: "",
    hasDisability: "",
    disabilityDetails: "",
  });

  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [showPatientFields, setShowPatientFields] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [patientAgeError, setPatientAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [patientfnameError, setPatientFNameError] = useState("");
  const [patientlnameError, setPatientLNameError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    // Проверка опит
    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);

      if (num < 1) setExperienceError("Опитът трябва да е поне 1 година.");
      else if (num > 50)
        setExperienceError("Максималната възможна стойност е 50 години.");
      else setExperienceError("");
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

    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
      return;
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
    if (name === "role") setShowPatientFields(value === "guardian");
  };

  const handleSubmit = async (e) => {
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
      patientlnameError ||
      experienceError
    )
      return setMessage("Моля, проверете въведените данни за грешки.");

    if (formData.password !== formData.confirmPassword)
      return setMessage("Паролите не съвпадат.");

    // Симулираме успешна регистрация
    setMessage("Регистрацията беше успешна! Пренасочване към Вход...");
    setLoading(true);

    
    try {

      let uploadedPhotoURL = null;

      if (formData.photo) {
        uploadedPhotoURL = await uploadToCloudinary(formData.photo);
      }

      const backendPayload = transformFormToBackend({
        ...formData,
        photoURL: uploadedPhotoURL,
      });

      const registrationResponse = await register(backendPayload);
      console.log("Registration response:", registrationResponse);

      const loginResponse = await logIn({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse && loginResponse.token) {
        setToken(loginResponse.token);
        navigate("/");
      } else {
        setMessage("Неуспешен вход след регистрация.");
      }
    } catch (err) {
      setMessage("Възникна грешка. Моля, опитайте отново.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center text-success">
        Създайте своя MedConnect акаунт
      </h3>

      {message && (
        <Alert variant="info" className="d-flex align-items-center">
          {loading && (
            <Spinner
              animation="border"
              size="sm"
              className="me-2"
              role="status"
            />
          )}
          <span>{message}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* СОБСТВЕНО ИМЕ */}
        <RegisterInput
          label="Име"
          name="fname"
          placeholder="Въведете вашето име"
          value={formData.fname}
          onChange={handleChange}
          error={fnameError}
        />

        {/* ФАМИЛИЯ */}
        <RegisterInput
          label="Фамилия"
          type="text"
          name="lname"
          placeholder="Въведете вашата фамилия"
          value={formData.lname}
          onChange={handleChange}
          error={lnameError}
        />

        {/* ВЪЗРАСТ */}
        <RegisterInput
          label="Възраст"
          type="number"
          name="age"
          placeholder="Въведете вашата възраст"
          value={formData.age}
          onChange={handleChange}
          min="18"
          max="120"
          error={ageError}
        />

        {/* ИМЕЙЛ */}
        <RegisterInput
          label="Имейл"
          type="email"
          name="email"
          placeholder="Въведете вашия имейл"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
        />

        {/* ТЕЛЕФОН */}
        <RegisterInput
          label="Телефонен номер"
          type="text"
          name="phone"
          placeholder="Въведете вашия телефонен номер"
          value={formData.phone}
          onChange={handleChange}
          required
          error={phoneError}
        />

        <Form.Group className="mb-3">
          <Form.Label>Профилна снимка</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            name="photo"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))
            }
          />
        </Form.Group>

        {/* PASSWORD */}

        <PasswordInput
          label="Парола"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          passwordErrors={passwordErrors}
        />

        {/* CONFIRM PASSOWRD */}

        <PasswordInput
          label="Потвърдете паролата"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showConfirmPassword}
          toggleShowPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          passwordErrors={confirmPasswordError ? [confirmPasswordError] : []}
        />

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
        {showPatientFields && (
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
                <Form.Label>Описание на уврежданията</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="disabilityDetails"
                  placeholder="Опишете уврежданията на пациента"
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

            <Form.Group className="mb-3">
              <Form.Label>Опит (години)</Form.Label>
              <Form.Control
                type="number"
                name="experience"
                placeholder="Въведете вашите години опит"
                value={formData.experience}
                onChange={handleChange}
                required
                min="1"
                max="50"
              />
              {experienceError && (
                <p className="text-danger small mt-1">{experienceError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Град</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Въведете вашия град"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Работно място</Form.Label>
              <Form.Control
                type="text"
                name="hospital"
                placeholder="Въведете вашето работно място"
                value={formData.hospital}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="success" className="w-100">
          Регистрация
        </Button>

        {/* <Button onClick={goToHome}>test button</Button> */}

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
