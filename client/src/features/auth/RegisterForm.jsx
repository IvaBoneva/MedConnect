import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currentUser, logIn, register } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { uploadToCloudinary } from "../../api/cloudinaryApi";
import { RegisterFormLayout } from "./components/register/RegisterFormLayout";

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
      return { ...baseUser, specialization: form.specialization };
    case "guardian":
      return {
        ...baseUser,
        wardFirstName: form.patientFName || null,
        wardLastName: form.patientLName || null,
        wardAge: form.patientAge ? Number(form.patientAge) : null,
        isWardDisabled: form.hasDisability === "yes",
        wardDisabilityDescription: form.hasDisability === "yes" ? form.disabilityDetails || null : null,
        wardAllergies: form.wardAllergies || null,
        wardDiseases: form.wardDiseases || null,
      };
    case "patient":
    default:
      return { ...baseUser, allergies: form.allergies || null, diseases: form.diseases || null };
  }
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [formData, setFormData] = useState({
    fname: "", lname: "", age: "", email: "", password: "", confirmPassword: "",
    phone: "", role: "patient", specialization: "", experience: "", city: "",
    hospital: "", patientFName: "", patientLName: "", patientAge: "",
    hasDisability: "", disabilityDetails: "", photo: null,
  });

  const [toggles, setToggles] = useState({
    showDoctorFields: false,
    showPatientFields: false,
    showPassword: false,
    showConfirmPassword: false
  });

  const [errors, setErrors] = useState({
    passwordErrors: [], confirmPasswordError: "", ageError: "", experienceError: "",
    patientAgeError: "", emailError: "", phoneError: "", fnameError: "",
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
    const { name, value, files } = e.target;
    
    if (name === "photo" && files) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      return;
    }

    let newValue = value;
    const newErrors = { ...errors };

    if (name === "age" || name === "patientAge") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      if (name === "age") newErrors.ageError = (num < 18 || num > 120) ? "Невалидна възраст (18-120)." : "";
      if (name === "patientAge") newErrors.patientAgeError = (num < 0 || num > 120) ? "Невалидна възраст." : "";
    }

    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      newErrors.experienceError = (num < 1 || num > 50) ? "Опитът трябва да е между 1 и 50 г." : "";
    }

    if (name === "email") {
       const latinOnly = /^[A-Za-z0-9@._-]+$/;
       const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!latinOnly.test(value)) newErrors.emailError = "Само на латиница.";
       else if (!emailFormat.test(value)) newErrors.emailError = "Невалиден имейл.";
       else newErrors.emailError = "";
    }

    if (name === "phone") {
        const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;
        newErrors.phoneError = !bgMobileRegex.test(value) ? "Невалиден БГ номер." : "";
    }

    if (name === "confirmPassword") {
        newErrors.confirmPasswordError = (value !== formData.password) ? "Паролите не съвпадат." : "";
    }

    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;
    if (["fname", "lname", "patientFName", "patientLName"].includes(name)) {
        const errorKey = name === "fname" ? "fnameError" : name === "lname" ? "lnameError" : name === "patientFName" ? "patientfnameError" : "patientlnameError";
        newErrors[errorKey] = (value && !namePattern.test(value)) ? "Само кирилица, с главна буква." : "";
    }

    if (name === "password") {
        newErrors.passwordErrors = validatePassword(value);
    }
    
    if (name === "role") {
        setToggles(prev => ({
            ...prev,
            showDoctorFields: value === "doctor",
            showPatientFields: value === "guardian"
        }));
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.passwordErrors.length > 0 || errors.confirmPasswordError || formData.password !== formData.confirmPassword) {
        return setMessage("Моля, проверете паролите.");
    }
    
    const hasErrors = Object.values(errors).some(val => val && typeof val === 'string' && val.length > 0);
    if (hasErrors) return setMessage("Моля, проверете данните за грешки.");

    setMessage("Регистрацията беше успешна! Пренасочване към Вход...");
    setLoading(true);

    try {
      let uploadedPhotoURL = null;
      if (formData.photo) {
        uploadedPhotoURL = await uploadToCloudinary(formData.photo);
      }

      const backendPayload = transformFormToBackend({ ...formData, photoURL: uploadedPhotoURL });
      await register(backendPayload);
      
      const loginResponse = await logIn({ email: formData.email, password: formData.password });

      if (loginResponse && loginResponse.token) {
        const currentUserData = await currentUser();
        setAuthData(loginResponse.token, currentUserData);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
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
      loading={loading}
      message={message}
      errors={errors}
      toggles={toggles}
      toggleHandlers={toggleHandlers}
    />
  );
};

export default RegisterForm;