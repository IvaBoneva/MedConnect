import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { PatientDashboardLayout } from "./layouts/PatientDashboardLayout";

import Home from "../patient/pages/PatientHomePage";
import PersonalInformation from "../patient/pages/PersonalInformation";
import EditPersonalInformation from "../patient/pages/EditPersonalInformation";
import Prescriptions from "../patient/pages/PrescriptionsPage";
import Appointments from "../patient/pages/AppointmentsPage";
import Storage from "../patient/pages/StoragePage";
import PaymentPage from "../patient/pages/PaymentPage";
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

        <Route path="subscriptions/payment" element={<PaymentPage />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="appointments" element={<Appointments />} />
        <Route
          path="appointments/doctor/:slug"
          element={<DoctorPersonalDetails />}
        />
        <Route path="storage" element={<Storage userId={user?.id} />} />
        <Route path="symptom_check" element={<SymptomCheck />} />

        <Route
          path="vaccines_profilactics"
          element={
            <VaccinesAndProfilactics
              isPremium={true}
              patientAge={user?.age}
              userEmail={user?.email}
            />
          }
        />
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </PatientDashboardLayout>
  );
};

export default PatientDashboardPage;
