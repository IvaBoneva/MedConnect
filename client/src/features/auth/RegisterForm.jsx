import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Пътищата към API са 3 нива нагоре (../../api)
import { currentUser, logIn, register } from "../../api/userApi";
import { uploadToCloudinary } from "../../api/cloudinaryApi";
import { useAuth } from "../../context/AuthContext";
import { RegisterFormLayout } from "./components/register/RegisterFormLayout";

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
      return { ...baseUser };
  }
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [formData, setFormData] = useState({
    fname: "", lname: "", birthDate: "", age: "", email: "", password: "", confirmPassword: "",
    phone: "", role: "patient", specialization: "", experience: "", city: "", hospital: "",
    patientFName: "", patientLName: "", patientBirthDate: "", patientAge: "",
    hasDisability: "", disabilityDetails: "", photo: null,
  });

  const [toggles, setToggles] = useState({
    showDoctorFields: false,
    showPatientFields: false,
    showPassword: false,
    showConfirmPassword: false
  });

  const [errors, setErrors] = useState({
    passwordErrors: [], confirmPasswordError: "", birthDateError: "", experienceError: "",
    patientBirthDateError: "", emailError: "", phoneError: "", fnameError: "",
    lnameError: "", patientfnameError: "", patientlnameError: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const errs = [];
    if (password.length < 8) errs.push("Поне 8 символа");
    if (!/[A-Z]/.test(password)) errs.push("Поне една главна буква");
    if (!/[0-9]/.test(password)) errs.push("Поне една цифра");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errs.push("Поне един специален символ");
    if (/[а-яА-Я]/.test(password)) errs.push("Паролата не трябва да съдържа кирилица");
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    const newErrors = { ...errors };

    // BIRTHDATE & AGE
    if (name === "birthDate") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, birthDate: value, age }));
      if (formData.role === "doctor") {
        if (age < 23) newErrors.birthDateError = "Лекарите трябва да бъдат поне на 23 години.";
        else if (age > 80) newErrors.birthDateError = "Максималната възраст за регистрация като лекар е 80 години.";
        else newErrors.birthDateError = "";
      } else {
        if (age < 18) newErrors.birthDateError = "Регистрацията е достъпна само за лица над 18 години.";
        else if (age > 120) newErrors.birthDateError = "Максималната възможна възраст е 120 години.";
        else newErrors.birthDateError = "";
      }
    }

    if (name === "patientBirthDate") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, patientBirthDate: value, patientAge: age }));
      if (age < 0) newErrors.patientBirthDateError = "Възрастта не може да бъде отрицателна.";
      else if (age > 120) newErrors.patientBirthDateError = "Максималната възможна възраст е 120 години.";
      else newErrors.patientBirthDateError = "";
    }

    // EXPERIENCE
    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      newErrors.experienceError = (num < 1 || num > 50) ? "Опитът трябва да е между 1 и 50 г." : "";
    }

    // EMAIL
    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!latinOnly.test(value)) newErrors.emailError = "Имейл адресът трябва да е само на латиница.";
      else if (!emailFormat.test(value)) newErrors.emailError = "Моля, въведете валиден имейл адрес.";
      else newErrors.emailError = "";
    }

    // PHONE
    if (name === "phone") {
      const onlyDigitsOrPlus = /^[0-9+]+$/;
      const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;
      if (!onlyDigitsOrPlus.test(value)) newErrors.phoneError = "Телефонният номер трябва да съдържа само цифри.";
      else if (!bgMobileRegex.test(value)) newErrors.phoneError = "Моля, въведете валиден български мобилен номер.";
      else newErrors.phoneError = "";
    }

    // PASSWORD CONFIRM
    if (name === "confirmPassword") {
      newErrors.confirmPasswordError = (value !== formData.password) ? "Паролите не съвпадат." : "";
    }

    // NAME VALIDATION
    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;
    if (name === "fname") newErrors.fnameError = (value && !namePattern.test(value)) ? "Невалидно име. Само кирилица, главна буква." : "";
    if (name === "lname") newErrors.lnameError = (value && !namePattern.test(value)) ? "Невалидна фамилия. Само кирилица, главна буква." : "";
    if (name === "patientFName") newErrors.patientfnameError = (value && !namePattern.test(value)) ? "Невалидно име на пациента." : "";
    if (name === "patientLName") newErrors.patientlnameError = (value && !namePattern.test(value)) ? "Невалидна фамилия на пациента." : "";

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    if (name === "password") newErrors.passwordErrors = validatePassword(value);

    // Roles Toggle Logic
    if (name === "role") {
      setToggles(prev => ({
        ...prev,
        showDoctorFields: value === "doctor",
        showPatientFields: value === "guardian"
      }));
    }
    
    setErrors(newErrors);
  };

  const handleImageChange = (e) => {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.passwordErrors.length > 0) return setMessage("Моля, коригирайте изискванията за паролата.");
    
    // Проверка за грешки (освен passwordErrors, които са масив)
    const hasStringErrors = Object.entries(errors).some(([key, val]) => key !== 'passwordErrors' && val);
    
    if (hasStringErrors) return setMessage("Моля, проверете въведените данни за грешки.");
    if (formData.password !== formData.confirmPassword) return setMessage("Паролите не съвпадат.");

    setMessage("Регистрацията беше успешна! Пренасочване към Вход...");
    setLoading(true);

    try {
      let uploadedPhotoURL = null;
      if (formData.photo) uploadedPhotoURL = await uploadToCloudinary(formData.photo);

      const backendPayload = transformFormToBackend({ ...formData, photoURL: uploadedPhotoURL });
      await register(backendPayload);
      
      const loginResponse = await logIn({ email: formData.email, password: formData.password });

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

  const toggleHandlers = {
    toggleShowPassword: () => setToggles(prev => ({...prev, showPassword: !prev.showPassword})),
    toggleShowConfirmPassword: () => setToggles(prev => ({...prev, showConfirmPassword: !prev.showConfirmPassword}))
  };

  return (
    <RegisterFormLayout
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      loading={loading}
      message={message}
      errors={errors}
      toggles={toggles}
      toggleHandlers={toggleHandlers}
    />
  );
};

export default RegisterForm;