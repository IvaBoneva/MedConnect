import React, { useState, useEffect } from "react";
import { Card, Badge} from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { fetchDoctorAppointments } from "../../../api/appointmentApi";
import { useAuth } from "../../../context/AuthContext";

const DoctorReviews = ({ refreshTrigger, doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const status = "Completed";

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
  }, [refreshTrigger, doctorId, token]); 
  
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

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
            {appointments.map((appointment, index) => {
              const ratingVal = Number(appointment.rating) || 0;

              return (
                <Card
                  key={index}
                  style={{
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "2px solid #000000ff",
                  }}
                >
                  <Card.Body>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                    <Card.Title>
                      {appointment.patientName} {appointment.patientSurname}
                    </Card.Title>
                    <Badge bg="info" style={{ fontSize: "0.7rem", color: "white", alignItems: "right" }}>
                        {formatDate(appointment.startTime)}
                      </Badge>
                  </div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={20}
                          color={i < ratingVal ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                      <span style={{ marginLeft: "8px", color: "#666", fontSize: "0.9rem" }}>
                        {ratingVal > 0 ? `(${ratingVal}/5)` : ""}
                      </span>
                    </div>
                    <Card.Text>
                      {appointment.feedback || "No feedback provided"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        ) : (
          <p>Няма налични отзиви.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;