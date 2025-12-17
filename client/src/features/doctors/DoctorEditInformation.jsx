import { useState, useEffect } from "react";
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
import profileImage from "../../images/profile.png"; // Увери се, че пътят е верен
import { useAuth } from "../../context/AuthContext";
// 1. ВАЖНО: Импортираме функцията за качване
import { uploadToCloudinary } from "../../api/cloudinaryApi";

const DoctorEditInformation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/doctor"
    : "/dashboard/doctor";

  // Стейт за формата
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

  // 2. ВАЖНО: Стейт за файла, който ще качваме
  const [photoFile, setPhotoFile] = useState(null);

  const [ageError, setAgeError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      if (!user?.id || !token) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/doctor/${user.id}`,
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
            speciality: data.specialization,
            experience: data.yearsOfExperience,
            city: data.city,
            hospital: data.hospital,
          }));
        }
      } catch (error) {
        console.error("Грешка при зареждане на данни:", error);
      }
    };

    fetchLatestData();
  }, [user.id]);

  // Обработка на избор на снимка
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Запазваме файла за качване по-късно
      setFormData({ ...formData, photo: URL.createObjectURL(file) }); // Само за превю
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
    if (name === "experience") {
      newValue = value.replace(/\D/g, "");
      const experience = Number(newValue);
      const age = Number(formData.age);

      if (!age) {
        setExperienceError("Моля, първо въведете възраст.");
      } else if (age < 23) {
        setExperienceError(
          "Лекарят не може да има професионален опит, ако е под 23 години."
        );
      } else {
        const maxExperience = age - 23;

        if (experience < 0) {
          setExperienceError("Опитът не може да бъде отрицателен.");
        } else if (experience > maxExperience) {
          setExperienceError(
            `Максималният възможен опит за тази възраст е ${maxExperience} години.`
          );
        } else {
          setExperienceError("");
        }
      }
    }
    // ... (Можеш да добавиш и другите валидации тук, ако ги имаш) ...

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // 3. ВАЖНО: Тук е логиката за качване
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      ageError ||
      experienceError ||
      emailError ||
      phoneError ||
      fnameError ||
      lnameError
    ) {
      setMessage("Моля, коригирайте грешките във формата.");
      return;
    }

    setMessage("⏳ Обработка на данните...");

    try {
      // А) Качване в Cloudinary (САМО ако има избран нов файл)
      let finalPhotoURL = formData.photo;

      if (photoFile) {
        const uploadedUrl = await uploadToCloudinary(photoFile);
        if (uploadedUrl) {
          finalPhotoURL = uploadedUrl; // Взимаме новия линк от Cloudinary
        } else {
          throw new Error("Неуспешно качване на снимка.");
        }
      }

      // Б) Подготовка на данните за Backend-а
      const payload = {
        firstName: formData.fname,
        lastName: formData.lname,
        age: parseInt(formData.age) || 0,
        email: formData.email,
        phoneNumber: formData.phone,
        photoURL: finalPhotoURL, // Изпращаме валидния URL (стария или новия от Cloudinary)
        specialization: formData.speciality,
        yearsOfExperience: parseInt(formData.experience) || 0,
        city: formData.city,
        hospital: formData.hospital,
      };

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/user/doctor/update/${user.id}`,
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
        const errorText = await response.text();
        throw new Error(errorText || "Update failed");
      }

      const updatedUserDTO = await response.json();

      // Обновяваме само LocalStorage, за да не чупим навигацията
      const newUserData = { ...user, ...updatedUserDTO };
      localStorage.setItem("user", JSON.stringify(newUserData));

      setMessage("✅ Информацията е успешно запазена!");

      setTimeout(() => {
        navigate(`${basePath}/personal_information`, { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Update Error:", error);
      setMessage("❌ Грешка: " + error.message);
    }
  };

  const handleClear = () => {
    setFormData({
      ...formData,
      fname: "",
      lname: "",
      age: "",
      email: "",
      phone: "",
      speciality: "",
      experience: "",
      city: "",
      hospital: "",
    });
    setPhotoFile(null);
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
            {/* СНИМКА */}
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
                    alt="Doctor"
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

            {/* ФОРМА */}
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Име</Form.Label>
                <Form.Control
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                />
                {fnameError && (
                  <p className="text-danger small">{fnameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                />
                {lnameError && (
                  <p className="text-danger small">{lnameError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Възраст</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
                {ageError && <p className="text-danger small">{ageError}</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Имейл</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-danger small">{emailError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {phoneError && (
                  <p className="text-danger small">{phoneError}</p>
                )}
              </Form.Group>
            </Col>
          </Row>

          <hr />

          {/* ДОКТОРСКА ИНФОРМАЦИЯ */}
          <Form.Group className="mb-3">
            <Form.Label>Специализация</Form.Label>
            <Form.Control
              type="text"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Опит (години)</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
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
              value={formData.city}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Кабинет</Form.Label>
            <Form.Control
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
            />
          </Form.Group>

          {/* БУТОНИ */}
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

export default DoctorEditInformation;
