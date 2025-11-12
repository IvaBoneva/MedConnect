import { Row, Col } from "react-bootstrap";

const HomeBorder = () => {
  return (
    <Row className="my-0">
      <Col>
        <div
          style={{
            height: "4px",
            backgroundColor: "#2E8B57",
            borderRadius: "2px",
            width: "100%",
          }}
        />
      </Col>
    </Row>
  );
};

export default HomeBorder;
