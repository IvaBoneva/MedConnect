import { useState } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usersMock } from "../mock data/Users";

const roleVariant = {
  PATIENT: "primary",
  DOCTOR: "success",
  GUARDIAN: "warning",
};

const UsersPage = () => {
  const [users, setUsers] = useState(usersMock);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <>
      <h2>Потребители</h2>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Име</th>
            <th>Email</th>
            <th>Роля</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>
                <Badge bg={roleVariant[user.role]}>{user.role}</Badge>
              </td>
              <td>{user.isActive ? "Активен" : "Блокиран"}</td>
              <td>
                <Link to={`/admin/users/${user.id}`}>
                  <Button size="sm" variant="outline-secondary" className="me-2">
                    Детайли
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant={user.isActive ? "outline-danger" : "outline-success"}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.isActive ? "Блокирай" : "Активирай"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsersPage;
