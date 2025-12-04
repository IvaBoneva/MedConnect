import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { fetchDoctorAppointments } from "../../../api/appointmentApi";

const DoctorReviews = ({refreshTrigger}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doctorId = 6;
  const status = "Completed";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointmentsData = await fetchDoctorAppointments(
          doctorId,
          status,
          token
        );
        setAppointments(appointmentsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [refreshTrigger]);

  return (
    <div
      className="doctor-reviews-container"
      style={{ padding: "20px", marginTop: "30px" }}
    >
      <h4>Последни отзиви</h4>
      <div>
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : appointments.length > 0 ? (
          <div>
            {appointments.map((appointment, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: "15px",
                  borderRadius: "8px",
                  border: "2px solid #000000ff", // Thicker border with a custom color
                }}
              >
                <Card.Body>
                  <Card.Title>
                    {appointment.patient.firstName}{" "}
                    {appointment.patient.lastName}
                  </Card.Title>
                  <Card.Text>
                    {appointment.feedback || "No feedback provided"}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p>Няма налични отзиви.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;
