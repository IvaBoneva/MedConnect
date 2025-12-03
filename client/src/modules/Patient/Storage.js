import { Container, Table, Button, Form } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Storage = ({ userId }) => {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem(`patient_files-${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFilesNames, setDroppedFilesNames] = useState([]);
  const [dropSuccess, setDropSuccess] = useState(false);

  // Запис в localStorage само за текущия user
  useEffect(() => {
    localStorage.setItem(`patient_files-${userId}`, JSON.stringify(files));
  }, [files, userId]);

  const handleUpload = () => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const totalFiles = filesArray.length;
    let completedFiles = 0;

    filesArray.forEach((file) => {
      const id = Date.now() + Math.random();

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newValue = Math.min(prev + 10 / totalFiles, 100);

          if (newValue >= ((completedFiles + 1) / totalFiles) * 100) {
            clearInterval(interval);
            completedFiles++;

            const entry = {
              id,
              name: file.name,
              size: file.size,
              type: file.type,
              date: new Date().toLocaleDateString(),
              content: URL.createObjectURL(file),
            };
            setFiles((prevFiles) => [...prevFiles, entry]);
            setNewFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // ако всички файлове са качени, изчисти прогрес бара
            if (completedFiles === totalFiles) {
              setTimeout(() => setUploadProgress(0), 300);
            }
          }

          return newValue;
        });
      }, 120);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 0) {
      setNewFiles(droppedFiles);

      setDroppedFilesNames(Array.from(droppedFiles).map((f) => f.name));

      setDropSuccess(true);
      setTimeout(() => setDropSuccess(false), 800);
    }
  };

  const handleDownload = (file) => {
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

  const handleRemove = (fileId) => {
    setFiles(files.filter((f) => f.id !== fileId));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isPreviewable = (type) =>
    type.startsWith("image/") || type === "application/pdf";

  return (
    <Container className="py-5">
      <h3 className="mb-4" style={{ color: "#2E8B57" }}>
        📁 Хранилище
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: "3px dashed #2E8B57",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          backgroundColor: dropSuccess
            ? "rgba(46, 139, 87, 0.25)"
            : isDragging
            ? "rgba(46, 139, 87, 0.12)"
            : "white",
          cursor: "pointer",
          transition: "0.3s",
          marginBottom: "20px",
          boxShadow: dropSuccess
            ? "0 0 12px rgba(46,139,87,0.9)"
            : isDragging
            ? "0 0 6px rgba(46,139,87,0.4)"
            : "none",
        }}
      >
        {isDragging ? (
          <h5 style={{ color: "#2E8B57" }}>Пуснете файловете тук…</h5>
        ) : dropSuccess ? (
          <h5 style={{ color: "#2E8B57" }}>Успешно добавени!</h5>
        ) : droppedFilesNames.length > 0 ? (
          <>
            <h5 style={{ color: "#2E8B57" }}>Добавени файлове:</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {droppedFilesNames.map((name, i) => (
                <li key={i} style={{ color: "#2E8B57", fontSize: "14px" }}>
                  {name}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h5 style={{ color: "#2E8B57" }}>
            Издърпайте файлове дотук или използвайте бутона за избор
          </h5>
        )}
      </div>

      <Form className="mb-3 d-flex">
        <Form.Control
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) => setNewFiles(e.target.files)}
        />
        <Button
          variant="success"
          className="ms-2"
          onClick={handleUpload}
          disabled={!newFiles || newFiles.length === 0}
        >
          Качване
        </Button>
      </Form>

      {uploadProgress > 0 && (
        <div className="mb-4">
          <h6>Качване... {Math.round(uploadProgress)}%</h6>
          <div
            style={{
              height: "10px",
              background: "#dcdcdc",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#2E8B57",
                transition: "0.2s",
              }}
            />
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <p>Все още няма документи.</p>
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
                <td className="d-flex gap-2 align-items-center">
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

                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemove(file.id)}
                    title="Премахни"
                  >
                    ❌
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Галерия за изображения */}
      {files.some((file) => file.type.startsWith("image/")) && (
        <div style={{ marginTop: "40px" }}>
          <h4 style={{ color: "#2E8B57", marginBottom: "20px" }}>🖼️ Галерия</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {files
              .filter((f) => f.type.startsWith("image/"))
              .map((img) => (
                <div
                  key={img.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "5px",
                    borderRadius: "10px",
                    background: "white",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onClick={() => window.open(img.content, "_blank")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 10px rgba(46,139,87,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <img
                    src={img.content}
                    alt={img.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginTop: "5px",
                      color: "#2E8B57",
                    }}
                  >
                    {img.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default Storage;
