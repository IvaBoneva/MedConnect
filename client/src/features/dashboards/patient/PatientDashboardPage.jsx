import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { PatientDashboardLayout } from "./layouts/PatientDashboardLayout";

import Home from "../patient/pages/PatientHomePage";
import ErrorPage from "../../../context/ErrorPage";
import PersonalInformation from "../patient/pages/PersonalInformation";
import EditPersonalInformation from "../patient/pages/EditPersonalInformation";
import Prescriptions from "../patient/pages/PrescriptionsPage";
import Appointments from "../patient/pages/AppointmentsPage";
import Storage from "../patient/pages/StoragePage";
import SymptomCheck from "../patient/pages/SymptomsCheckPage";
import VaccinesAndProfilactics from "../patient/pages/VaccinesPage";

import SubscriptionsPage from "../../subscriptions/SubscriptionsPage";
import PharmacyMapPage from "../../map/PharmacyMapPage";
import { DoctorPersonalDetails } from "../../doctors/DoctorPersonalDetails";

const PatientDashboardPage = () => {
  const location = useLocation();
  const { user } = useAuth();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/patient"
    : "/dashboard/patient";

  return (
    <PatientDashboardLayout basePath={basePath}>
      <Routes>
        <Route index element={<Navigate to="home" />} />

        <Route path="home" element={<Home />} />

        <Route path="personal_information" element={<PersonalInformation />} />

        <Route
          path="personal_information/edit"
          element={<EditPersonalInformation />}
        />

        <Route path="subscriptions" element={<SubscriptionsPage />} />

        <Route path="pharmacies_hospitals" element={<PharmacyMapPage />} />

        <Route path="prescriptions" element={<Prescriptions />} />

        <Route path="appointments" element={<Appointments />} />

        <Route
          path="appointments/doctor/:slug"
          element={<DoctorPersonalDetails />}
        />

        <Route path="storage" element={<Storage userId={user?.id} />} />

        <Route
          path="symptom_check"
          element={<SymptomCheck isPremium={user?.subscription == "premium"} />}
        />

        <Route
          path="vaccines_profilactics"
          element={
            <VaccinesAndProfilactics
              isPremium={user?.subscription === "premium"}
              user={user}
            />
          }
        />

        {/* 404 inside dashboard */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </PatientDashboardLayout>
  );
};

export default PatientDashboardPage;
