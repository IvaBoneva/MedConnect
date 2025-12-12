import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { currentUser, logIn, register } from "../../api/userApi";
import RegisterInput from "./RegisterInput";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "./PasswordInput";
import { uploadToCloudinary } from "../../api/cloudinaryApi";

const calculateAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const transformFormToBackend = (form) => {
  const baseUser = {
    email: form.email,
    password: form.password,
    firstName: form.fname,
    lastName: form.lname,
    birthDate: form.birthDate || null,
    phoneNumber: form.phone,
    role: form.role || "",
    photoURL: form.photoURL || null,
  };

  switch (form.role) {
    case "doctor":
      return {
        ...baseUser,
        specialization: form.specialization,
        experience: Number(form.experience),
        city: form.city,
        hospital: form.hospital,
      };

    case "guardian":
      return {
        ...baseUser,
        wardFirstName: form.patientFName || null,
        wardLastName: form.patientLName || null,
        wardBirthDate: form.patientBirthDate || null,
        isWardDisabled: form.hasDisability === "yes",
        wardDisabilityDescription:
          form.hasDisability === "yes" ? form.disabilityDetails || null : null,
      };

    case "patient":
    default:
      return {
        ...baseUser,
      };
  }
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    birthDate: "",
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
    patientBirthDate: "",
    patientAge: "",
    hasDisability: "",
    disabilityDetails: "",
    photo: null,
  });

  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [showPatientFields, setShowPatientFields] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [birthDateError, setBirthDateError] = useState("");
  const [patientBirthDateError, setPatientBirthDateError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [patientfnameError, setPatientFNameError] = useState("");
  const [patientlnameError, setPatientLNameError] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Поне 8 символа");
    if (!/[A-Z]/.test(password)) errors.push("Поне една главна буква");
    if (!/[0-9]/.test(password)) errors.push("Поне една цифра");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      errors.push("Поне един специален символ");
    if (/[а-яА-Я]/.test(password))
      errors.push("Паролата не трябва да съдържа кирилица");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // BIRTHDATE & AGE
    if (name === "birthDate") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, birthDate: value, age }));
      if (formData.role === "doctor") {
        if (age < 23)
          setBirthDateError("Лекарите трябва да бъдат поне на 23 години.");
        else if (age > 80)
          setBirthDateError(
            "Максималната възраст за регистрация като лекар е 80 години."
          );
        else setBirthDateError("");
      } else {
        if (age < 18)
          setBirthDateError(
            "Регистрацията е достъпна само за лица над 18 години."
          );
        else if (age > 120)
          setBirthDateError("Максималната възможна възраст е 120 години.");
        else setBirthDateError("");
      }
    }

    if (name === "patientBirthDate") {
      const age = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        patientBirthDate: value,
        patientAge: age,
      }));
      if (age < 0)
        setPatientBirthDateError("Възрастта не може да бъде отрицателна.");
      else if (age > 120)
        setPatientBirthDateError("Максималната възможна възраст е 120 години.");
      else setPatientBirthDateError("");
    }

    // EXPERIENCE
    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      if (num < 1) setExperienceError("Опитът трябва да е поне 1 година.");
      else if (num > 50)
        setExperienceError("Максималната възможна стойност е 50 години.");
      else setExperienceError("");
    }

    // EMAIL
    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!latinOnly.test(value))
        setEmailError("Имейл адресът трябва да е само на латиница.");
      else if (!emailFormat.test(value))
        setEmailError("Моля, въведете валиден имейл адрес.");
      else setEmailError("");
    }

    // PHONE
    if (name === "phone") {
      const onlyDigitsOrPlus = /^[0-9+]+$/;
      const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;
      if (!onlyDigitsOrPlus.test(value))
        setPhoneError("Телефонният номер трябва да съдържа само цифри.");
      else if (!bgMobileRegex.test(value))
        setPhoneError(
          "Моля, въведете валиден български мобилен номер (08[7-9]******* или +3598[7-9]*******)."
        );
      else setPhoneError("");
    }

    // PASSWORD CONFIRM
    if (name === "confirmPassword") {
      value !== formData.password
        ? setConfirmPasswordError("Паролите не съвпадат.")
        : setConfirmPasswordError("");
    }

    // NAME VALIDATION
    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;
    if (name === "fname")
      setFNameError(
        value && !namePattern.test(value)
          ? "Невалидно име. Само кирилица, главна буква, без интервали."
          : ""
      );
    if (name === "lname")
      setLNameError(
        value && !namePattern.test(value)
          ? "Невалидна фамилия. Само кирилица, главна буква."
          : ""
      );
    if (name === "patientFName")
      setPatientFNameError(
        value && !namePattern.test(value) ? "Невалидно име на пациента." : ""
      );
    if (name === "patientLName")
      setPatientLNameError(
        value && !namePattern.test(value)
          ? "Невалидна фамилия на пациента."
          : ""
      );

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "password") setPasswordErrors(validatePassword(value));

    if (name === "role") {
      setShowDoctorFields(value === "doctor");
      setShowPatientFields(value === "guardian");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordErrors.length > 0)
      return setMessage("Моля, коригирайте изискванията за паролата.");
    if (
      birthDateError ||
      emailError ||
      phoneError ||
      fnameError ||
      lnameError ||
      patientfnameError ||
      patientlnameError ||
      patientBirthDateError ||
      experienceError
    )
      return setMessage("Моля, проверете въведените данни за грешки.");
    if (formData.password !== formData.confirmPassword)
      return setMessage("Паролите не съвпадат.");

    setMessage("Регистрацията беше успешна! Пренасочване към Вход...");
    setLoading(true);

    try {
      let uploadedPhotoURL = null;
      if (formData.photo)
        uploadedPhotoURL = await uploadToCloudinary(formData.photo);

      const backendPayload = transformFormToBackend({
        ...formData,
        photoURL: uploadedPhotoURL,
      });
      await register(backendPayload);
      const loginResponse = await logIn({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse && loginResponse.token) {
        const currentUserData = await currentUser();
        setAuthData(loginResponse.token, currentUserData);
        navigate("/");
      } else setMessage("Неуспешен вход след регистрация.");
    } catch {
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
          {loading && <Spinner animation="border" size="sm" className="me-2" />}
          <span>{message}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <RegisterInput
          label="Име"
          name="fname"
          placeholder="Въведете вашето име"
          value={formData.fname}
          onChange={handleChange}
          error={fnameError}
        />
        <RegisterInput
          label="Фамилия"
          name="lname"
          placeholder="Въведете вашата фамилия"
          value={formData.lname}
          onChange={handleChange}
          error={lnameError}
        />
        <RegisterInput
          label="Дата на раждане"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          error={birthDateError}
        />
        <Form.Group className="mb-3">
          <Form.Label>Възраст</Form.Label>
          <Form.Control
            type="number"
            placeholder="Вашата възраст"
            value={formData.age || ""}
            readOnly
          />
        </Form.Group>
        <RegisterInput
          label="Имейл"
          type="email"
          name="email"
          placeholder="Въведете вашия имейл"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
        />
        <RegisterInput
          label="Телефонен номер"
          type="text"
          name="phone"
          placeholder="Въведете вашия телефон"
          value={formData.phone}
          onChange={handleChange}
          error={phoneError}
        />

        {formData.role !== "guardian" && (
          <Form.Group className="mb-3">
            <Form.Label>Профилна снимка</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))
              }
            />
          </Form.Group>
        )}

        <PasswordInput
          label="Парола"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          passwordErrors={passwordErrors}
        />
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

        {/* GUARDIAN FIELDS */}
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
                <p className="text-danger small">{patientfnameError}</p>
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
                <p className="text-danger small">{patientlnameError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата на раждане на пациента</Form.Label>
              <Form.Control
                type="date"
                name="patientBirthDate"
                value={formData.patientBirthDate}
                onChange={handleChange}
                required
              />
              {patientBirthDateError && (
                <p className="text-danger small">{patientBirthDateError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Възраст на пациента</Form.Label>
              <Form.Control
                type="number"
                placeholder="Възраст на пациента"
                value={formData.patientAge || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Профилна снимка</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))
                }
              />
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
                <Form.Label>Описание на увреждането</Form.Label>
                <Form.Control
                  as="textarea"
                  name="disabilityDetails"
                  placeholder="Опишете увреждането на пациента"
                  value={formData.disabilityDetails}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </>
        )}

        {/* DOCTOR FIELDS */}
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
              />
              {experienceError && (
                <p className="text-danger small">{experienceError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Град</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Въведете града, в който работите"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Кабинет</Form.Label>
              <Form.Control
                type="text"
                name="hospital"
                placeholder="Въведете работното си място"
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
