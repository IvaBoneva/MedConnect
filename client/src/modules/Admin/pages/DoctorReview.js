import { useParams } from "react-router-dom";
import DoctorReviews from "../../../features/doctors/components/DoctorReviews";
import { useAuth } from "../../../context/AuthContext";
import { ReviewsMock } from "../mock data/Reviews";

const DoctorReview = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div>
      <h2>Отзиви за лекар</h2>
      <DoctorReviews
        doctorId={Number(id)}
        reviewsData={ReviewsMock}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default DoctorReview;
