export const fetchGuardianAppointments = async (token, guardianId) => {
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(
    `http://localhost:8080/api/appointments/guardian/${guardianId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error: ${response.statusText}. Response: ${text}`);
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    throw new Error("Unexpected response format, expected JSON.");
  }
};