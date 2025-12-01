// src/modules/Patient/Appointments.js
import { useState } from "react";
import DoctorSearch from "../../components/DoctorComponents/DoctorSearch";
import DoctorDetails from "../../components/DoctorComponents/DoctorDetails";
const Appointments = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBack = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="container mt-4">
      {!selectedDoctor ? (
        <DoctorSearch onSelectDoctor={handleSelectDoctor} />
      ) : (
        <DoctorDetails doctor={selectedDoctor} onBack={handleBack} />
      )}
    </div>
  );
};

export default Appointments;
