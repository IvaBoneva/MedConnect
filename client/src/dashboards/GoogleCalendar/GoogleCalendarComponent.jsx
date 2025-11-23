import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar for React
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin for monthly grid view
import timeGridPlugin from "@fullcalendar/timegrid"; // Plugin for weekly/daily time grid view
import interactionPlugin from "@fullcalendar/interaction"; // Plugin for drag and drop, etc.
import "./GoogleCalendarComponent.css";
import { listEvents } from '../../api/googleApi';

const convertGoogleEvent = (gEvent) => {
  return {
    title: gEvent.summary,
    start: new Date(gEvent.start.dateTime.value).toISOString() || gEvent.start?.date,
    end: new Date(gEvent.end.dateTime.value).toISOString(),
  };
};

const GoogleCalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    listEvents()
      .then((data) => {
        const converted = data?.map((ev) => convertGoogleEvent(ev));

        setEvents(converted);
        console.log(converted);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEventDrop = (info) => {
    const newEventData = {
      ...info.event._def.extendedProps,
      start: info.event.startStr,
      end: info.event.endStr,
    };
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.title === newEventData.title ? newEventData : event
      );
      return updatedEvents;
    });
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        // editable={true}
        nowIndicator={true}
        // droppable={true}
        eventDrop={handleEventDrop}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
};

export default GoogleCalendarComponent;
