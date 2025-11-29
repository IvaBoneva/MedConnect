import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    doctor: "",
    days: [],
    times: [""],
  });

  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const [message, setMessage] = useState("");

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.times];
    updatedTimes[index] = value;
    setFormData({ ...formData, times: updatedTimes });
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

  /* const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.medicine || !formData.dosage || !formData.days.length) {
      setMessage("❌ Моля, попълнете всички задължителни полета.");
      return;
    }

    setMessage("✅ Предписанието е успешно запазено!");
    console.log("Записано предписание:", formData);

    // След 2 сек — връщаме към home
    setTimeout(() => {
      navigate(`${basePath}/home`);
    }, 2000);
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Валидация на формата
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

    // ✅ Създаваме payload за backend
    const payload = {
      medicationName: formData.medicine,
      dosage: formData.dosage,
      frequency: formData.days.join(", "), // масив -> CSV стринг
      prescribingDoctor: formData.doctor || "Не е посочен",
      takingHour: formData.times.join(", "), // масив -> CSV стринг
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

      // ✅ Логваме response за отстраняване на грешки
      const data = await res.json();
      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.message || "Грешка при запис в базата");
      }

      setMessage("✅ Предписанието е успешно запазено!");
      setTimeout(() => navigate(`${basePath}/home`), 2000);
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

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Лекарство</Form.Label>
                <Form.Control
                  type="text"
                  name="medicine"
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
                  name="dosage"
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
                  name="doctor"
                  placeholder="Напр. личен лекар"
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Избор на дни */}
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

          {/* Избор на часове */}
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
            <Button variant="success" type="submit" className="px-4">
              💾 Запази
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Prescriptions;
