import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const daysOfWeek = [
  "Понеделник",
  "Вторник",
  "Сряда",
  "Четвъртък",
  "Петък",
  "Събота",
  "Неделя",
];

const Prescriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    doctor: "",
    days: [],
    times: [""],
  });

  const [message, setMessage] = useState("");

  // ----------------------------
  // Нови state-ове
  // ----------------------------
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Зареждане на предписания
  // ----------------------------
  const loadPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/prescriptions/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error loading prescriptions:", data);
        return;
      }

      setPrescriptions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadPrescriptions();
  }, [user]);

  // ----------------------------
  // Функции за формата
  // ----------------------------
  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleTimeChange = (index, value) => {
    // Проверка дали този час вече съществува (на друго място)
    if (formData.times.includes(value)) {
      setMessage("❌ Този час вече е добавен!");
      return;
    }

    const updatedTimes = [...formData.times];
    updatedTimes[index] = value;

    setFormData({ ...formData, times: updatedTimes });
    setMessage(""); // изчистваме стара грешка
  };

  // Добавете тази функция в компонентa Prescriptions
  const handleReset = () => {
    setFormData({
      medicine: "",
      dosage: "",
      doctor: "",
      days: [],
      times: [""],
    });
    setMessage(""); // ако искате да изчистите и съобщенията
  };

  const addTimeField = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const removeTimeField = (index) => {
    setFormData({
      ...formData,
      times: formData.times.filter((_, i) => i !== index),
    });
  };

  // ----------------------------
  // Submit на ново предписание
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.medicine || !formData.dosage) {
      setMessage("❌ Моля, въведете лекарство и доза.");
      return;
    }

    if (!formData.days.length) {
      setMessage("❌ Моля, изберете поне един ден.");
      return;
    }

    if (!formData.times.length || formData.times.some((t) => !t)) {
      setMessage("❌ Моля, въведете поне един валиден час.");
      return;
    }

    const payload = {
      medicationName: formData.medicine,
      dosage: formData.dosage,
      frequency: formData.days.join(", "),
      prescribingDoctor: formData.doctor || "Не е посочен",
      takingHour: formData.times.join(", "),
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/prescriptions/user/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.message || "Грешка при запис в базата");
      }

      setMessage("✅ Предписанието е успешно запазено!");

      // Обновяване на списъка след добавяне
      await loadPrescriptions();
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Грешка при запис в базата.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-success mb-4">💊 Добавяне на предписание</h3>

        {message && (
          <Alert
            variant={message.startsWith("✅") ? "success" : "danger"}
            className="text-center"
          >
            {message}
          </Alert>
        )}

        {/* ------------------------------------ */}
        {/* FORM */}
        {/* ------------------------------------ */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Лекарство</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Въведете име на лекарството"
                  value={formData.medicine}
                  onChange={(e) =>
                    setFormData({ ...formData, medicine: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Доза / Количество</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Напр. 1 таблетка"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Предписващ лекар</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Напр. личен лекар"
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ДНИ */}
          <Form.Group className="mb-3">
            <Form.Label>Изберете дни на прием</Form.Label>
            <Row>
              {daysOfWeek.map((day) => (
                <Col xs={6} md={3} key={day}>
                  <Form.Check
                    type="checkbox"
                    label={day}
                    checked={formData.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          {/* ЧАСОВЕ */}
          <Form.Group className="mb-3">
            <Form.Label>Часове на прием</Form.Label>
            {formData.times.map((time, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
                {formData.times.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => removeTimeField(index)}
                  >
                    ✖
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline-success"
              size="sm"
              onClick={addTimeField}
              className="mt-2"
            >
              ➕ Добави час
            </Button>
          </Form.Group>

          <div className="text-center mt-4">
            <Button variant="success" type="submit" className="px-4 me-2">
              💾 Запази
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="px-4 mx-4"
              onClick={handleReset}
            >
              🗑️ Изчисти
            </Button>
          </div>
        </Form>
      </Card>

      {/* ------------------------------------ */}
      {/* 📌 СПИСЪК С ПРЕДПИСАНИЯ */}
      {/* ------------------------------------ */}
      <h4 className="mt-5 mb-3">📋 Вашите предписания</h4>

      {loading ? (
        <p>Зареждане...</p>
      ) : prescriptions.length === 0 ? (
        <Alert variant="info">Нямате добавени предписания.</Alert>
      ) : (
        <Row>
          {prescriptions.map((item) => (
            <Col md={6} lg={4} key={item.id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>💊 {item.medicationName}</Card.Title>

                  <p>
                    <strong>Доза:</strong> {item.dosage}
                  </p>

                  <p>
                    <strong>Дни:</strong> {item.frequency}
                  </p>

                  <p>
                    <strong>Часове:</strong> {item.takingHour}
                  </p>

                  <p>
                    <strong>Лекар:</strong> {item.prescribingDoctor}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Prescriptions;
