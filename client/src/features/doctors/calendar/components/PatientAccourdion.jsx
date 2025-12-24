import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import React from "react";

export const PatientAccourdion = ({ dayEvents, onComplete }) => {
  
  const activeEvents = dayEvents?.filter(ev => 
    ev.status?.toUpperCase() !== 'COMPLETED'
  ) || [];

  if (activeEvents.length === 0) {
    return (
      <p className="text-muted p-2">Няма чакащи прегледи за този период.</p>
    );
  }

  const addTwoHours = (timeString) => {
    if (!timeString) return "";
    if (timeString.length === 5 && timeString.includes(":")) {
      return timeString;
    }
    const date = new Date(timeString);
    date.setHours(date.getHours() + 2);
    return date.toISOString().slice(11, 16);
  };

  return (
    <Accordion>
      {activeEvents.map((ev, index) => (
        <Accordion.Item eventKey={index.toString()} key={ev.id || index}>
          <Accordion.Header>
            <div className="d-flex flex-column">
              <span className="fw-semibold">
                {ev?.patient?.firstName
                  ? `${ev.patient.firstName} ${ev.patient.lastName}`
                  : "Неизвестен пациент"}
              </span>
              <small className="text-muted">
                {ev?.start ? addTwoHours(ev.start) : "?"} →{" "}
                {ev?.end ? addTwoHours(ev.end) : "?"}
              </small>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <p className="mb-1">
              <strong>Телефон:</strong> {ev?.patient?.phoneNumber ?? "—"}
            </p>
            <p className="mb-1">
              <strong>Алергии:</strong>{" "}
              {ev?.patient?.allergies || "Няма алергии"}
            </p>
            <p className="mb-1">
              <strong>Заболявания:</strong>{" "}
              {ev?.patient?.diseases || "Няма заболявания"}
            </p>
            <p className="mb-1">
              <strong>Коментар:</strong>{" "}
              {ev?.comment || "Няма коментар за прегледа"}
            </p>
            <p className="mb-1">
              <strong>Статус:</strong> {ev?.status || "—"}
            </p>

            <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => onComplete(ev.id)} 
            >
              ✔ Маркирай като завършен преглед
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
