import { Button, Image, Table } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";
import { useEffect, useState } from "react";

const PatientDetails = ({ patient, onBack }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("patient_files");
    if (saved) {
      setFiles(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Мок файлове
    const mockFiles = [
      {
        id: 1,
        name: "Epikriz.pdf",
        type: "application/pdf",
        size: 240000,
        date: "15.11.2025",
        content:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 2,
        name: "Napravlenie.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 120000,
        date: "15.11.2025",
        content: "",
      },
    ];

    setFiles(mockFiles);
  }, []);

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.content;
    link.download = file.name;
    link.click();
  };

  const handlePrint = async (file) => {
    try {
      let fileURL = file.content;

      // Ако файлът е локален (Blob), създаваме обект URL
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
    <div>
      <Button variant="secondary" onClick={onBack} className="mb-3">
        ← Назад към търсачката
      </Button>

      <div className="p-4 bg-light rounded shadow-sm mb-4 d-flex align-items-center">
        <Image
          src={patient.photo}
          alt={patient.fname + " " + patient.lname}
          rounded
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginRight: "20px",
            borderRadius: "10px",
            border: "3px solid #2E8B57",
            backgroundColor: "#f8f9fa",
          }}
        />
        <div>
          <h4>{patient.fname + " " + patient.lname}</h4>
          <p>{patient.age} години</p>
          <p>🦠 Алергии: {patient.allergies}</p>
          <p>🚑 Заболявания: {patient.diseases}</p>
          <p>♿ Увреждания: {patient.disabilities}</p>
          <p>
            📞 Контакти:
            <br />
            {patient.email}
            <br />
            {patient.phone}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h5>📁 Документи на пациента</h5>

        {files.length === 0 ? (
          <p>Няма качени документи.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Име</th>
                <th>Тип</th>
                <th>Размер</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                  <td>{file.date}</td>

                  <td className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleDownload(file)}
                      title="Изтегли"
                    >
                      <FileDown size={16} />
                    </Button>

                    {isPreviewable(file.type) && (
                      <>
                        <Button
                          variant="outline-secondary"
                          onClick={() => window.open(file.content, "_blank")}
                          title="Преглед"
                        >
                          <FileText size={16} />
                        </Button>

                        <Button
                          variant="outline-success"
                          onClick={() => handlePrint(file)}
                          title="Принтирай"
                        >
                          <Printer size={16} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
