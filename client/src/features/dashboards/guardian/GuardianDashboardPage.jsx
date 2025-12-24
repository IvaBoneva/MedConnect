import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GuardianDashboardLayout } from "./layouts/GuardianDashboardLayout";

import Home from "../../guardians/GuardianHome";
import ErrorPage from "../../../context/ErrorPage";
import GuardianPersonalInformation from "../../guardians/GuardianPersonalInformation";
import GuardianEditInformation from "../../guardians/GuardianEditInformation";
import Prescriptions from "../patient/pages/PrescriptionsPage";
import Appointments from "../patient/pages/AppointmentsPage";
import Storage from "../patient/pages/StoragePage";
import SymptomCheck from "../patient/pages/SymptomsCheckPage";
import VaccinesAndProfilactics from "../patient/pages/VaccinesPage";
import { DoctorPersonalDetails } from "../../doctors/DoctorPersonalDetails";

import SubscriptionsPage from "../../subscriptions/SubscriptionsPage";
import PharmacyMapPage from "../../map/PharmacyMapPage";

const GuardianDashboardPage = () => {
  const location = useLocation();
  const { user } = useAuth();

  const basePath = location.pathname.startsWith("/test")
    ? "/test/guardian"
    : "/dashboard/guardian";

  return (
    <GuardianDashboardLayout basePath={basePath}>
      <Routes>
        <Route index element={<Navigate to="home" />} />

        <Route path="home" element={<Home />} />

        <Route
          path="personal_information"
          element={<GuardianPersonalInformation />}
        />

        <Route
          path="personal_information/edit"
          element={<GuardianEditInformation />}
        />

        <Route path="subscriptions" element={<SubscriptionsPage />} />

        <Route path="pharmacies_hospitals" element={<PharmacyMapPage />} />

        <Route path="prescriptions" element={<Prescriptions />} />

        <Route path="appointments/*" element={<Appointments />} />

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

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </GuardianDashboardLayout>
  );
};

export default GuardianDashboardPage;
