import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { Star } from "lucide-react";

const DoctorReviews = ({ doctorId }) => {
  const storageKey = `doctor_reviews_${doctorId}`;

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, author: "Анна", text: "Много добър специалист!", rating: 5 },
          {
            id: 2,
            author: "Петър",
            text: "Любезен и внимателен лекар.",
            rating: 4,
          },
        ];
  });

  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState(""); // нов state за съобщение за грешка

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  }, [reviews, storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview.trim() || rating === 0) {
      setError("Моля, дайте оценка и напишете отзив.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      author: "Вие",
      text: newReview,
      rating,
    };

    setReviews([...reviews, newEntry]);
    setNewReview("");
    setRating(0);
    setError(""); // изчистваме грешката след успешно добавяне
  };

  return (
    <div className="mt-5">
      <h5 className="mb-3">💬 Отзиви</h5>

      <ListGroup className="mb-4">
        {reviews.map((r) => (
          <ListGroup.Item key={r.id}>
            <div className="d-flex justify-content-between align-items-center">
              <strong>{r.author}</strong>
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < r.rating ? "#FFD700" : "#ccc"}
                    fill={i < r.rating ? "#FFD700" : "none"}
                  />
                ))}
              </div>
            </div>
            <div>{r.text}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Вашата оценка:</Form.Label>
          <div className="d-flex align-items-center">
            {Array.from({ length: 5 }).map((_, i) => {
              const index = i + 1;
              return (
                <Star
                  key={index}
                  size={26}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(0)}
                  color={index <= (hover || rating) ? "#FFD700" : "#ccc"}
                  fill={index <= (hover || rating) ? "#FFD700" : "none"}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              );
            })}
          </div>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Вашият отзив..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
        </Form.Group>

        {/* Покажи съобщението за грешка, ако има */}
        {error && <div className="text-danger mb-3">{error}</div>}

        <Button type="submit" variant="success">
          Изпрати
        </Button>
      </Form>
    </div>
  );
};

export default DoctorReviews;
