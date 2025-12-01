


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