import { useState } from "react";
import { createAppointmentRequest } from "../../../api/appointmentApi";
import { normalizeDate } from "../../utils/calendarUtils";
import { useAuth } from "../../../context/AuthContext";


export const useAppointment = ({ days, refreshCalendar, doctorId }) => {
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const { user, token } = useAuth();

  const handleHourClick = (date, hour) => {
    setSelected({ date, hour });
  };

  const createAppointment = async () => {
    try {
      const payload = {
        doctorId: doctorId,
        patientId: user.id,
        date: normalizeDate(selected.date),
        start: selected.hour,
        comment: comment,
      };

      console.log("Sending:", payload);
      await createAppointmentRequest(payload, token);

      alert("Часът е записан!");
      await refreshCalendar();

      setSelected(null);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Грешка при записването на час.");
    }
  };

  const cancel = () => {
    setSelected(null);
    setComment("");
  };

  return {
    selected,
    comment,
    setComment,
    handleHourClick,
    createAppointment,
    cancel,
  };
};
