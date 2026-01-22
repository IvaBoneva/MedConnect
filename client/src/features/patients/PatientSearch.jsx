import { PatientSearchLayout } from "./components/PatientSearchLayout";
import { useEffect, useState } from "react";
import { fetchDoctorAppointments } from "../../api/appointmentApi";
import { fetchCompletedPatientAppointments } from "../../api/patientApi";
import { fetchPatientById } from "../../api/patientApi";
import patient1Photo from "../../images/profile.png";

const PatientSearch = ({ doctorId, token, onSelectPatient }) => {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("");
    const [patients, setPatients] = useState([]);

    console.log("PatientSearch render", { doctorId, token });

    useEffect(() => {
        async function loadPatients() {
            if (!doctorId || !token) return;

            try {
                // Вземаме всички завършени appointments на доктора
                const doctorAppointments = await fetchDoctorAppointments(
                    doctorId,
                    "Completed",
                    token,
                );

                const patientMap = {};
                const patientCache = {};

                const patientsData = await Promise.all(
                    doctorAppointments.map(async (appt, index) => {
                        const patient = appt.patient || {};
                        const patientId = appt.patientId;

                        const patient1Id = appt.id;
                        console.log(
                            "patientId:",
                            appt.patientId,
                            "patient1Id:",
                            patient1Id,
                        );

                        if (!patientMap[patientId]) {
                            try {
                                const completedAppointments =
                                    await fetchCompletedPatientAppointments(token, patientId);
                                const patientInfo = completedAppointments[0]?.patient || {};

                                patientMap[patientId] = {
                                    allergies: patientInfo.allergies || patient.allergies || "-",
                                    diseases: patientInfo.diseases || patient.diseases || "-",
                                    disabilities:
                                        patientInfo.disabilities || patient.disabilities || "-",
                                };
                            } catch (err) {
                                console.warn("Could not fetch patient details for", patientId);
                                patientMap[patientId] = {
                                    allergies: patient.allergies || "-",
                                    diseases: patient.diseases || "-",
                                };
                            }
                        }

                        if (!patientCache[patientId]) {
                            try {
                                patientCache[patientId] = await fetchPatientById(
                                    patient1Id,
                                    token,
                                );
                            } catch (err) {
                                console.warn("Could not fetch patient by id", patient1Id);
                                patientCache[patientId] = {};
                            }
                        }
                        const fullPatient = patientCache[patientId];

                        return {
                            id: patientId,
                            photo: patient1Photo,
                            patientId: appt.patientId,
                            fname: appt.patientName || "-",
                            lname: appt.patientSurname || "-",
                            allergies: patientMap[patientId].allergies,
                            diseases: patientMap[patientId].diseases,
                            disabilities: patientMap[patientId].disabilities,
                            feedback: appt.feedback || "",
                            rating: appt.rating || "",
                            startTime: appt.startTime,
                            email: fullPatient.email,
                            phone: fullPatient.phoneNumber,
                            age: fullPatient.age,
                            visit: {
                                date: appt.startTime,
                                feedback: appt.feedback,
                                rating: appt.rating,
                            },
                        };
                    }),
                );

                const grouped = {};

                patientsData.forEach((p) => {
                    if (!grouped[p.patientId]) {
                        grouped[p.patientId] = {
                            ...p,
                            visits: [],
                        };
                    }

                    grouped[p.patientId].visits.push({
                        date: p.startTime,
                        feedback: p.feedback,
                        rating: p.rating ?? "-",
                    });
                    console.log("Groped files:", grouped);
                });

                setPatients(Object.values(grouped));
            } catch (err) {
                console.error("Failed to load patients", err);
            }
        }

        if (doctorId && token) {
            loadPatients();
        }
    }, [doctorId, token]);

    const filteredPatients = patients
        .filter((patient) =>
            (patient.fname + " " + patient.lname)
                .toLowerCase()
                .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
            if (sort === "age") return a.age - b.age;
            if (sort === "fname") return a.fname.localeCompare(b.fname);
            if (sort === "lname") return a.lname.localeCompare(b.lname);
            return 0;
        });

    return (
        <PatientSearchLayout
            query={query}
            setQuery={setQuery}
            sort={sort}
            setSort={setSort}
            filteredPatients={filteredPatients}
            onSelectPatient={onSelectPatient}
        />
    );
};

export default PatientSearch;