import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DoctorSearch from "../../../doctors/components/DoctorSearch";
import { DoctorPersonalDetails } from "../../../doctors/DoctorPersonalDetails";

const AppointmentsPage = () => {
  return (
    <Routes>
      <Route index element={<DoctorSearch />} />

      <Route path="doctor/:slug" element={<DoctorPersonalDetails />} />
    </Routes>
  );
};

export default AppointmentsPage;