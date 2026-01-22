import { Button, Image, Table } from "react-bootstrap";
import { FileDown, FileText, Printer } from "lucide-react";

export const PatientDetailsLayout = ({
                                         patient,
                                         onBack,
                                         files,
                                         handleDownload,
                                         handlePrint,
                                         isPreviewable,
                                     }) => {
    const visits = patient?.visits ?? [];
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
            <div className="mb-4">
                <h5>📅 Предишни посещения</h5>

                {visits.length === 0 ? (
                    <p>Няма предишни посещения.</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Обратна връзка</th>
                            <th>Оценка</th>
                        </tr>
                        </thead>

                        <tbody>
                        {patient.visits.map((visit, index) => (
                            <tr key={index}>
                                <td>{new Date(visit.date).toLocaleString()}</td>
                                <td>{visit.feedback || "-"}</td>
                                <td>{visit.rating || "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    );
};