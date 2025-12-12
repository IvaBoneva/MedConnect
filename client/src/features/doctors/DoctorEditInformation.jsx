import { useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../../images/profile.png";
import { useAuth } from "../../context/AuthContext";

const DoctorEditInformation = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    photo: user.photoURL,
    fname: user.firstName,
    lname: user.lastName,
    age: user.age,
    email: user.email,
    phone: user.phoneNumber,
    speciality: user.specialization,
    experience: user.yearsOfExperience,
    city: user.city,
    hospital: user.hospital,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/doctor"
    : "/dashboard/doctor";

  const [ageError, setAgeError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      else if (num > 120) setAgeError("Възрастта не може да надвишава 120 години.");
      else setAgeError("");
    }

    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      if (num < 1) setExperienceError("Опитът трябва да е поне 1 година.");
      else if (num > 50) setExperienceError("Максималната възможна стойност е 50 години.");
      else setExperienceError("");
    }

    if (name === "email") {
      const latinOnly = /^[A-Za-z0-9@._-]+$/;
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!latinOnly.test(value)) setEmailError("Имейлът трябва да съдържа само латински букви.");
      else if (!emailFormat.test(value)) setEmailError("Моля, въведете валиден имейл адрес.");
      else setEmailError("");
    }

    if (name === "phone") {
      const onlyDigitsOrPlus = /^[0-9+]+$/;
      const bgMobileRegex = /^(\+359|0)8[7-9][0-9]{7}$/;
      if (!onlyDigitsOrPlus.test(value)) setPhoneError("Телефонният номер трябва да съдържа само цифри.");
      else if (!bgMobileRegex.test(value)) setPhoneError("Моля, въведете валиден български мобилен номер.");
      else setPhoneError("");
    }

    const namePattern = /^[А-Я][а-я]+(-[А-Я][а-я]+)?$/;
    if (name === "fname") {
      if (value && !namePattern.test(value)) setFNameError("Името трябва да започва с главна буква (Кирилица).");
      else setFNameError("");
    }
    if (name === "lname") {
      if (value && !namePattern.test(value)) setLNameError("Фамилията трябва да започва с главна буква (Кирилица).");
      else setLNameError("");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ageError || emailError || phoneError || fnameError || lnameError) {
      setMessage("Моля, коригирайте грешките във формата.");
      return;
    }
    setMessage("✅ Информацията е успешно запазена!");
    setTimeout(() => navigate(`${basePath}/personal_information`), 2000);
  };

  const handleClear = () => {
    setFormData({
      photo: null, fname: "", lname: "", age: "", email: "", phone: "",
      speciality: "", experience: "", city: "", hospital: "",
    });
    setAgeError(""); setExperienceError(""); setEmailError(""); setPhoneError(""); setMessage("");
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Редактиране на лични данни</h3>
        {message && <Alert variant={message.startsWith("✅") ? "success" : "danger"}>{message}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
             <Col md={4} className="text-center mb-3 mt-4">
                <Image src={formData.photo || profileImage} fluid style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                <Form.Control type="file" onChange={handleImageChange} className="mt-3" />
             </Col>
             <Col md={8}>
                <Form.Group className="mb-3"><Form.Label>Име</Form.Label><Form.Control type="text" name="fname" value={formData.fname} onChange={handleChange} /></Form.Group>
             </Col>
          </Row>
          <div className="text-center mt-3">
            <Button variant="success" type="submit" className="me-2">💾 Запази</Button>
            <Button variant="secondary" onClick={handleClear}>🗑️ Изчисти</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default DoctorEditInformation;