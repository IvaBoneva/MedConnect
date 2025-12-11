import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Image, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../../../../images/profile.png";
import { useAuth } from "../../../../context/AuthContext";

const EditPersonalInformation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test") ? "/test/patient" : "/dashboard/patient";

  const [formData, setFormData] = useState({
    photo: user.photoURL, fname: user.firstName, lname: user.lastName,
    age: user.age, email: user.email, phone: user.phoneNumber,
    allergies: user.allergies, diseases: user.diseases,
  });

  const [errors, setErrors] = useState({}); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLatestData = async () => {
      const token = localStorage.getItem("token");
      if (!user?.id || !token) return;
      try {
        const response = await fetch(`http://localhost:8080/api/user/patient/${user.id}`, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev, photo: data.photoURL, fname: data.firstName, lname: data.lastName,
            age: data.age, email: data.email, phone: data.phoneNumber,
            allergies: data.allergies, diseases: data.diseases,
          }));
        }
      } catch (error) { console.error("Грешка при зареждане:", error); }
    };
    fetchLatestData();
  }, [user.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, photo: URL.createObjectURL(file) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    const newErrors = { ...errors };

    if (name === "age") {
      newValue = value.replace(/\D/g, "");
      const num = parseInt(newValue, 10);
      newErrors.age = (num < 18 || num > 120) ? "Невалидна възраст (18-120)." : "";
    }

    setErrors(newErrors);
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/user/patient/update/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
              firstName: formData.fname, lastName: formData.lname, age: formData.age,
              email: formData.email, phoneNumber: formData.phone,
              allergies: formData.allergies, diseases: formData.diseases,
            }),
        }); 

        if (!response.ok) throw new Error("Грешка при обновяване.");
        
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
        setMessage("✅ Информацията е успешно запазена!");
        setTimeout(() => navigate(`${basePath}/personal_information`), 1000);
    } catch (error) { setMessage("❌ Грешка: " + error.message); }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success text-left mb-4">Редактиране на лични данни</h3>
        {message && <Alert variant={message.startsWith("✅") ? "success" : "danger"}>{message}</Alert>}
        
        <Form onSubmit={handleSubmit}>
           <Row>
            <Col md={4} className="text-center mb-3 mt-4">
               <Image src={formData.photo || profileImage} fluid style={{width: "150px", height: "150px", objectFit: "cover"}} />
               <Form.Control type="file" onChange={handleImageChange} className="mt-3" />
            </Col>
            <Col md={8}>
               <Form.Group className="mb-3"><Form.Label>Име</Form.Label><Form.Control type="text" name="fname" value={formData.fname} onChange={handleChange} /></Form.Group>
            </Col>
           </Row>
           <div className="text-center">
             <Button variant="success" type="submit" className="me-2">💾 Запази</Button>
             <Button variant="secondary" onClick={() => setFormData({})}>🗑️ Изчисти</Button>
           </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditPersonalInformation;