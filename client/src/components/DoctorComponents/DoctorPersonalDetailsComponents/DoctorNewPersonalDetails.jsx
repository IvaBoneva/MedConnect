import { Button, Image, Container } from "react-bootstrap";
import DoctorReviews from "./DoctorReviews";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllWorkDays, getDoctorBySlug } from "../../../api/doctorApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { AppointmentsSwiper } from "./AppointmentsSwiper";
import { DoctorMapLocation } from "./DoctorMapLocation";
import { DoctorDetailsCard } from "./DoctorDetailsCard";
import PersonalReview from "./PersonalReview";

export const DoctorNewPersonalDetails = () => {
  const [coords, setCoords] = useState(null); //   doctor will be loaded through slug
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [calendar, setCalendar] = useState([]); // Store the doctor's workdays
  const [loading, setLoading] = useState(false);

  const [refreshReviewsTrigger, setRefreshReviewsTrigger] = useState(0);

  const refreshDoctorReviews = () => {
  setRefreshReviewsTrigger(prev => prev + 1);
};

  const doctorId = 6;

  useEffect(() => {
    if (!doctor?.hospital || !doctor?.city) return;

    const fetchCoords = async () => {
      const query = encodeURIComponent(`${doctor.hospital} ${doctor.city}`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data?.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        });
      }
    };

    fetchCoords();
  }, [doctor]);

  const refreshCalendar = async () => {
    const updatedDays = await getAllWorkDays(doctorId);
    setCalendar(updatedDays);
  };

  //   plots time slots of 30 minutes each HARDCODED
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
      const next =
        new Date(0, 0, 0, ...current.split(":")).getTime() + 30 * 60000;
      const nextStr = new Date(next).toTimeString().slice(0, 5);

      const blocked = appointments?.some(
        (a) => a.start.slice(0, 5) === current
      );

      if (!blocked) slots.push(current);

      current = nextStr;
    }

    return slots;
  };

  const transformedCalendar = calendar.map((day) => {
    const dateObj = new Date(day.date);

    const weekdayNames = [
      "неделя",
      "понеделник",
      "вторник",
      "сряда",
      "четвъртък",
      "петък",
      "събота",
    ];

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

        // 1. Load doctor
        const doctorData = await getDoctorBySlug(slug);
        setDoctor(doctorData);

        // 2. Load calendar automatically
        const workdays = await getAllWorkDays();
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
          alignItems: "flex-start", // Align top for both sections
          padding: "20px",
          paddingTop: "50px", // Add upper padding of 50px
          paddingBottom: "50px",
          borderRadius: "10px",
        marginBottom: "30px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Doctor Section (Left) */}
        <DoctorDetailsCard doctor={doctor} />

        {/* Map Section (Right) */}
        <div
          className="map-info"
          style={{
            width: "700px", // Adjust map width
            height: "350px", // Adjust map height
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

      {/* Main Content (Left and Right Columns) */}
      <div
        className="content-columns"
        style={{
          display: "flex",
          gap: "20px", // Space between left and right columns
          width: "100%",
          paddingTop: "30px", // Space between doctor info and columns
        }}
      >
        {/* Left Column (Comment Section) */}
        <div
          className="left-column"
          style={{
            width: "45%", // Adjust width as needed
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DoctorReviews refreshTrigger={refreshReviewsTrigger}/>
        </div>
{/* 
          <Button onClick={() => console.log(doctor)}>

          </Button> */}

        {/* Right Column (TimeScheduler - Swiper) */}
        <div
          className="right-column"
          style={{
            width: "55%", // Adjust width as needed
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* TimeCarousel */}
          {calendar.length > 0 && (
            <AppointmentsSwiper
              days={transformedCalendar}
              refreshCalendar={refreshCalendar}
            />
          )}
        </div>
      </div>

      <PersonalReview onFeedbackSubmitted={refreshDoctorReviews}/>
    </>
  );
};
