import { useState } from "react";
import { Table, Button, Badge, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usersMock } from "../mock data/Users";

const roleVariant = {
  PATIENT: "primary",
  DOCTOR: "success",
  GUARDIAN: "warning",
};

// mapping на английските роли към български
const roleLabel = {
  PATIENT: "Пациент",
  DOCTOR: "Лекар",
  GUARDIAN: "Настойник",
};

const subscriptionVariant = {
  FREE: "secondary",
  STANDARD: "info",
  PREMIUM: "success",
};

const UsersPage = () => {
  const [users, setUsers] = useState(usersMock);

  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const upgradeSubscription = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (
          u.id === id &&
          u.subscription &&
          u.subscription.paidFor &&
          u.subscription.active !== u.subscription.paidFor
        ) {
          return {
            ...u,
            subscription: {
              ...u.subscription,
              active: u.subscription.paidFor,
            },
          };
        }
        return u;
      })
    );
  };

  const changeRole = (id, newRoles) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, roles: newRoles } : u))
    );
  };

  const isDoctor = (user) => user.roles.includes("DOCTOR");

  return (
    <>
      <h2>Потребители</h2>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Име</th>
            <th>Email</th>
            <th>Роли</th>
            <th>Статус</th>
            <th>Абонамент</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const sub = user.subscription;

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>

                {/* Роли */}
                <td>
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge
                        key={role}
                        bg={roleVariant[role] || "secondary"}
                        className="me-1"
                      >
                        {roleLabel[role] || role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">— Няма зададена роля —</span>
                  )}
                </td>

                {/* Статус на профила */}
                <td>
                  <Badge bg={user.isActive ? "success" : "danger"}>
                    {user.isActive ? "Активен" : "Блокиран"}
                  </Badge>
                </td>

                {/* Абонамент */}
                <td>
                  {!isDoctor(user) && sub ? (
                    <>
                      <Badge bg={subscriptionVariant[sub.active]}>
                        {sub.active}
                      </Badge>

                      {sub.paidFor && sub.paidFor !== sub.active && (
                        <>
                          {" "}→{" "}
                          <Badge bg={subscriptionVariant[sub.paidFor]}>
                            {sub.paidFor}
                          </Badge>
                        </>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Действия */}
                <td className="d-flex gap-1 flex-wrap">
                  <Link to={`/admin/users/${user.id}`}>
                    <Button size="sm" variant="outline-secondary">
                      Детайли
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant={user.isActive ? "warning" : "success"}
                    onClick={() => toggleActive(user.id)}
                  >
                    {user.isActive ? "Блокирай" : "Активирай"}
                  </Button>

                  {/* Смяна на абонамент */}
                  {!isDoctor(user) &&
                    sub?.paidFor &&
                    sub.active !== sub.paidFor && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => upgradeSubscription(user.id)}
                      >
                        Смяна към {sub.paidFor}
                      </Button>
                    )}

                  {/* Смяна на роля - само за непотребители */}
                  {!isDoctor(user) && (
                    <Dropdown>
                      <Dropdown.Toggle size="sm" variant="outline-primary">
                        Смяна на роля
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => changeRole(user.id, ["PATIENT"])}
                        >
                          Само Пациент
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => changeRole(user.id, ["GUARDIAN"])}
                        >
                          Само Настойник
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => changeRole(user.id, ["PATIENT", "GUARDIAN"])}
                        >
                          И двете
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}

                  <Button size="sm" variant="outline-danger" disabled>
                    Изтрий
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default UsersPage;
