import { Button, Image } from "react-bootstrap";
import DoctorReviews from "./DoctorReviews";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllWorkDays, getDoctorBySlug } from "../../api/doctorApi";
import { WorkingHoursGrid } from "./WorkingHoursGrid";

// new page for doctor
export const DoctorNewPersonalDetails = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/dashboard/patient/appointments`);
  };

//   doctor will be loaded through slug
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [calendar, setCalendar] = useState([]); // Store the doctor's workdays
  const [loading, setLoading] = useState(false);

  const refreshCalendar = async () => {
    const updatedDays = await getAllWorkDays();
    setCalendar(updatedDays);
  };

//   plots time slots of 30 minutes each HARDCODED
  const generateTimeSlots = (start, end, appointments) => {
    if (!start || !end) return [];

    const slots = [];
    let current = start.slice(0, 5);
    const endTime = end.slice(0, 5);

    const toMinutes = (t) => {
      const [h, m] = t.split(":");
      return +h * 60 + +m;
    };

    while (toMinutes(current) < toMinutes(endTime)) {
      const next =
        new Date(0, 0, 0, ...current.split(":")).getTime() + 30 * 60000;
      const nextStr = new Date(next).toTimeString().slice(0, 5);

      const blocked = appointments?.some(
        (a) => a.start.slice(0, 5) === current
      );

      if (!blocked) slots.push(current);

      current = nextStr;
    }

    return slots;
  };

  
  const transformedCalendar = calendar.map((day) => {
    const dateObj = new Date(day.date);

    const weekdayNames = [
      "неделя",
      "понеделник",
      "вторник",
      "сряда",
      "четвъртък",
      "петък",
      "събота",
    ];

    return {
      weekday: weekdayNames[dateObj.getDay()],
      date: day.date.split("-").reverse().join("."),
      hours: day.working
        ? generateTimeSlots(day.startTime, day.endTime, day.appointments)
        : [],
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Load doctor
        const doctorData = await getDoctorBySlug(slug);
        setDoctor(doctorData);

        // 2. Load calendar automatically
        const workdays = await getAllWorkDays();
        setCalendar(workdays);
      } catch (err) {
        console.error("Error loading page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Button variant="secondary" className="mb-3" onClick={handleBack}>
        ← Назад към търсачката
      </Button>

      <div className="p-4 bg-light rounded shadow-sm mb-4 d-flex align-items-center">
        {/* Снимка на лекаря */}
        <Image
          src={doctor.photo}
          alt={"Д-р " + doctor.fname + " " + doctor.lname}
          rounded
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginRight: "20px",
            borderRadius: "10px",
            border: "3px solid #2E8B57",
            backgroundColor: "#f8f9fa",
            overflow: "hidden",
          }}
        />

        <div>
          <h4>{"Д-р " + doctor.firstName + " " + doctor.lastName}</h4>
          <p>{doctor.specialization}</p>
          <p>⭐ {doctor.rating}</p>
          <p>📍 {doctor.city}</p>
          <p>🏥 {doctor.hospital}</p>
          <p>🩺 Опит: {doctor.yearsOfExperience} години</p>
          <p>
            📞 Контакти:
            <br />
            {doctor.email}
            <br />
            {doctor.phone}
          </p>
        </div>
      </div>

      {calendar.length > 0 && (
        <WorkingHoursGrid
          days={transformedCalendar}
          onSelect={(date, hour) => alert(`Selected: ${date} at ${hour}`)}
          refreshCalendar={refreshCalendar}
        />
      )}

      <DoctorReviews doctorId={doctor.id} />
    </>
  );
};
