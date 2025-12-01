import Accordion from "react-bootstrap/Accordion";

export const PatientAccourdion = ({ dayEvents }) => {
  if (!dayEvents || dayEvents.length === 0) {
    return <p>No events on this date.</p>;
  }

  return (
    <Accordion>
      {dayEvents.map((ev, index) => (
        <Accordion.Item eventKey={index} key={index}>
          
          {/* HEADER */}
          <Accordion.Header>
            <div className="d-flex flex-column">
              <span className="fw-semibold">
                {ev?.patient?.firstName} {ev?.patient?.lastName}
              </span>

              <small className="text-muted">
                {ev?.start.slice(11, 16)} → {ev?.end?.slice(11, 16) || "?"}
              </small>
            </div>
          </Accordion.Header>

          {/* BODY */}
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