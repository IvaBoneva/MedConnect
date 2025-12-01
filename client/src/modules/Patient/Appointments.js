import { Routes, Route } from "react-router-dom";
import DoctorSearch from "../../components/DoctorComponents/DoctorSearch";
import { DoctorNewPersonalDetails } from "../../components/DoctorComponents/DoctorNewPersonalDetails";

const Appointments = () => {
  return (
    <Routes>
      {/* Страница с търсене на лекари */}
      <Route index element={<DoctorSearch />} />

      {/* Страница с детайли на избрания лекар */}
      <Route path="doctor/:slug" element={<DoctorNewPersonalDetails />} />
    </Routes>
  );
};

export default Appointments;
