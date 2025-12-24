import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; 
import {
  fetchPastAppointmentsForReview,
  submitFeedback,
} from "../../../api/appointmentApi";
import { useAuth } from "../../../context/AuthContext";

export const PersonalReview = ({ onFeedbackSubmitted, doctorId }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentsToReview, setAppointmentsToReview] = useState([]);
  const [feedbackError, setFeedbackError] = useState("");
  const { user, token } = useAuth();

  const isFeedbackValid = feedback.trim().length > 0 && rating > 0;

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setFeedback(appointment.feedback || ""); 
    setRating(appointment.rating || 0); 
    setHover(0);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment) return;
    setFeedbackError("");

    try {
      setLoading(true);

      await submitFeedback(
        selectedAppointment.id,
        feedback.trim(),
        rating,
        token
      );

      setAppointmentsToReview((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id
            ? { ...a, feedback: feedback.trim(), rating }
            : a
        )
      );

      setSelectedAppointment(null);
      setFeedback("");
      setRating(0);

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setFeedbackError("Неуспешно изпращане на обратна връзка.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId || !token || !user) return;

    async function loadAppointments() {
      try {
        const result = await fetchPastAppointmentsForReview(
          doctorId,
          user.id,
          token
        );
        setAppointmentsToReview(result);
      } catch (err) {
        console.error("Failed to fetch reviewable appointments:", err);
        setError("Неуспешно зареждане на прегледите");
      }
    }

    loadAppointments();
  }, [doctorId, user.id, token]);

  return (
    <div
      className="personal-review-container"
      style={{
        padding: "20px",
        width: "80%",
        margin: "50px auto",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4 style={{ paddingTop: "20px", textAlign: "center" }}>
        Прегледи при този специалист
      </h4>

      {loading ? (
        <p>Зареждане на прегледите...</p>
      ) : error ? (
        <p>Грешка: {error}</p>
      ) : appointmentsToReview.length > 0 ? (
        <div>
          <ListGroup
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {appointmentsToReview.map((appointment, index) => (
              <ListGroup.Item
                key={index}
                style={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  border:
                    selectedAppointment?.id === appointment.id
                      ? "2px solid #2E8B57"
                      : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  width: "80%",
                }}
                onClick={() => handleAppointmentSelect(appointment)}
              >
                <Card>
                  <Card.Body>
                    <Card.Title>
                      {appointment.patientName} {appointment.patientSurname}
                    </Card.Title>
                    <Card.Text>
                      Дата на прегледа: {appointment.startTime}
                    </Card.Text>
                    <Card.Text>
                      {appointment.feedback || "Няма обратна връзка все още."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {selectedAppointment && (
            <div style={{ marginTop: "20px", padding: "0 10%" }}>
              <h5>Напишете обратна връзка за прегледа</h5>
              <Form>
                <Form.Group
                  controlId="ratingStars"
                  style={{ marginBottom: "15px" }}
                >
                  <Form.Label style={{ display: "block" }}>Оценка</Form.Label>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {[...Array(5)].map((star, i) => {
                      const ratingValue = i + 1;
                      return (
                        <label key={i}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: "none" }}
                          />
                          <FaStar
                            className="star"
                            size={30}
                            color={
                              ratingValue <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            style={{
                              cursor: "pointer",
                              transition: "color 200ms",
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                  {rating > 0 && (
                    <Form.Text className="text-muted">
                      Оценка: {rating}/5
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="feedbackText">
                  <Form.Label>Коментар</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Напишете вашата обратна връзка тук..."
                  />
                </Form.Group>

                <Button
                  variant="success"
                  onClick={handleFeedbackSubmit}
                  style={{ marginTop: "10px" }}
                  disabled={!isFeedbackValid || loading}
                >
                  Изпрати
                </Button>
                {feedbackError && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {feedbackError}
                  </p>
                )}
              </Form>
            </div>
          )}
        </div>
      ) : (
        <p>Няма налични завършени прегледи.</p>
      )}
    </div>
  );
};

export default PersonalReview;
