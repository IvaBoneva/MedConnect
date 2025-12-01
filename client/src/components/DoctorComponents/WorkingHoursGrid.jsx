import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";

import { splitInTwo, normalizeDate } from "../../utils/calendarUtils";
import { createAppointmentRequest } from "../../api/appointmentApi";

export const WorkingHoursGrid = ({ days, onSelect, refreshCalendar }) => {
  const DAYS_PER_SLIDE = 3; // Show 3 days at once

  const token = localStorage.getItem("token");
  const [index, setIndex] = useState(0);

  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");

  const handleHourClick = (date, hour) => {
    setSelected({ date, hour });
  };

  const createAppointment = async () => {
    try {
      const payload = {
        doctorId: 2,
        patientId: 6,
        date: normalizeDate(selected.date),
        start: selected.hour,
        comment: comment,
      };

      console.log("Sending:", payload);

      await createAppointmentRequest(payload, token);

      alert("Appointment created!");
      await refreshCalendar();

      setSelected(null);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Error creating appointment.");
    }
  };

  const cancel = () => {
    setSelected(null);
    setComment(""); // reset
  };

  const next = () => {
    if (index + DAYS_PER_SLIDE < days.length) {
      setIndex(index + DAYS_PER_SLIDE);
    }
  };
  const prev = () => {
    if (index - DAYS_PER_SLIDE >= 0) {
      setIndex(index - DAYS_PER_SLIDE);
    }
  };

  const visibleDays = days.slice(index, index + DAYS_PER_SLIDE);

  return (
    <div className="mt-4">
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

            {/* --- COMMENT TEXTAREA --- */}
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

      {/* Header Controls */}
      <Row className="mb-2 align-items-center">
        <Col xs="auto">
          <Button variant="link" onClick={prev}>
            ←
          </Button>
        </Col>

        <Col xs="auto">
          <Button variant="link" onClick={next}>
            →
          </Button>
        </Col>
      </Row>

      {/* Day Columns */}
      <Row className="g-3 flex-nowrap overflow-auto">
        {visibleDays.map((day) => {
          const [col1, col2] = splitInTwo(day.hours);

          return (
            <Col key={day.date} xs={8} md={4} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold">{day.weekday}</Card.Title>
                  <Card.Subtitle className="text-muted mb-3">
                    {day.date}
                  </Card.Subtitle>

                  {/* If no hours → disabled box */}
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

                  {/* Hours Section */}
                  <Row className="g-2">
                    <Col>
                      {col1.map((hour) => (
                        <Button
                          key={hour}
                          variant="outline-success"
                          className="w-100 fw-bold d-flex justify-content-center gap-2"
                          onClick={() => handleHourClick(day.date, hour)}
                        >
                          {hour}
                        </Button>
                      ))}
                    </Col>

                    <Col>
                      {col2.map((hour) => (
                        <Button
                          key={hour}
                          variant="outline-success"
                          className="w-100 fw-bold d-flex justify-content-center gap-2"
                          onClick={() => handleHourClick(day.date, hour)}
                        >
                          {hour}
                        </Button>
                      ))}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
