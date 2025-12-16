import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllWorkDays, getDoctorBySlug } from "../../api/doctorApi";
import { AppointmentsSwiper } from "../appointments/components/AppointmentSwiper";
import { DoctorMapLocation } from "./components/DoctorMapLocation";
import DoctorDetailsCard from "./components/DoctorDetailsCard";
import DoctorReviews from "./components/DoctorReviews";
import PersonalReview from "./components/DoctorPersonalReview";
import { Button } from "react-bootstrap";


export const DoctorPersonalDetails = () => { 
  const [coords, setCoords] = useState(null);
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [refreshReviewsTrigger, setRefreshReviewsTrigger] = useState(0);

  const refreshDoctorReviews = () => {
    setRefreshReviewsTrigger((prev) => prev + 1);
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDateRange = () => {
    const today = new Date();
    const future = new Date();
    future.setMonth(today.getMonth() + 2);

    return {
      from: formatDate(today),
      to: formatDate(future),
    };
  };

  useEffect(() => {
    if (!doctor?.hospital || !doctor?.city) return;

    const fetchCoords = async () => {
      const query = encodeURIComponent(`${doctor.hospital} ${doctor.city}`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data?.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        }
      } catch (e) {
        console.error("Error fetching coords", e);
      }
    };

    fetchCoords();
  }, [doctor]);

  const refreshCalendar = async () => {
    const { from, to } = getDateRange();
    const updatedDays = await getAllWorkDays(doctor.id, from, to);
    setCalendar(updatedDays);
  };

  const generateTimeSlots = (start, end, appointments) => {
    if (!start || !end) return [];
    const slots = [];
    let current = start.slice(0, 5);
    const endTime = end.slice(0, 5);

    const toMinutes = (t) => {
      const [h, m] = t.split(":");
      return +h * 60 + +m;
    };

    while (toMinutes(current) < toMinutes(endTime)) {
      const next = new Date(0, 0, 0, ...current.split(":")).getTime() + 30 * 60000;
      const nextStr = new Date(next).toTimeString().slice(0, 5);
      const blocked = appointments?.some((a) => a.start.slice(0, 5) === current);

      if (!blocked) slots.push(current);
      current = nextStr;
    }
    return slots;
  };

  const transformedCalendar = (calendar || []).map((day) => {
    const dateObj = new Date(day.date);
    const weekdayNames = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];

    return {
      weekday: weekdayNames[dateObj.getDay()],
      date: day.date.split("-").reverse().join("."),
      hours: day.working
        ? generateTimeSlots(day.startTime, day.endTime, day.appointments)
        : [],
    };
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const doctorData = await getDoctorBySlug(slug);
        setDoctor(doctorData);

        const { from, to } = getDateRange();
        const workdays = await getAllWorkDays(doctorData.id, from, to);
        setCalendar(workdays);
      } catch (err) {
        console.error("Error loading page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="doctor-map-container"
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "20px",
          paddingTop: "50px",
          paddingBottom: "50px",
          borderRadius: "10px",
          marginBottom: "30px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <DoctorDetailsCard doctor={doctor} />

        <div
          className="map-info"
          style={{
            width: "700px",
            height: "350px",
            borderRadius: "10px",
            overflow: "hidden",
            marginRight: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {coords ? (
            <DoctorMapLocation doctor={doctor} coords={coords} />
          ) : (
            <p>Зареждане на локацията…</p>
          )}
        </div>
      </div>

      <div
        className="content-columns"
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          paddingTop: "30px",
        }}
      >
        <div
          className="left-column"
          style={{
            width: "45%",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DoctorReviews
            refreshTrigger={refreshReviewsTrigger}
            doctorId={doctor.id}
          />
        </div>

        <div
          className="right-column"
          style={{
            width: "55%",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {calendar?.length > 0 && (
            <AppointmentsSwiper
              days={transformedCalendar}
              refreshCalendar={refreshCalendar}
              doctorId={doctor.id}
            />
          )}
        </div>
      </div>
      <PersonalReview
        onFeedbackSubmitted={refreshDoctorReviews}
        doctorId={doctor.id}
      />
      <Button onClick = {() => console.log(doctor.id)}>
        testtt
      </Button>
    </>
  );
};