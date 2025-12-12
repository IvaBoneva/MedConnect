import { useState } from "react";
import { PatientSearchLayout } from "./components/PatientSearchLayout";
import patient1 from "../../images/patient1.jpg";
import patient2 from "../../images/patient2.jpg";
import patient3 from "../../images/patient3.jpg";

const mockPatients = [
  {
    id: 1,
    photo: patient3,
    fname: "Ивана",
    lname: "Петрова",
    age: 36,
    email: "petrovа@example.com",
    phone: "0887642143",
    allergies: "Полени",
    diseases: "Хипертония",
    disabilities: "Няма",
  },
  {
    id: 2,
    photo: patient2,
    fname: "Мария",
    lname: "Георгиева",
    age: 40,
    email: "karina_d@example.com",
    phone: "0887561422",
    allergies: "Прах",
    diseases: "Няма",
    disabilities: "Слепота",
  },
  {
    id: 3,
    photo: patient1,
    fname: "Николай",
    lname: "Костов",
    age: 51,
    email: "nikkostov@example.com",
    phone: "0888646913",
    allergies: "Полени",
    diseases: "Няма",
    disabilities: "Няма",
  },
];

const PatientSearch = ({ onSelectPatient }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");

  const filteredPatients = mockPatients
    .filter((patient) =>
      (patient.fname + " " + patient.lname)
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "age") return a.age - b.age;
      if (sort === "fname") return a.fname.localeCompare(b.fname);
      if (sort === "lname") return a.lname.localeCompare(b.lname);
      return 0;
    });

  return (
    <PatientSearchLayout
      query={query}
      setQuery={setQuery}
      sort={sort}
      setSort={setSort}
      filteredPatients={filteredPatients}
      onSelectPatient={onSelectPatient}
    />
  );
};

export default PatientSearch;