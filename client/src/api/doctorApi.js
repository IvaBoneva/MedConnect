const DOCTOR_API_ENPOINT = "http://localhost:8080/api/user/doctors"

const DOCTOR_ALL_WORKDAYS = "http://localhost:8080/api/calendar/doctor?doctorId=2&from=2025-11-01&to=2025-11-30"



export const getDoctors = async () => {
  try {
    const response = await fetch(DOCTOR_API_ENPOINT);
    const data = await response.json();  // Ensure this returns an array
    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];  // Return an empty array on error
  }
};

export const getDoctorBySlug = async (slug) => {
  try {
    const response = await fetch(`${DOCTOR_API_ENPOINT}/${slug}`);
    if (!response.ok) {
      throw new Error("Doctor not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return null;
  }
};

export const getAllWorkDays = async () => {
    try {
        const response = await fetch(DOCTOR_ALL_WORKDAYS);  // Wait for fetch to resolve
        const data = await response.json();  // Wait for the data to be parsed
        console.log("Fetched Work Days:", data);
        return data
    } catch (error) {
        console.error("Error fetching work days:", error);
    }
}

export async function setDayOff(doctorId, date) {
  const res = await fetch(
    `http://localhost:8080/api/calendar/doctor/off?doctorId=${doctorId}&date=${date}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to set day off");
  return res.text();
}



export async function updateWorkingHours(doctorId, date, startTime, endTime) {
  const body = {
    date: date,
    overrideStartTime: startTime,
    overrideEndTime: endTime,
    working: true, // Assuming the doctor is working on this day after modifying the time
  };

  const res = await fetch(`http://localhost:8080/api/calendar/doctor/${doctorId}/exception`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update working hours");
  return res.text();
}   


