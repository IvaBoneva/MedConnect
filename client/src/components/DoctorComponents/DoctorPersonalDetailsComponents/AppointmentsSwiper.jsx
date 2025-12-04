import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Row, Col, Button, Card } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react"; // или друга икона
import { createAppointmentRequest } from "../../../api/appointmentApi";
import { splitInTwo,normalizeDate } from "../../../utils/calendarUtils";



export const AppointmentsSwiper = ({ days, refreshCalendar }) => {
  const [selected, setSelected] = useState(null); // Track the selected date and time
  const [comment, setComment] = useState(""); // Track the comment entered by the user
  const token = localStorage.getItem("token");

  // Handle hour selection
  const handleHourClick = (date, hour) => {
    setSelected({ date, hour });
  };

  const createAppointment = async () => {
    try {
      const payload = {
        doctorId: 6, // example doctorId
        patientId: 5, // example patientId
        date: normalizeDate(selected.date),
        start: selected.hour,
        comment: comment,
      };

      console.log("Sending:", payload);
      await createAppointmentRequest(payload, token);

      // Simulate an API call to create the appointment
      alert("Appointment created!");
      await refreshCalendar();

      // Clear the selection and comment after success
      setSelected(null);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Error creating appointment.");
    }
  };

  // Cancel the appointment creation
  const cancel = () => {
    setSelected(null);
    setComment("");
  };

  return (
    <>
      {/* Appointment Confirmation Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(4px)",
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "420px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h5 className="mb-3 fw-bold">Confirm appointment?</h5>
            <p className="text-muted">
              {selected.date} at <strong>{selected.hour}</strong>
            </p>
            <textarea
              className="form-control mt-3"
              rows={3}
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ resize: "none" }}
            />
            <div className="d-flex gap-3 mt-4 justify-content-center">
              <Button variant="secondary" onClick={cancel}>
                Cancel
              </Button>
              <Button variant="success" onClick={createAppointment}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Swiper Component for Day Sections */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={5} // Controls space between each slide
        slidesPerView={3} // Show 3 slides at a time
        navigation={true} // Enable Swiper's built-in navigation
        pagination={{ clickable: true }} // Enable pagination if needed
      >
        {/* Mapping through the days to create slides */}
        {days.map((day, index) => {
          const col1 = day.hours.slice(0, Math.ceil(day.hours.length / 2));
          const col2 = day.hours.slice(Math.ceil(day.hours.length / 2));

          return (
            <SwiperSlide key={index}>
              <Card className="shadow-none">
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold">{day.weekday}</Card.Title>
                  <Card.Subtitle className="text-muted mb-3">
                    {day.date}
                  </Card.Subtitle>

                  {day.hours.length === 0 && (
                    <div
                      className="p-4 text-muted"
                      style={{
                        border: "2px dashed #e0e0e0",
                        borderRadius: "8px",
                        background: "#f8f9fa",
                      }}
                    >
                      Няма свободни часове
                    </div>
                  )}

                  <Row className="g-2">
                    <Col>
                      {col1.map((hour) => (
                        <Button
                          key={hour}
                          className="custom-time-slot-btn w-100 fw-bold d-flex justify-content-center gap-2"
                          onClick={() => handleHourClick(day.date, hour)}
                          style={{ marginBottom: "5px" }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </Col>

                    <Col>
                      {col2.map((hour) => (
                        <Button
                          key={hour}
                          className="custom-time-slot-btn w-100 fw-bold d-flex justify-content-center gap-2"
                          onClick={() => handleHourClick(day.date, hour)}
                          style={{ marginBottom: "5px" }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};
