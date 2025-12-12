import React from "react";
import { Button } from "react-bootstrap";

export const AppointmentModal = ({ selected, comment, setComment, onConfirm, onCancel }) => {
  if (!selected) return null;

  return (
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
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="success" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};