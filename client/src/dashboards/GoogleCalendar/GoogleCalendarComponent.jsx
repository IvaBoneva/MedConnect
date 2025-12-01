import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./GoogleCalendarComponent.css";
import { getAllWorkDays, updateWorkingHours, setDayOff } from "../../api/doctorApi";
import { PatientAccourdion } from "./PatientAccourdion";
import { transformWorkDayToEvents } from "../../utils/calendarUtils";


// Default start and end of working day
const DEFAULT_START = "09:00:00";
const DEFAULT_END = "17:00:00";
const DOCTOR_ID = 2; // DR. Gregory House


const GoogleCalendarComponent = () => {
  const [dayEvents, setDayEvents] = useState([]);
  const [nonWorkingDaysEvents, setNonWorkingDaysEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [changedScheduleEvents, setChangedScheduleEvents] = useState([]);
  const [events2, setEvents2] = useState([]);
  const [allWorkDays, setAllWorkDays] = useState([]);

  const loadData = async () => {
    const data = await getAllWorkDays();
    setAllWorkDays(data);

    // loads all days in the calendar
    const allEvents = data.flatMap((wd) => transformWorkDayToEvents(wd));
    setEvents2(allEvents);

    // filtering of non working days - weekends or custom setted
    const nonWorking = data
      .filter((wd) => wd.working === false)
      .map((wd) => ({
        start: wd.date,
        end: wd.date,
        display: "background",
        backgroundColor: "#ED9A8A",
        allDay: true,
        id: `nonworking-${wd.date}`,
      }));
    setNonWorkingDaysEvents(nonWorking);

    // working days with changed schedule (Ex. 11AM - 15PM)
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

    setChangedScheduleEvents(changedSchedule);
  };

  //   fetcs all events from DB
  useEffect(() => {
    loadData();
  }, []);

    useEffect(() => {
    console.log("Fetched/Updated Events:", events2); // log events when they change
    console.log("All Work Days Updated:", allWorkDays); // log all work days when they change
  }, [events2, allWorkDays]); 

  //   handles clicking on day in the calendar
  //   as results plots all events of this day under the calendar if so
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const eventsForDay = events2.filter(
      (ev) => ev.start.slice(0, 10) === clickedDate
    );
    setDayEvents(eventsForDay);
  };

  //   show currently marked working day start - end if so
  const getSelectedDayInfo = () => {
    const selectedDay = allWorkDays.find((d) => d.date === selectedDate);

    if (!selectedDay) {
      return <p>No data for this day</p>;
    }

    if (selectedDay.working === false) {
      return <p>Not working today</p>;
    }

    const { startTime, endTime } = selectedDay;
    return (
      <p>
        Working hours: {startTime?.slice(0, 5)} → {endTime?.slice(0, 5)}
      </p>
    );
  };

  const handleSetDayOff = async () => {
  if (!selectedDate) {
    alert("Select a date first!");
    return;
  }

  try {
    await setDayOff(DOCTOR_ID, selectedDate);
    await loadData(); // reload calendar after update
    alert(`Marked ${selectedDate} as a day off.`);
  } catch (err) {
    console.error(err);
    alert("Failed to set day off.");
  }
};

// changes the working hours of the selected day
const handleChangeWorkingHours = async () => {
  if (!selectedDate) {
    alert("Select a date first!");
    return;
  }

  const start = prompt("Enter start time (HH:MM):", "10:00");
  const end = prompt("Enter end time (HH:MM):", "15:00");

  if (!start || !end) return;

  try {
    // Call the updated API method
    await updateWorkingHours(DOCTOR_ID, selectedDate, `${start}:00`, `${end}:00`);

    // Reload the data to refresh the calendar
    await loadData(); // reload calendar after update

    alert(`Updated working hours for ${selectedDate}`);
  } catch (err) {
    console.error(err);
    alert("Failed to update working hours.");
  }
};

  //   calendar itself
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
          start: "dayGridMonth,timeGridWeek,timeGridDay custom1",
          center: "title",
          end: "custom2 prevYear,prev,next,nextYear",
        }}
        footerToolbar={{
          start: "custom1,custom2",
          center: "",
          end: "prev,next",
        }}
        events={[...events2, ...nonWorkingDaysEvents, ...changedScheduleEvents]}
        dateClick={handleDateClick}
        customButtons={{
          custom1: {
            text: "Set Day Off",
            click: handleSetDayOff,
          },
          custom2: {
            text: "Change Hours",
            click: handleChangeWorkingHours,
          },
        }}
      />

      <div
        style={{
          flex: 1,
          height: "80vh",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Events on {selectedDate ? selectedDate : "—"}
        </h3>

        {/* Show working hours or not */}
        {getSelectedDayInfo()}

        {/* Section for all the selected day patients */}
        <PatientAccourdion dayEvents={dayEvents} />
      </div>
    </div>
  );
};

export default GoogleCalendarComponent;
