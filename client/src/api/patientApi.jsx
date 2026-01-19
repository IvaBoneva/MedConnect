export const fetchPatientAppointments = async (token, patientId) => {
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/patient/${patientId}`, {
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

  if (response.headers.get("Content-Type").includes("application/json")) {
    return await response.json(); 
  } else {
    throw new Error("Unexpected response format, expected JSON.");
  }
};

export const fetchPrescriptionEvents = async (userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/prescription-events/user/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prescription events');
    }

    const data = await response.json();
    console.log('Fetched prescription events:', data);
    return data; 
  } catch (error) {
    console.error('Error fetching prescription events:', error);
  }
};

