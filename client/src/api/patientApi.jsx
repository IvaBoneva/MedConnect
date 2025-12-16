export const fetchPatientAppointments = async (token, patientId) => {
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`http://localhost:8080/api/appointments/patient/${patientId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error: ${response.statusText}. Response: ${text}`);
  }

  // Check if the response contains JSON
  if (response.headers.get("Content-Type").includes("application/json")) {
    return await response.json(); // return the JSON data directly
  } else {
    throw new Error("Unexpected response format, expected JSON.");
  }
};

export const fetchPrescriptionEvents = async (userId, token) => {
  const url = `http://localhost:8080/api/prescription-events/user/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Bearer token here
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prescription events');
    }

    const data = await response.json();
    console.log('Fetched prescription events:', data);
    return data; // Returning the fetched data
  } catch (error) {
    console.error('Error fetching prescription events:', error);
  }
};

