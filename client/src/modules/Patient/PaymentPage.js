import { Container } from "react-bootstrap";

const PaymentPage = () => {
  return (
    <>
      <Container className="py-5">
        <h3 className="text-success text-left mb-5">💳 Плащане на абонамент</h3>{" "}
        <iframe
          title="Payment System"
          src=""
          style={{ border: 0, width: "100%", height: "400px" }}
        />
      </Container>
    </>
  );
};

export default PaymentPage;
