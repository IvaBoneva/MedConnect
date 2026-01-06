import { Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllRegisterRequests } from "../../../api/DoctorRegisterRequestsApi";
import { pendingDoctorsMock } from "../mock data/PendingDoctors";
import { useState } from "react";

const statusVariant = {
  "непотвърден": "warning",
  "потвърден": "success",
  "отхвърлен": "danger",
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState(pendingDoctorsMock);
  const [doctorsReal, setDoctorsReal] = useState(getAllRegisterRequests);
  
  const updateStatus = (id, newStatus) => {
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, status: newStatus } : doc
      )
    );
  };

  return (
    <>
      <h2>Непотвърдени лекари</h2>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Име</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doctor) => {
            const status = doctor.status ?? "непотвърден";

            return (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.firstName} {doctor.lastName}</td>
                <td>{doctor.email}</td>
                <td>
                  <Badge bg={statusVariant[status] || "secondary"}>
                    {status}
                  </Badge>
                </td>
                <td>
                  <Link to={`/admin/doctors/${doctor.id}`}>
                    <Button size="sm" variant="outline-secondary" className="me-2">
                      Детайли
                    </Button>
                  </Link>
                  {status === "непотвърден" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => updateStatus(doctor.id, "потвърден")}
                      >
                        Потвърди
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateStatus(doctor.id, "отхвърлен")}
                      >
                        Отхвърли
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default DoctorsPage;
