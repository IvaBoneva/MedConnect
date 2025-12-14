import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Card, Form } from "react-bootstrap";

const VaccinesAndProfilactics = ({ isPremium, patientAge, userEmail }) => {
  const [vaccines, setVaccines] = useState([]);
  const [profilactics, setProfilactics] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const storageKey = `checkedItems-${userEmail}`; // уникален ключ за текущия потребител

  // Зареждане на отметките при зареждане на компонента
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCheckedItems(JSON.parse(saved)); // само за текущия потребител
    } else {
      setCheckedItems({}); // започваме празно
    }
  }, [storageKey]);

  // Съхраняване на отметките при промяна
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems, storageKey]);

  // Зареждане на ваксини
  useEffect(() => {
    if (isPremium) {
      fetch("/vaccines.json")
        .then((res) => res.json())
        .then((data) => {
          const upcoming = data.filter((v) => v.age >= patientAge);
          setVaccines(upcoming);
        })
        .catch((err) => console.error("Failed to load vaccines:", err));
    }
  }, [isPremium, patientAge]);

  // Зареждане на профилактични прегледи
  useEffect(() => {
    if (isPremium) {
      fetch("/checks.json")
        .then((res) => res.json())
        .then((data) => {
          let groupFiltered;
          if (patientAge < 18) {
            groupFiltered = data.filter((p) => p.age < 18);
          } else {
            groupFiltered = data.filter((p) => p.age >= 18);
          }
          const finalFiltered = groupFiltered.filter(
            (p) => p.age <= patientAge
          );
          setProfilactics(finalFiltered);
        })
        .catch((err) => console.error("Failed to load profilactics:", err));
    }
  }, [isPremium, patientAge]);

  // Обработка на checkbox за отделен елемент
  const handleCheck = (type, age, name) => {
    const key = `${type}-${age}-${name}`; // уникално за тип + възраст + име
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isPremium) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center p-4">
          <h4>🔒 Платена функция</h4>
          <p>
            Имунизационният календар и профилактичните прегледи са достъпни само
            за потребители с активен абонамент.
          </p>
          <Button variant="success" href="/subscriptions">
            Отиди към абонаментите
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4" style={{ color: "#2E8B57" }}>
        Имунизации и профилактични прегледи
      </h3>

      {/* PDF секция */}
      <Card className="mb-5 p-3 shadow-sm text-center">
        <h5 style={{ color: "#2E8B57", marginBottom: "15px" }}>
          Национален имунизационен календар (PDF)
        </h5>
        <Button
          variant="success"
          style={{ borderRadius: "50px", padding: "10px 25px" }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Скрий календара 📄" : "Покажи календара 📄"}
        </Button>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "all 0.7s ease",
            height: showCalendar ? "600px" : "0px",
            opacity: showCalendar ? 1 : 0,
          }}
        >
          <iframe
            src="/vaccination_calendar.pdf"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      </Card>

      {/* Ваксини */}
      <Card className="mb-5 p-3 shadow-sm">
        <h5 style={{ color: "#2E8B57" }}> 💉 Предстоящи ваксини</h5>
        {vaccines.length === 0 ? (
          <p>Няма предстоящи ваксини за вашата възраст.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Възраст</th>
                <th>Ваксини</th>
              </tr>
            </thead>
            <tbody>
              {vaccines.map((v, i) => (
                <tr key={i}>
                  <td>{v.age} години</td>
                  <td>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {v.vaccines.map((vac) => {
                        const key = `vaccine-${v.age}-${vac}`;
                        return (
                          <li key={vac}>
                            <Form.Check
                              type="checkbox"
                              label={vac}
                              checked={!!checkedItems[key]}
                              onChange={() =>
                                handleCheck("vaccine", v.age, vac)
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Профилактични прегледи */}
      <Card className="mb-5 p-3 shadow-sm">
        <h5 style={{ color: "#2E8B57" }}>🩺 Право на профилактични прегледи</h5>
        {profilactics.length === 0 ? (
          <p>Няма налични прегледи за вашата възраст.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Възраст</th>
                <th>Прегледи и изследвания</th>
              </tr>
            </thead>
            <tbody>
              {profilactics.map((p, i) => (
                <tr key={i}>
                  <td>{p.age}+</td>
                  <td>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {p.checks.map((check) => {
                        const key = `check-${p.age}-${check}`;
                        return (
                          <li key={check}>
                            <Form.Check
                              type="checkbox"
                              label={check}
                              checked={!!checkedItems[key]}
                              onChange={() =>
                                handleCheck("check", p.age, check)
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default VaccinesAndProfilactics;
