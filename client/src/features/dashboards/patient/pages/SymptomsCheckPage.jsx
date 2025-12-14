import React, { useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { MicFill, ChatDots, ClockHistory, ArrowUp } from "react-bootstrap-icons";
import doctorImage from "../../../../images/doctor.png";
import { callDoctorAdvice } from "../../../../api/geminiApi";
import { useAuth } from "../../../../context/AuthContext";

const formatBulletText = (text) => {
  if (!text) return "";
  return text.replace(/\*\*/g, " ").replace(/\*/g, " ");
};

const SymptomCheck = () => {
  const { user, token } = useAuth();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I’m your AI Doctor. How can I help you today?",
    },
  ]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const question = userInput;

    setMessages((prev) => [...prev, { role: "user", text: userInput }]);

    setUserInput("");

    try {
      const aiReply = await callDoctorAdvice(token, question);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiReply.answer,
          date: aiReply.date,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setUserInput(userInput + "\n"); 
    }
    else if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container fluid className="p-0 vh-100">
      <Card className="h-100 rounded-0 border-0">
        {/* Header */}
        <Card.Header className="text-white" style={{ background: "#2e8b57" }}>
          <Row className="align-items-center">
            <Col xs="auto">
              <img
                src={doctorImage}
                alt="Doctor Medconnect"
                className="rounded-circle"
                width="45"
                height="45"
              />
            </Col>
            <Col>
              <div className="fw-bold">
                Dr. Medconnect{" "}
                <span className="badge bg-light text-dark">Chatbot</span>
              </div>
              <small>Your AI Medical Assistent</small>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="flex-grow-1 overflow-auto bg-light">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                msg.role === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded shadow-sm ${
                  msg.role === "user" ? "text-white" : "bg-white"
                }`}
                style={{
                  background: msg.role === "user" ? "#2e8b57" : "white",
                  maxWidth: "70%",
                  whiteSpace: "pre-line", 
                  borderRadius:
                    msg.role === "user"
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                }}
              >
                {formatBulletText(msg.text)}
              </div>
            </div>
          ))}
        </Card.Body>

        <Card.Footer className="bg-white">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Row className="align-items-center g-2">
              <Col>
                <Form.Control
                  as="textarea" // Allow multiline input
                  rows={3}
                  placeholder="Type your medical question..."
                  className="rounded-pill"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown} // Attach the keydown handler here
                />
              </Col>
              <Col xs="auto">
                <Button variant="primary" className="rounded-circle">
                  <ArrowUp />
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Bottom Nav */}
          <Row className="text-center mt-3 small text-muted">
            <Col>
              <ChatDots />
              <div>Chat</div>
            </Col>
            {/* may be added  */}
            {/* <Col>
              <ClockHistory />
              <div>History</div>
            </Col> */}
          </Row>

          <div className="text-center mt-2 small">
            Powered by <b>MedConnect+ Premium</b>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SymptomCheck;
