import { Container, Table, Button, Form } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "../../../../api/cloudinaryApi";
import { useAuth } from "../../../../context/AuthContext";
import {
  deleteFileFromDatabase,
  fetchFiles,
  saveFileToDatabase,
} from "../../../../api/storageApi";
import fileDownload from "js-file-download";

/* helper – премахва дубликати */
const mergeUniqueFiles = (prev, next) => {
  const map = new Map();
  [...prev, ...next].forEach((file) => {
    map.set(file.name + file.size, file);
  });
  return Array.from(map.values());
};

const StoragePage = () => {
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [droppedFilesNames, setDroppedFilesNames] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dropSuccess, setDropSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    fetchFiles(user.id, token).then(setFiles);
  }, [user, token]);

  /* ================= DRAG & DROP ================= */

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

    const dropped = Array.from(e.dataTransfer.files);
    if (!dropped.length) return;

    setNewFiles((prev) => mergeUniqueFiles(prev, dropped));
    setDroppedFilesNames((prev) => [
      ...new Set([...prev, ...dropped.map((f) => f.name)]),
    ]);

    setDropSuccess(true);
    setTimeout(() => setDropSuccess(false), 800);
  };

  /* ================= FILE SELECT ================= */

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    setNewFiles((prev) => mergeUniqueFiles(prev, selected));
    setDroppedFilesNames((prev) => [
      ...new Set([...prev, ...selected.map((f) => f.name)]),
    ]);
  };

  /* ================= UPLOAD ================= */

  const handleUpload = async () => {
    if (!newFiles.length) return;

    const total = newFiles.length;
    let completed = 0;
    setUploadProgress(0);

    for (const file of newFiles) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        if (!cloudinaryUrl) throw new Error("Upload failed");

        const entry = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          dateOfUpload: new Date().toISOString().split("T")[0],
          fileCloudinaryUrl: cloudinaryUrl,
        };

        await saveFileToDatabase(entry, user.id, token);
        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      } catch (err) {
        console.error(err);
        alert("Грешка при качване");
      }
    }

    const refreshed = await fetchFiles(user.id, token);
    setFiles(refreshed);

    setNewFiles([]);
    setDroppedFilesNames([]);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= ACTIONS ================= */

  const handleDownload = (file) => {
    const url = file.fileCloudinaryUrl.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );
    window.location.href = url;
  };

  const handlePrint = (file) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const isImage = file.type?.startsWith("image/");

  if (isImage) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img {
              max-width: 100%;
              max-height: 100%;
            }
          </style>
        </head>
        <body>
          <img src="${file.fileCloudinaryUrl}" onload="window.print()" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

  const handleRemove = async (fileId) => {
    await deleteFileFromDatabase(fileId, token);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const isPreviewable = (type) =>
    type?.startsWith("image/") || type === "application/pdf";

  /* ================= UI ================= */

  return (
    <Container className="py-5">
      <h3 className="mb-4" style={{ color: "#2E8B57" }}>
        📁 Хранилище
      </h3>

      {/* DRAG & DROP */}
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
            ? "rgba(46,139,87,0.25)"
            : isDragging
            ? "rgba(46,139,87,0.12)"
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
        ) : droppedFilesNames.length ? (
          <>
            <h5 style={{ color: "#2E8B57" }}>Добавени файлове:</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {droppedFilesNames.map((n, i) => (
                <li key={i} style={{ color: "#2E8B57", fontSize: "14px" }}>
                  {n}
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

      {/* FILE INPUT */}
      <Form className="mb-3 d-flex">
        <Form.Control
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <Button
          variant="success"
          className="ms-2"
          onClick={handleUpload}
          disabled={!newFiles.length}
        >
          Качване
        </Button>
      </Form>

      {/* PROGRESS */}
      {uploadProgress > 0 && (
        <div className="mb-4">
          <h6>Качване... {uploadProgress}%</h6>
          <div
            style={{
              height: "10px",
              background: "#dcdcdc",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#2E8B57",
              }}
            />
          </div>
        </div>
      )}

      {/* TABLE */}
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
                <td>{file.dateOfUpload}</td>
                <td className="d-flex gap-2 align-items-center">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleDownload(file)}
                  >
                    <FileDown size={16} />
                  </Button>

                  {isPreviewable(file.type) && (
                    <>
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          window.open(file.fileCloudinaryUrl, "_blank")
                        }
                      >
                        <FileText size={16} />
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => handlePrint(file)}
                      >
                        <Printer size={16} />
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemove(file.id)}
                  >
                    ❌
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StoragePage;
