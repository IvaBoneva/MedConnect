import { useState } from "react";
import PatientSearch from "../../components/PatientComponents/PatientSearch";
import PatientDetails from "../../components/PatientComponents/PatientDetails";

const DoctorPatients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBack = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="container mt-4">
      {!selectedPatient ? (
        <PatientSearch onSelectPatient={handleSelectPatient} />
      ) : (
        <PatientDetails patient={selectedPatient} onBack={handleBack} />
      )}
    </div>
  );
};

export default DoctorPatients;
