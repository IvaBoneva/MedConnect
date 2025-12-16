import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchPatientAppointments,
  fetchPrescriptionEvents,
} from "../../../../api/patientApi"; 

const PatientCalendarComponent = () => {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [backgroundEvents, setBackgroundEvents] = useState([]);
  const [prescriptionEvents, setPrescriptionEvents] = useState([]); 

  const loadAppointments = async () => {
    try {
      const appointments = await fetchPatientAppointments(token, user.id);
      const formattedAppointments = appointments.map((appointment) => ({
        title: `Appointment with Dr. ${appointment.doctor.lastName}`,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: "green", 
      }));

      setEvents(formattedAppointments);

      const backgroundAppointments = appointments.map((appointment) => ({
        start: appointment.start.split("T")[0], 
        display: "background",
        backgroundColor: "yellow", 
      }));

      setBackgroundEvents(backgroundAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const loadPrescriptionEvents = async () => {
    try {
      const prescriptions = await fetchPrescriptionEvents(user.id, token); 
      const formattedPrescriptionEvents = prescriptions.map((event) => ({
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        backgroundColor: "blue",
      }));

      setPrescriptionEvents(formattedPrescriptionEvents);

      const backgroundPrescriptionEvents = prescriptions.map((event) => ({
        start: event.startDateTime.split("T")[0],
        display: "background",
        backgroundColor: "lightgreen",
      }));

      setBackgroundEvents((prev) => [...prev, ...backgroundPrescriptionEvents]);
    } catch (error) {
      console.error("Error fetching prescription events:", error);
    }
  };

  useEffect(() => {
    loadAppointments(); 
    loadPrescriptionEvents(); 


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
    }, 1000);
        return () => clearTimeout(timer);

  }, [token, user?.id]);


  
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        width: "80%",
        margin: "0 auto",
      }}
    >
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
        events={[...backgroundEvents, ...events, ...prescriptionEvents]}
      />

    </div>

 
  );
};

export default PatientCalendarComponent;
