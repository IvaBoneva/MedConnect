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

    if (response.headers.get("Content-Type").includes("application/json")) {
        return await response.json();
    } else {
        throw new Error("Unexpected response format, expected JSON.");
    }
};

export const fetchCompletedPatientAppointments = async (token, patientId) => {
    if (!token) {
        throw new Error("No token found");
    }

    const response = await fetch(`http://localhost:8080/api/appointments/completed/patient/${patientId}`, {
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
    const url = `http://localhost:8080/api/prescription-events/user/${userId}`;

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

export const fetchPatientById = async (patientId, token) => {
    if (!token) {
        throw new Error("No token provided");
    }

    const res = await fetch(
        `http://localhost:8080/api/user/patient/${patientId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error fetching patient: ${text}`);
    }

    const contentType = res.headers.get("Content-Type");
    return contentType?.includes("application/json")
        ? res.json()
        : null;
};

