import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

const DoctorReviews = () => {
  const reviews = [
    {
      id: 1,
      userName: "Дарин Маринов",
      rating: 5,
      comment:
        "Страхотна консултация! Докторът беше търпелив и ми обясни всичко спокойно.",
      date: "05.11.2025",
    },
    {
      id: 2,
      userName: "Сара Йорданова",
      rating: 4,
      comment:
        "Като цяло - добро преживяване, но може да не се намали времето за чакане.",
      date: "03.11.2025",
    },
    {
      id: 3,
      userName: "Михаил Георгиев",
      rating: 5,
      comment:
        "Голям професионалист, но и приятелски настроен. Силно препоръчвам!",
      date: "29.10.2025",
    },
  ];

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <>
      <Container className="py-5">
        <h3 className="text-success text-left mb-5">💬 Отзиви на пациенти</h3>
        <Row>
          {reviews.map((review) => (
            <Col md={6} lg={4} key={review.id} className="mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title>{review.userName}</Card.Title>
                    <Badge bg="info">{review.date}</Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    {renderStars(review.rating)}
                  </Card.Subtitle>
                  <Card.Text>{review.comment}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default DoctorReviews;
