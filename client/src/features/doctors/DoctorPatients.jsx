import { useState } from "react";
import PatientSearch from "../patients/PatientSearch";
import PatientDetails from "../patients/PatientDetails";

const DoctorPatients = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const doctorId = user?.id;

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
    };

    const handleBack = () => {
        setSelectedPatient(null);
    };

    console.log("TOKEN:", token);
    console.log("DOCTOR ID:", doctorId);

    return (
        <div className="container mt-4">
            {!selectedPatient ? (
                <PatientSearch
                    doctorId={doctorId}
                    token={token}
                    onSelectPatient={handleSelectPatient}
                />
            ) : (
                <PatientDetails patient={selectedPatient} onBack={handleBack} />
            )}
        </div>
    );
};

export default DoctorPatients;
