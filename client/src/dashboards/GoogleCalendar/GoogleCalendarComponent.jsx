import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';  // Import FullCalendar for React
import dayGridPlugin from '@fullcalendar/daygrid';  // Plugin for monthly grid view
import timeGridPlugin from '@fullcalendar/timegrid';  // Plugin for weekly/daily time grid view
import interactionPlugin from '@fullcalendar/interaction';  // Plugin for drag and drop, etc.
import "./GoogleCalendarComponent.css";


const GoogleCalendarComponent = () => {
  const [events, setEvents] = useState([
    { title: 'All Day Event', date: '2025-11-01' },
    { title: 'Long Event', start: '2025-11-07', end: '2025-11-10' },
    { title: 'Repeating Event', start: '2025-11-09T16:00:00' },
    { title: 'Conference', start: '2025-11-12T10:30:00', end: '2025-11-12T12:30:00' },
    { title: 'Birthday Party', start: '2025-11-18T07:00:00' },
  ]);

  const handleEventDrop = (info) => {
    const newEventData = { ...info.event._def.extendedProps, start: info.event.startStr, end: info.event.endStr };
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
        editable={true}
        nowIndicator={true}
        droppable={true}  
        eventDrop={handleEventDrop}  
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </div>
  );
};

export default GoogleCalendarComponent;
