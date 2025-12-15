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
import { useAuth } from "../../../../context/AuthContext";

const Prescriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    doctor: "",
    startDate: "",
    endDate: "",
    times: [""],
  });

  const [dateErrors, setDateErrors] = useState({
    start: "",
    end: "",
  });
  const [message, setMessage] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrescription, setEditingPrescription] = useState(null);

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

  const handleStartDateChange = (value) => {
    let error = "";

    if (value < today) {
      error = "Началната дата не може да е в миналото.";
    }

    if (formData.endDate && value > formData.endDate) {
      error = "Началната дата не може да е след крайната.";
    }

    setDateErrors((prev) => ({ ...prev, start: error }));
    setFormData({ ...formData, startDate: value });
  };

  const handleEndDateChange = (value) => {
    let error = "";

    if (value < formData.startDate) {
      error = "Крайната дата не може да е преди началната.";
    }

    setDateErrors((prev) => ({ ...prev, end: error }));
    setFormData({ ...formData, endDate: value });
  };

  const handleTimeChange = (index, value) => {
    if (formData.times.includes(value)) {
      setMessage("❌ Този час вече е добавен!");
      return;
    }

    const updatedTimes = [...formData.times];
    updatedTimes[index] = value;

    setFormData({ ...formData, times: updatedTimes });
    setMessage("");
  };

  const handleReset = () => {
    setFormData({
      medicine: "",
      dosage: "",
      doctor: "",
      startDate: "",
      endDate: "",
      times: [""],
    });
    setDateErrors({ start: "", end: "" });
    setMessage("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateErrors.start || dateErrors.end) {
      setMessage("❌ Поправете грешките в датите.");
      return;
    }

    if (!formData.medicine || !formData.dosage) {
      setMessage("❌ Моля, въведете лекарство и доза.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setMessage("❌ Моля, изберете начална и крайна дата.");
      return;
    }

    if (!formData.times.length || formData.times.some((t) => !t)) {
      setMessage("❌ Моля, въведете поне един валиден час.");
      return;
    }

    const payload = {
      medicationName: formData.medicine,
      dosage: formData.dosage,
      startDate: formData.startDate,
      endDate: formData.endDate,
      prescribingDoctor: formData.doctor || "Не е посочен",
      takingHour: formData.times.join(", "),
    };

    try {
      const token = localStorage.getItem("token");
      let url = "";
      let method = "";

      if (!editingPrescription) {
        url = `http://localhost:8080/api/prescriptions/user/${user.id}`;
        method = "POST";
      } else {
        url = `http://localhost:8080/api/prescriptions/${editingPrescription.id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.message || "Грешка при запис в базата");
      }

      setMessage(
        editingPrescription
          ? "✅ Предписанието е актуализирано успешно!"
          : "✅ Предписанието е добавено успешно!"
      );

      setEditingPrescription(null);
      handleReset();
      loadPrescriptions();
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Грешка при запис в базата.");
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      medicine: prescription.medicationName,
      dosage: prescription.dosage,
      doctor: prescription.prescribingDoctor,
      startDate: prescription.startDate,
      endDate: prescription.endDate,
      times: prescription.takingHour
        ? prescription.takingHour.split(", ").map((t) => t.trim())
        : [""],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Сигурни ли сте, че искате да изтриете това предписание?")
    )
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/prescriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Грешка при изтриване");
      }

      await loadPrescriptions();
    } catch (err) {
      console.error(err);
      setMessage("❌ Грешка при изтриване.");
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

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Начална дата</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.startDate}
                  min={today}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  isInvalid={!!dateErrors.start}
                />
                {dateErrors.start && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {dateErrors.start}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Крайна дата</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate || today}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  isInvalid={!!dateErrors.end}
                />
                {dateErrors.end && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {dateErrors.end}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

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
                    <strong>Начална дата:</strong>{" "}
                    {new Date(item.startDate).toLocaleDateString("bg-BG")}
                  </p>

                  <p>
                    <strong>Крайна дата:</strong>{" "}
                    {new Date(item.endDate).toLocaleDateString("bg-BG")}
                  </p>

                  <p>
                    <strong>Часове:</strong> {item.takingHour}
                  </p>

                  <p>
                    <strong>Лекар:</strong> {item.prescribingDoctor}
                  </p>

                  <Button
                    className="px-2 mx-5"
                    onClick={() => handleEdit(item)}
                  >
                    <strong>Редактирай</strong>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    <strong>Изтрий</strong>
                  </Button>
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
