import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; 
import { fetchDoctorAppointments } from "../../api/appointmentApi"
import { useAuth } from "../../context/AuthContext";

const DoctorReviewsPage = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const currentDoctorId = doctorId || user?.id; 

  useEffect(() => {
    const loadReviews = async () => {
      if (!currentDoctorId) return;

      try {
        setLoading(true);
        const data = await fetchDoctorAppointments(currentDoctorId, "Completed", token);
        
        const validReviews = data.filter(app => app.feedback && app.feedback.trim().length > 0);
        
        setReviews(validReviews);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [currentDoctorId, token]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p>Зареждане на отзиви...</p>
      </Container>
    );
  }

  if (error) {
    return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="py-5">
      <h3 className="text-success text-left mb-5">💬 Отзиви на пациенти</h3>
      
      {reviews.length === 0 ? (
        <Alert variant="info">Няма намерени отзиви за този специалист.</Alert>
      ) : (
        <Row>
          {reviews.map((review) => {
            const ratingVal = Number(review.rating) || 0; 

            return (
              <Col md={6} lg={4} key={review.id} className="mb-4">
                <Card className="h-100 shadow-sm" style={{ border: "none", borderRadius: "10px" }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title style={{ fontWeight: "bold" }}>
                        {review.patientName} {review.patientSurname}
                      </Card.Title>
                      <Badge bg="info" style={{ fontSize: "0.85rem", color: "white" }}>
                        {formatDate(review.startTime)}
                      </Badge>
                    </div>

                    <Card.Subtitle className="mb-3 text-muted">
                      <div style={{ display: "flex" }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < ratingVal ? "#ffc107" : "#e4e5e9"} 
                            size={18}
                          />
                        ))}
                      </div>
                    </Card.Subtitle>

                    <Card.Text style={{ color: "#555" }}>
                      {review.feedback}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default DoctorReviewsPage;