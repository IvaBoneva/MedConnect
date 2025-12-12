import { Container, Table, Button, Form } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "../../api/cloudinaryApi";
import { useAuth } from "../../context/AuthContext";
import {
  deleteFileFromDatabase,
  fetchFiles,
  saveFileToDatabase,
} from "../../api/storageApi";
import fileDownload from "js-file-download";

const StoragePage = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFilesNames, setDroppedFilesNames] = useState([]);
  const [dropSuccess, setDropSuccess] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchFiles(user.id, token).then((fetchedFiles) => {
      setFiles(fetchedFiles); // Update the state with the fetched files
    });
  }, []);

  const handleUpload = async () => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const totalFiles = filesArray.length;
    let completedFiles = 0;

    // Reset progress before starting the upload
    setUploadProgress(0);

    filesArray.forEach(async (file) => {
      const id = Date.now() + Math.random();

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newValue = Math.min(prev + 10 / totalFiles, 100);

          if (newValue === 100) {
            clearInterval(interval);
            completedFiles++;
          }

          return newValue;
        });
      }, 120);

      try {
        // Upload the file to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);
        if (!cloudinaryUrl) throw new Error("Upload failed, please try again."); // If cloudinaryUrl is null, throw error

        const localDate = new Date().toISOString().split("T")[0]; // "yyyy-MM-dd" format

        // Collect file metadata
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2); // Size in KB, with 2 decimal places
        const fileType = file.type;

        const entry = {
          id,
          name: fileName,
          size: fileSize, // Size in KB
          type: fileType,
          dateOfUpload: localDate,
          fileCloudinaryUrl: cloudinaryUrl, // Cloudinary URL
        };

        // Save the file info to the database
        await saveFileToDatabase(entry, user.id, token);

        // Add the file to the files state
        setFiles((prevFiles) => [...prevFiles, entry]);

        // Reset the file input state
        setNewFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input

        // If all files have completed, reset the progress bar
        if (completedFiles === totalFiles) {
          setTimeout(() => setUploadProgress(0), 300); // Reset progress bar after all files are uploaded
        }

        // Re-fetch the files to update the UI
        fetchFiles(user.id, token).then((fetchedFiles) => {
          setFiles(fetchedFiles);
        });
      } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        alert(`Upload failed: ${error.message}`);

        // Reset progress to 0 if there's an error
        setUploadProgress(0); // Ensure the progress resets to 0 if there's an error
      }
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

  //   const handleDownload = (url, filename) => {
  //     fetch(url)
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.blob(); // Convert the response to a blob
  //         }
  //         throw new Error("Failed to download file");
  //       })
  //       .then((blob) => {
  //         fileDownload(blob, filename); // Trigger the file download
  //       })
  //       .catch((error) => {
  //         console.error("Error downloading the file:", error);
  //       });
  //   };

  const handleDownload = (file) => {
    const url = file.fileCloudinaryUrl; // Use the Cloudinary file URL
    const filename = file.name; // The name of the file you want to download

    fetch(url)
      .then((response) => response.blob()) // Fetch the file as a blob
      .then((blob) => {
        fileDownload(blob, filename); // Trigger the download
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };

const handlePrint = (file) => {
  const fileURL = file.fileCloudinaryUrl;

  // If it's an image, open it in a new window and print it
  const isImage = file.type?.startsWith("image/");

  if (isImage) {
    // Open the image in a new window
    const printWindow = window.open("", "_blank");

    // Create a temporary HTML content with the image and a print button
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Image</title>
          <style>
            body {
              text-align: center;
              margin: 0;
            }
            img {
              max-width: 100%;
              max-height: 90vh;
              object-fit: contain;
              margin-top: 20px;
            }
            @media print {
              body {
                margin: 0;
              }
              img {
                width: 100%;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <img id="imageToPrint" src="${fileURL}" alt="Image for printing" style="max-width: 100%; max-height: 90vh; object-fit: contain;" />
        </body>
      </html>
    `);

    // Wait for the image to load before printing
    const image = printWindow.document.getElementById("imageToPrint");

    image.onload = () => {
      // After the image is loaded, trigger the print dialog
      printWindow.focus();
      printWindow.print();

      // Close the print window after printing
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };

    // In case the image fails to load (error handling)
    image.onerror = () => {
      console.error("Failed to load the image for printing.");
      printWindow.close();
    };
  } else if (file.type === "application/pdf") {
    // For PDF files, open in the browser viewer
    const printWindow = window.open(fileURL, "_blank");
    printWindow.focus();
    printWindow.print();
  } else {
    console.error("Unsupported file type for printing:", file.type);
  }
};

  const handleRemove = async (fileId) => {
    try {
      // Call delete function from fileApi.js
      const successMessage = await deleteFileFromDatabase(fileId, token);
      alert(successMessage); // Show success message

      // Remove the file from the state to update the UI
      setFiles(files.filter((f) => f.id !== fileId));

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.error("Error deleting the file:", error);
      alert("Failed to delete the file");
    }
  };

  const isPreviewable = (type) =>
    type?.startsWith("image/") || type === "application/pdf";

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
      {/* 
      <Button
        onClick={() => {
          console.log(files);
        }}
      >
        I want files niggas
      </Button> */}

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

      {/* PROGRESS BAR */}
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

      {/* FILE TABLE */}
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
                    title="Изтегли"
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
      {/* {files.some((file) => file.type.startsWith("image/")) && (
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
      )} */}
    </Container>
  );
};

export default StoragePage;
