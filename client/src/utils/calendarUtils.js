

// transform workdays to events of the calendar
// (makes workdays from out DB writeable)
export function transformWorkDayToEvents(workDay) {
  if (!workDay || !workDay.appointments) return [];

  return workDay.appointments
    .map((appt) => {
      const startDate = new Date(`${workDay.date}T${appt.start}`);
      const endDate = new Date(`${workDay.date}T${appt.end}`);

      if (isNaN(startDate) || isNaN(endDate)) {
        console.error(
          `Invalid appointment date or time: ${appt.start} - ${appt.end}`
        );
        return null;
      }

      return {
        id: appt.id,
        title: appt.status === "Free" ? "Free Slot" : `NAME OF PATIENT`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: appt.status === "Free" ? "#4CAF50" : "#2196F3",
        borderColor: "transparent",
        patient: appt.patient ?? null,
        comment: appt.comment,
        status: appt.status,
      };
    })
    .filter((event) => event !== null);
}



export function normalizeDate(d) {
  const [day, month, year] = d.split(".");
  return `${year}-${month}-${day}`;
}

export function splitInTwo(hours) {
  const half = Math.ceil(hours.length / 2);
  return [hours.slice(0, half), hours.slice(half)];
}