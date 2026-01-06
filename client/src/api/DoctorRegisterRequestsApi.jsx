const API_ENDPOINT = "http://localhost:8080/api/admin/doctor";


export const getAllRegisterRequests = async () => {
  try {
    const res = await fetch(API_ENDPOINT);
    if (!res.ok) throw new Error("Failed to fetch register requests");

    const regRequests = await res.json();
    return regRequests;
  } catch (error) {
    console.error("Error fetching register requests:", error);
    return [];
  }
};