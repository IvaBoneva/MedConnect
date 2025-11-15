import { useState, useEffect, useRef } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";

const Storage = () => {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem("patient_files");
    return saved ? JSON.parse(saved) : [];
  });

  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null); // добавяме референция към input-а

  useEffect(() => {
    localStorage.setItem("patient_files", JSON.stringify(files));
  }, [files]);

  const handleUpload = () => {
    if (!newFile) return;

    const fileEntry = {
      id: Date.now(),
      name: newFile.name,
      size: newFile.size,
      type: newFile.type,
      date: new Date().toLocaleDateString(),
      content: URL.createObjectURL(newFile),
    };

    setFiles([...files, fileEntry]);
    setNewFile(null);

    // изчистваме input-а след качване
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handleRemove = (fileId) => {
    setFiles(files.filter((f) => f.id !== fileId));

    // изчистваме input-а и тук, за да може да качим същия файл пак
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

      <Form className="mb-3 d-flex">
        <Form.Control
          type="file"
          ref={fileInputRef} // добавяме референцията
          onChange={(e) => setNewFile(e.target.files[0])}
        />
        <Button
          variant="success"
          className="ms-2"
          onClick={handleUpload}
          disabled={!newFile}
        >
          Качване
        </Button>
      </Form>

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
    </Container>
  );
};

export default Storage;
