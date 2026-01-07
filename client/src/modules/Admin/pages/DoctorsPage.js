import { Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllRegisterRequests } from "../../../api/adminApi";
import { pendingDoctorsMock } from "../mock data/PendingDoctors";
import { useEffect, useState } from "react";

const statusVariant = {
  "непотвърден": "warning",
  "потвърден": "success",
  "отхвърлен": "danger",
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data once on mount
  useEffect(() => {
    let mounted = true;

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllRegisterRequests(); // expect an array of doctors
        if (!mounted) return;
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        if (mounted) setError("Неуспешно зареждане на лекарите.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = (id, newStatus) => {
    // optimistic UI update
    setDoctors(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, status: newStatus } : doc))
    );

    // optionally persist change to server:
    // (async () => {
    //   try {
    //     await updateRegisterRequestStatus(id, newStatus);
    //   } catch (err) {
    //     console.error("Failed to persist status change:", err);
    //     // optionally revert optimistic update or show error
    //   }
    // })();
  };

  return (
    <>
      <h2>Непотвърдени лекари</h2>

      {error && <div className="text-danger mb-2">{error}</div>}

      {loading ? (
        <div>Зареждане...</div>
      ) : (
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
              const status = doctor?.status ?? "непотвърден";

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
      )}
    </>
  );
};

export default DoctorsPage;
