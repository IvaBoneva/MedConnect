import { useEffect, useState } from "react";
import { PatientDetailsLayout } from "./components/PatientDetailsLayout";
import { fetchFiles } from "../../api/storageApi";
import { useAuth } from "../../context/AuthContext";

const PatientDetails = ({ patient, onBack }) => {
    const [files, setFiles] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        console.log("Current patient object:", patient);
        console.log("patient.patientId:", patient?.patientId);
        if (!patient?.id || !token) return;

        const loadFiles = async () => {
            try {
                const data = await fetchFiles(patient?.patientId, token);

                // Преобразуваме към очаквания формат
                const mappedFiles = data.map((f) => ({
                    id: f.id,
                    name: f.name,
                    type: f.type,
                    size: f.size,
                    date: f.dateOfUpload, // тук dateOfUpload
                    content: f.fileCloudinaryUrl, // тук fileCloudinaryUrl
                }));

                console.log("Mapped files:", mappedFiles);
                setFiles(mappedFiles);
            } catch (err) {
                console.error("Неуспешно зареждане на файловете:", err);
                setFiles([]);
            }
        };

        loadFiles();
    }, [patient, token]);

    const handleDownload = (file) => {
        if (!file.content) return;
        const link = document.createElement("a");
        link.href = file.content;
        link.download = file.name;
        link.click();
    };

    const handlePrint = async (file) => {
        try {
            let fileURL = file.content;

            if (!fileURL && file.rawFile) {
                fileURL = URL.createObjectURL(file.rawFile);
            }

            if (!fileURL) return;

            const win = window.open(fileURL, "_blank");
            win?.focus();
            win?.print();
        } catch (err) {
            console.error("Не може да се принтира:", err);
        }
    };

    const isPreviewable = (type) =>
        type.startsWith("image/") || type === "application/pdf";

    return (
        <PatientDetailsLayout
            patient={patient}
            onBack={onBack}
            files={files}
            handleDownload={handleDownload}
            handlePrint={handlePrint}
            isPreviewable={isPreviewable}
        />
    );
};

export default PatientDetails;