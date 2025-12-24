
const GOOGLE_EVENTS = "http://localhost:8080/events"

export const googleAuthorize = () => {
    const token = localStorage.getItem("token"); 

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
