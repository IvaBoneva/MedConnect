import Accordion from "react-bootstrap/Accordion";
import React from 'react'; 
import Button from "react-bootstrap/Button";

export const PatientAccourdion = ({ dayEvents, onComplete }) => {
  
  if (!dayEvents || dayEvents.length === 0) {
    return <p>No events on this date.</p>;
  }
  const activeEvents = dayEvents?.filter(ev => ev.status !== 'Completed') || [];

  if (activeEvents.length === 0) {
    return <p className="text-muted p-2">No pending events for this time.</p>;
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

// const addTwoHours = (timeString) => {
//     const date = new Date(timeString);
//     date.setHours(date.getHours() + 2); // Add 2 hours to the current time
//     return date.toISOString().slice(11, 16); // Format as HH:MM
//   };

  return (
    <Accordion>
      {dayEvents.map((ev, index) => (
        // TODO: CHECK THIS LATER AS WELL
        // <Accordion.Item eventKey={index} key={index}>
        //     {console.log(ev)}
        <Accordion.Item eventKey={index.toString()} key={ev.id || index}>
          
          <Accordion.Header>
            <div className="d-flex flex-column">
              <span className="fw-semibold">
                {ev?.patient?.firstName ? `${ev.patient.firstName} ${ev.patient.lastName}` : "Unknown Patient"}
              </span>
              <small className="text-muted">
                {/* TODO: CHECK THIS LATER ME VS ANTON */}
                {ev?.start ? addTwoHours(ev.start) : "?"} → {ev?.end ? addTwoHours(ev.end) : "?"}
                {/* {ev?.start ? addTwoHours(ev.start) : "?"} */}
              </small>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <p className="mb-1">
              <strong>Phone:</strong> {ev?.patient?.phoneNumber ?? "—"}
            </p>

            <p className="mb-1">
              <strong>Allergies:</strong>{" "}
              {ev?.patient?.allergies ? ev.patient.allergies : "No allergies"}
            </p>

            <p className="mb-1">
              <strong>Diseases:</strong>{" "}
              {ev?.patient?.diseases ? ev.patient.diseases : "No diseases"}
            </p>

            <p className="mb-1">
              <strong>Comment:</strong>{" "}
              {ev?.comment ? ev.comment : "No appointment comment"}
            </p>

            <p className="mb-1">
              <strong>Status:</strong>{" "}
              {ev?.status ? ev.status : "No appointment status"}
            </p>

            <Button 
                variant="success"
                className="w-100 mt-3"
                onClick={() => onComplete(ev.id)} 
            >
                ✔ Маркирай като приключен преглед
            </Button>

          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};