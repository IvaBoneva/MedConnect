import Accordion from "react-bootstrap/Accordion";

export const PatientAccourdion = ({ dayEvents }) => {
  if (!dayEvents || dayEvents.length === 0) {
    return <p>No events on this date.</p>;
  }

const addTwoHours = (timeString) => {
    const date = new Date(timeString);
    date.setHours(date.getHours() + 2); // Add 2 hours to the current time
    return date.toISOString().slice(11, 16); // Format as HH:MM
  };

  return (
    <Accordion>
      {dayEvents.map((ev, index) => (
        <Accordion.Item eventKey={index} key={index}>
            {console.log(ev)}
          <Accordion.Header>
            <div className="d-flex flex-column">
              <span className="fw-semibold">
                {ev?.patient?.firstName} {ev?.patient?.lastName}
              </span>
              <small className="text-muted">
                {ev?.start ? addTwoHours(ev.start) : "?"} → {ev?.end ? addTwoHours(ev.end) : "?"}
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
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};