import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DoctorDashboardLayout } from "./layouts/DoctorDashboardLayout";
import DoctorHome from "../../doctors/DoctorHome";
import DoctorPersonalInformation from "../../doctors/DoctorPersonalInformation"
import DoctorEditInformation from "../../doctors/DoctorEditInformation"
import DoctorPatients from "../../doctors/DoctorPatients";
import DoctorReviews from "../../doctors/DoctorReviewsPage";

const DoctorDashboardPage = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/test")
    ? "/test/Doctor"
    : "/dashboard/Doctor";

  return (
    <DoctorDashboardLayout basePath={basePath}>
      <Routes>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<DoctorHome />} />
        <Route path="personal_information" element={<DoctorPersonalInformation />} />
        <Route path="personal_information/edit" element={<DoctorEditInformation />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="doctor_reviews" element={<DoctorReviews />} />
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboardPage;