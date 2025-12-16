import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import React from 'react'; 

export const PatientAccourdion = ({ dayEvents, onComplete }) => {
  
  // 1. Филтрираме: Показваме само НЕЗАВЪРШЕНИТЕ часове.
  // Така, щом лекарят натисне бутона, часът изчезва автоматично (защото става Completed).
  const activeEvents = dayEvents?.filter(ev => 
    ev.status?.toUpperCase() !== 'COMPLETED'
  ) || [];

  if (activeEvents.length === 0) {
    return <p className="text-muted p-2">Няма чакащи прегледи за този период.</p>;
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
                  : "Unknown Patient"}
              </span>
              <small className="text-muted">
                {ev?.start ? addTwoHours(ev.start) : "?"} → {ev?.end ? addTwoHours(ev.end) : "?"}
              </small>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <p className="mb-1"><strong>Phone:</strong> {ev?.patient?.phoneNumber ?? "—"}</p>
            <p className="mb-1"><strong>Allergies:</strong> {ev?.patient?.allergies || "No allergies"}</p>
            <p className="mb-1"><strong>Diseases:</strong> {ev?.patient?.diseases || "No diseases"}</p>
            <p className="mb-1"><strong>Comment:</strong> {ev?.comment || "No appointment comment"}</p>
            <p className="mb-1"><strong>Status:</strong> {ev?.status || "—"}</p>

            {/* Лекарят само маркира като приключен. */}
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