import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { SubscriptionPromo } from "./SubscriptionsPromo";
import { SubscriptionCard } from "./SubscriptionsCard";
import { SubscriptionModal } from "./SubscriptionsModal";

export const SubscriptionPageLayout = ({
  plans,
  paymentImage,
  modalState,
  closeModal,
}) => {
  return (
    <>
      <Container className="py-5">
        <h1 className="text-success text-center mb-5">Избор на абонаментен план</h1>
        
        <Row className="justify-content-center g-4">
          {plans.map((plan) => (
            <Col key={plan.key} xs={12} md={6} lg={3} className="d-flex">
              <SubscriptionCard {...plan} />
            </Col>
          ))}

          {paymentImage && (
            <Col 
              xs={12} 
              lg={3} 
              className="text-left d-none d-lg-block" 
              style={{ marginLeft: "-60px", marginBottom: "-62px" }}
            >
              <Image 
                src={paymentImage} 
                fluid 
                style={{ marginLeft: "20px", maxHeight: "470px", borderRadius: "15px" }} 
              />
            </Col>
          )}
        </Row>
      </Container>

      <SubscriptionPromo />

      <SubscriptionModal
        show={modalState.show}
        onHide={closeModal}
        modalContent={modalState.content}
      />
    </>
  );
};