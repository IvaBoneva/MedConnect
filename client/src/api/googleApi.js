
const GOOGLE_API_BASE = "http://localhost:8080/google";
const GOOGLE_EVENTS = "http://localhost:8080/events"

export const googleAuthorize = () => {
    const token = localStorage.getItem("token");  // your JWT

    window.location.href = `http://localhost:8080/google?token=${token}`;

}

export const listEvents = () => {

    const token = localStorage.getItem("token");

    return fetch(GOOGLE_EVENTS, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())

}
