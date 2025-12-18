import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Card, Form } from "react-bootstrap";

const VaccinesAndProfilactics = ({ isPremium, user }) => {
  const [vaccines, setVaccines] = useState([]);
  const [profilactics, setProfilactics] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const storageKey = `checkedItems-${user?.email}`;

  // ВЗИМА ВЪЗРАСТ ОТ СЪРВЪРА И Я ПРАВИ NUMBER
  const effectiveAgeRaw = user?.role === "guardian" ? user?.wardAge : user?.age;

  const effectiveAge = Number(effectiveAgeRaw);

  /* -------------------- LOCAL STORAGE -------------------- */

  useEffect(() => {
    if (!user?.email) return;

    const saved = localStorage.getItem(storageKey);
    setCheckedItems(saved ? JSON.parse(saved) : {});
  }, [storageKey, user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    localStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems, storageKey, user?.email]);

  /* -------------------- FETCH VACCINES -------------------- */

  useEffect(() => {
    if (isPremium || Number.isNaN(effectiveAge)) return;

    fetch("/vaccines.json")
      .then((res) => res.json())
      .then((data) => {
        const upcoming = data.filter((v) => v.age >= effectiveAge);
        setVaccines(upcoming);
      })
      .catch((err) => console.error("Failed to load vaccines:", err));
  }, [isPremium, effectiveAge]);

  /* -------------------- FETCH PROFILACTICS -------------------- */

  useEffect(() => {
    if (isPremium || Number.isNaN(effectiveAge)) return;

    fetch("/checks.json")
      .then((res) => res.json())
      .then((data) => {
        const groupFiltered =
          effectiveAge < 18
            ? data.filter((p) => p.age < 18)
            : data.filter((p) => p.age >= 18);

        const finalFiltered = groupFiltered.filter(
          (p) => p.age <= effectiveAge
        );

        setProfilactics(finalFiltered);
      })
      .catch((err) => console.error("Failed to load profilactics:", err));
  }, [isPremium, effectiveAge]);

  /* -------------------- CHECK HANDLER -------------------- */

  const handleCheck = (type, age, name) => {
    const key = `${type}-${age}-${name}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* -------------------- PAYWALL -------------------- */

  if (isPremium) {
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

  /* -------------------- UI -------------------- */

  return (
    <Container className="py-5">
      <h3 className="mb-4" style={{ color: "#2E8B57" }}>
        Имунизации и профилактични прегледи
      </h3>

      {/* PDF CALENDAR */}
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
            title="Vaccination Calendar"
          />
        </div>
      </Card>

      {/* VACCINES */}
      <Card className="mb-5 p-3 shadow-sm">
        <h5 style={{ color: "#2E8B57" }}>💉 Предстоящи ваксини</h5>
        {vaccines.length === 0 ? (
          <p>Няма предстоящи ваксини за тази възраст.</p>
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

      {/* PROFILACTICS */}
      <Card className="mb-5 p-3 shadow-sm">
        <h5 style={{ color: "#2E8B57" }}>🩺 Право на профилактични прегледи</h5>
        {profilactics.length === 0 ? (
          <p>Няма налични прегледи за тази възраст.</p>
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
