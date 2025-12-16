import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Row, Col, Button, Card } from "react-bootstrap";
import { useAppointment } from "../hooks/useAppointmentBooking";
import { AppointmentModal } from "./AppointmentModal";

export const AppointmentsSwiper = ({ days, refreshCalendar, doctorId }) => {
  const { 
    selected, 
    comment, 
    setComment, 
    handleHourClick, 
    createAppointment, 
    cancel 
  } = useAppointment({days, refreshCalendar,doctorId});
//   TODO: CHECK THIS AS WELL
//   } = useAppointment({days, doctorId, refreshCalendar});

  return (
    <>
      <AppointmentModal 
        selected={selected}
        comment={comment}
        setComment={setComment}
        onConfirm={createAppointment}
        onCancel={cancel}
      />

      <Swiper
        modules={[Navigation]}
        spaceBetween={5}
        slidesPerView={3}
        navigation={true}
        pagination={{ clickable: true }}
      >
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