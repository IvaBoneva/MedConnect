import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DoctorDashboardLayout } from "./layouts/DoctorDashboardLayout";
import DoctorHome from "../../doctors/DoctorHome";
import DoctorPersonalInformation from "../../doctors/DoctorPersonalInformation";
import DoctorEditInformation from "../../doctors/DoctorEditInformation";
import DoctorPatients from "../../doctors/DoctorPatients";
import DoctorReviews from "../../doctors/DoctorReviewsPage";
import ErrorPage from "../../../context/ErrorPage";

const DoctorDashboardPage = () => {
  const location = useLocation();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/doctor"
    : "/dashboard/doctor";

  return (
    <DoctorDashboardLayout basePath={basePath}>
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<DoctorHome />} />

        <Route
          path="personal_information"
          element={<DoctorPersonalInformation />}
        />

        <Route
          path="personal_information/edit"
          element={<DoctorEditInformation />}
        />

        <Route path="patients" element={<DoctorPatients />} />

        <Route path="doctor_reviews" element={<DoctorReviews />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboardPage;
