
export async function createAppointmentRequest(payload, token) {
  const res = await fetch("http://localhost:8080/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Failed to create appointment: " + errorText);
  }

  return res.json(); // return JSON or whatever backend sends
}

export async function fetchDoctorAppointments(doctorId, status, token) {
  const res = await fetch(
    `http://localhost:8080/api/appointments/doctor?doctorId=${doctorId}&status=${status}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Failed to fetch appointments: " + errorText);
  }

  return res.json(); // return JSON with the list of appointments
}

export async function fetchPastAppointmentsForReview(
  doctorId,
  patientId,
  token
) {
  const url = `http://localhost:8080/api/appointments/pastUserAppointments?doctorId=${doctorId}&patientId=${patientId}&status=Completed`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch past appointments");

  return res.json();
}

export async function submitFeedback(id, feedback, token) {
  const res = await fetch(`http://localhost:8080/api/appointments/${id}/feedback`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: feedback,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to submit feedback: " + text);
  }

  return res.text();
}
