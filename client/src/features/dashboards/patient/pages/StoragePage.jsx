import { useState, useEffect, useRef } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";

const StoragePage = ({ userId }) => {
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
            const entry = { id, name: file.name, size: file.size, type: file.type, date: new Date().toLocaleDateString(), content: URL.createObjectURL(file) };
            setFiles((prev) => [...prev, entry]);
            setNewFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (completedFiles === totalFiles) setTimeout(() => setUploadProgress(0), 300);
          }
          return newValue;
        });
      }, 120);
    });
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
      e.preventDefault(); setIsDragging(false);
      if(e.dataTransfer.files.length > 0) {
          setNewFiles(e.dataTransfer.files);
          setDroppedFilesNames(Array.from(e.dataTransfer.files).map(f => f.name));
          setDropSuccess(true); setTimeout(() => setDropSuccess(false), 800);
      }
  };

  const handleRemove = (id) => setFiles(files.filter(f => f.id !== id));

  return (
    <Container className="py-5">
      <h3 className="mb-4" style={{ color: "#2E8B57" }}>📁 Хранилище</h3>
      <div onDragOver={handleDragOver} onDrop={handleDrop} style={{ border: "3px dashed #2E8B57", padding: "30px", marginBottom: "20px" }}>
          {isDragging ? "Пуснете тук..." : "Издърпайте файлове..."}
      </div>
      <Form className="mb-3 d-flex">
          <Form.Control type="file" multiple ref={fileInputRef} onChange={(e) => setNewFiles(e.target.files)} />
          <Button variant="success" className="ms-2" onClick={handleUpload} disabled={!newFiles.length}>Качване</Button>
      </Form>
      {files.map(file => (
          <div key={file.id}>{file.name} <Button variant="danger" size="sm" onClick={() => handleRemove(file.id)}>X</Button></div>
      ))}
    </Container>
  );
};

export default StoragePage;