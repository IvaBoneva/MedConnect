import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Form } from "react-bootstrap";
import {
  fetchDoctorAppointments,
  fetchPastAppointmentsForReview,
  submitFeedback,
} from "../../../api/appointmentApi";

export const PersonalReview = ({ onFeedbackSubmitted }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentsToReview, setAppointmentsToReview] = useState([]);
  const [feedbackError, setFeedbackError] = useState("");

  const isFeedbackValid = feedback.trim().length > 0;

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setFeedback(""); // reset input
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment) return;

    // BASIC VALIDATION
    if (!feedback || !feedback.trim()) {
      setFeedbackError("Моля въведете текст преди да изпратите отзив.");
      return;
    }

    setFeedbackError(""); // Clear error if valid

    try {
      setLoading(true);

      await submitFeedback(selectedAppointment.id, feedback.trim(), token);

      // Update UI locally
      setAppointmentsToReview((prev) =>
        prev.filter((a) => a.id !== selectedAppointment.id)
      );

      setSelectedAppointment(null);
      setFeedback("");

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const doctorId = 6; // You can dynamically fetch this as well
  const userId = 10;

  useEffect(() => {
    if (!doctorId || !token) return;

    async function loadAppointments() {
      try {
        const result = await fetchPastAppointmentsForReview(
          doctorId,
          userId,
          token
        );
        setAppointmentsToReview(result);
      } catch (err) {
        console.error("Failed to fetch reviewable appointments:", err);
      }
    }

    loadAppointments();
  }, [doctorId, userId, token]);

  return (
    <div
      className="personal-review-container"
      style={{
        padding: "20px",
        width: "80%",
        margin: "50px auto", // Centers the section
        backgroundColor: "#ffffff", // White background
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Box shadow for clean design
      }}
    >
      <h4 style={{ paddingTop: "20px", textAlign: "center" }}>
        Make a Difference
      </h4>

      {/* Appointments list */}
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p>Error: {error}</p>
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
                  border: "2px solid #2E8B57", // Border for each item
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9", // Light gray background for each card
                  width: "80%", // Ensures the cards are centered with fixed width
                }}
                onClick={() => handleAppointmentSelect(appointment)} // Uncomment this for selecting appointments
              >
                <Card>
                  <Card.Body>
                    <Card.Title>
                      {appointment.patient.firstName}{" "}
                      {appointment.patient.lastName}
                    </Card.Title>
                    <Card.Text>
                      Appointment Date: {appointment.startingTime}
                    </Card.Text>
                    <Card.Text>
                      {appointment.feedback || "No feedback provided yet."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Feedback Form for selected appointment */}
          {selectedAppointment && (
            <div style={{ marginTop: "20px" }}>
              <h5>Provide Feedback for Appointment</h5>
              <Form>
                <Form.Group controlId="feedbackText">
                  <Form.Label>Your Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)} // Uncomment this to enable feedback input
                    placeholder="Write your feedback here..."
                  />
                </Form.Group>
                <Button
                  variant="success"
                  onClick={handleFeedbackSubmit}
                  style={{ marginTop: "10px" }}
                  disabled={!isFeedbackValid || loading}
                >
                  Submit Feedback
                </Button>
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
