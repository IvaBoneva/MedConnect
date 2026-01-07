import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const AppointmentsCalendar = ({ appointments }) => {
  const [events, setEvents] = useState([]);
  const [backgroundEvents, setBackgroundEvents] = useState([]);

  useEffect(() => {
    if (!Array.isArray(appointments)) {
      console.error("Appointments is empty or not an array!", appointments);
      return;
    }

    console.log("Raw appointments prop:", appointments);

    const formattedAppointments = appointments.map((appointment) => ({
      title: `Преглед: ${appointment.patient} при Д-р ${appointment.doctor}`,
      start: appointment.start,
      end: appointment.end,
      backgroundColor: "green",
    }));

    const backgroundAppointments = appointments.map((appointment) => ({
      start: appointment.start.split("T")[0],
      display: "background",
      backgroundColor: "yellow",
    }));

    setEvents(formattedAppointments);
    setBackgroundEvents(backgroundAppointments);

    // Корекция на стилове на събитията
    const timer = setTimeout(() => {
      const eventTitles = document.querySelectorAll(".fc-event-title");
      eventTitles.forEach((eventTitle) => {
        eventTitle.style.whiteSpace = "normal";
        eventTitle.style.wordWrap = "break-word";
        eventTitle.style.fontSize = "12px";
        eventTitle.style.maxWidth = "150px";
        eventTitle.style.overflow = "hidden";
        eventTitle.style.textOverflow = "ellipsis";
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [appointments]);

  return (
    <div style={{ backgroundColor: "white", padding: "10px", width: "80%", margin: "0 auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "prevYear,prev,next,nextYear",
        }}
        footerToolbar={{
          start: "",
          center: "",
          end: "prev,next",
        }}
        events={[...backgroundEvents, ...events]}
      />
    </div>
  );
};

export default AppointmentsCalendar;
