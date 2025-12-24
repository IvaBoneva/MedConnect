const DOCTOR_API_ENPOINT = "http://localhost:8080/api/user/doctors";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDateRange() {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 30);

  return {
    from: formatDate(today),
    to: formatDate(future),
  };
}

export const getDoctors = async () => {
  try {
    const res = await fetch(DOCTOR_API_ENPOINT);
    if (!res.ok) throw new Error("Failed to fetch doctors");

    const doctors = await res.json();
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
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

export const getAllWorkDays = async (doctorId, startDate, endDate) => {
  try {
    const url = `http://localhost:8080/api/calendar/doctor?doctorId=${doctorId}&from=${startDate}&to=${endDate}`;

    const response = await fetch(url); 
    const data = await response.json(); 
    console.log("Fetched Work Days:", data);
    return data;
  } catch (error) {
    console.error("Error fetching work days:", error);
  }
};

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
    working: true, 
  };

  const res = await fetch(
    `http://localhost:8080/api/calendar/doctor/${doctorId}/exception`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error("Failed to update working hours");
  return res.text();
}

export const completeAppointment = async (appointmentId) => {
  const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text(); 
    console.error("Server Error:", errorMessage); 
    throw new Error(errorMessage || "Failed to complete appointment");
  }
  return await response.text();
};
