import React from "react";
import { Modal, Button } from "react-bootstrap";

const SubscriptionModal = ({ show, onHide, modalContent }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalContent.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отказ
        </Button>
        {modalContent.action && (
          <Button variant="success" onClick={modalContent.action}>
            Потвърди
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;
