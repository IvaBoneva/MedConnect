import { useEffect, useState } from "react";
import { PatientDetailsLayout } from "./components/PatientDetailsLayout";

const importAllImages = (r) =>
  r.keys().map((key, idx) => ({
    id: idx + 1,
    name: key.replace("./", ""),
    type: "image/jpeg",
    size: 100000, 
    date: "15.11.2025",
    content: r(key),
  }));

const PatientDetails = ({ patient, onBack }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    try {
        const imageFiles = importAllImages(
        require.context("../../images", false, /\.(png|jpe?g|gif)$/)
        );
        setFiles(imageFiles);
    } catch (e) {
        console.warn("Images could not be loaded via require.context", e);
    }

    const saved = localStorage.getItem("patient_files");
    if (saved) {
      const savedFiles = JSON.parse(saved);
      setFiles((prev) => [...prev, ...savedFiles]);
    }
  }, []);

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