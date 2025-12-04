// src/modules/Patient/Appointments.js
import { useState } from "react";
import DoctorSearch from "../../components/DoctorComponents/DoctorSearch";
import { Routes, Route } from "react-router-dom";
import { DoctorNewPersonalDetails } from "../../components/DoctorComponents/DoctorPersonalDetailsComponents/DoctorNewPersonalDetails";

DoctorNewPersonalDetails

const Appointments = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBack = () => {
    setSelectedDoctor(null);
  };

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
