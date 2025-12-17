import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./components/DoctorCalendarComponent.css";
import {
  getAllWorkDays,
  updateWorkingHours,
  setDayOff,
  completeAppointment,
} from "../../../api/doctorApi";
import { PatientAccourdion } from "./components/PatientAccourdion";
import { transformWorkDayToEvents } from "../../utils/calendarUtils";
import { useAuth } from "../../../context/AuthContext";

const DEFAULT_START = "09:00:00";
const DEFAULT_END = "17:00:00";
const CALENDAR_START_RENDER_DATE = "2025-09-01";
const CALENDAR_END_RENDER_DATE = "2026-01-31";

const DoctorCalendarComponent = () => {
  const [dayEvents, setDayEvents] = useState([]);
  const [nonWorkingDaysEvents, setNonWorkingDaysEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [changedScheduleEvents, setChangedScheduleEvents] = useState([]);
  const [events2, setEvents2] = useState([]);
  const [allWorkDays, setAllWorkDays] = useState([]);
  const [calendarKey, setCalendarKey] = useState(0);

  const { user } = useAuth();

  const handleComplete = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      window.dispatchEvent(new Event("force-stats-update"));

      alert("Успешно приключил преглед!");
      await loadData();
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert(
        "Не успяхте да маркирате прегледа като приключен. Опитайте отново по-късно."
      );
    }
  };

  const loadData = async () => {
    const data = await getAllWorkDays(
      user.id,
      CALENDAR_START_RENDER_DATE,
      CALENDAR_END_RENDER_DATE
    );
    setAllWorkDays([...data]);

    const allEvents = data.flatMap((wd) => transformWorkDayToEvents(wd));
    setEvents2([...allEvents]);

    const nonWorking = data
      .filter((wd) => wd.working === false)
      .map((wd) => {
        const start = wd.date;
        const end = new Date(wd.date);
        end.setDate(end.getDate() + 1);

        return {
          start,
          end: end.toISOString().split("T")[0],
          display: "background",
          backgroundColor: "#ED9A8A",
          allDay: true,
          id: `nonworking-${wd.date}`,
        };
      });
    setNonWorkingDaysEvents([...nonWorking]);

    const changedSchedule = data
      .filter(
        (wd) =>
          wd.working === true &&
          wd.startTime &&
          wd.endTime &&
          (wd.startTime !== DEFAULT_START || wd.endTime !== DEFAULT_END)
      )
      .map((wd) => ({
        start: wd.date,
        end: wd.date,
        display: "background",
        backgroundColor: "#FFB84D",
        allDay: true,
        id: `changed-${wd.date}`,
      }));

    setChangedScheduleEvents([...changedSchedule]);

    setCalendarKey((prev) => prev + 1);
  };
  useEffect(() => {
    if (selectedDate && events2.length > 0) {
      const updatedEvents = events2.filter(
        (ev) => ev.start.slice(0, 10) === selectedDate
      );
      setDayEvents(updatedEvents);
    }
  }, [events2, selectedDate]);
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log("Fetched/Updated Events:", events2);
    console.log("All Work Days Updated:", allWorkDays);
  }, [events2, allWorkDays]);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const eventsForDay = events2.filter(
      (ev) => ev.start.slice(0, 10) === clickedDate
    );
    console.log(eventsForDay);
    setDayEvents(eventsForDay);
  };

  const getSelectedDayInfo = () => {
    const selectedDay = allWorkDays.find((d) => d.date === selectedDate);

    if (!selectedDay) {
      return <p>Няма данни за този ден</p>;
    }

    if (selectedDay.working === false) {
      return <p>Днес е почивен ден</p>;
    }

    const { startTime, endTime } = selectedDay;
    return (
      <p>
        Работни часове: {startTime?.slice(0, 5)} → {endTime?.slice(0, 5)}
      </p>
    );
  };

  const handleSetDayOff = async () => {
    if (!selectedDate) {
      alert("Изберете дата първо!");
      return;
    }

    try {
      await setDayOff(user.id, selectedDate);
      await loadData();
      alert(`Маркирано ${selectedDate} като неработен ден.`);
    } catch (err) {
      console.error(err);
      alert("Не успяхте да маркирате деня като неработен.");
    }
  };

  const handleChangeWorkingHours = async () => {
    if (!selectedDate) {
      alert("Изберете дата първо!");
      return;
    }

    const start = prompt("Въведете първи час (ЧЧ:ММ):", "10:00");
    const end = prompt("Въведете последен час (ЧЧ:ММ):", "15:00");

    if (!start || !end) return;

    try {
      await updateWorkingHours(
        user.id,
        selectedDate,
        `${start}:00`,
        `${end}:00`
      );

      await loadData();
      alert(`Обновени работни часове за ${selectedDate}`);
    } catch (err) {
      console.error(err);
      alert("Не успяхте да обновите работните часове.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        width: "83%",
        margin: "0 auto",
      }}
    >
      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay custom1",
          center: "title",
          end: "custom2 prevYear,prev,next,nextYear",
        }}
        events={[...events2, ...nonWorkingDaysEvents, ...changedScheduleEvents]}
        dateClick={handleDateClick}
        customButtons={{
          custom1: {
            text: "Маркирайте като неработен ден",
            click: handleSetDayOff,
          },
          custom2: {
            text: "Променете часовете",
            click: handleChangeWorkingHours,
          },
        }}
      />

      <div
        style={{
          flex: 1,
          height: "80vh",
          marginTop: "40px",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Събития на {selectedDate ? selectedDate : "—"}
        </h3>

        {getSelectedDayInfo()}

        <PatientAccourdion dayEvents={dayEvents} onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default DoctorCalendarComponent;
