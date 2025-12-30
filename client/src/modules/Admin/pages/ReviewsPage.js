import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DoctorsWithReviewsMock } from "../mock data/DoctorsWithReviews";

const ReviewsPage = () => {
console.log("DoctorsWithReviewsMock:", DoctorsWithReviewsMock);
  return (
    <>
      <h2>Лекари и отзиви</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Име</th>
            <th>Email</th>
            <th>Специализация</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {DoctorsWithReviewsMock.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.firstName} {doctor.lastName}</td>
              <td>{doctor.email}</td>
              <td>{doctor.specialization}</td>
              <td>
                <Link to={`/admin/reviews/${doctor.id}`}>
                  <Button size="sm" variant="outline-secondary">
                    Виж отзиви
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ReviewsPage;
