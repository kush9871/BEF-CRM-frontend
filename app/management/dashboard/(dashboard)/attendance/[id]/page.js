"use client";

import React, { useState } from "react";
import Calendar from "../../calendar/page";
import Axios from "app/config/axios";
import { useParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_APIURL;

const UsersCalendar = () => {
  const [events, setEvents] = useState([]);
  const params = useParams();

  const getColorByType = (status) => {
    switch (status) {
      case "Holiday":
        return "#fdd106"; // Blue
      case "Absent":
        return "red"; // red
      case "Half Day":
        return "#f59e0b"; // Green
      default:
        return "#637381"; // Gray
    }
  };

  const fetchAttendanceEvents = async (month) => {
    if (!params.id) return;

    try {
      const response = await Axios.get(
        `${BASE_URL}/attendence/get-all-leaves-by-month/${month}/${params.id}`,
        { authenticated: true }
      );
      const rawData =
        response.data?.result?.data &&
        Array.isArray(response.data?.result?.data)
          ? response.data?.result?.data
          : response.data.results || [];

      const transformedEvents = rawData
        .filter((entry) => entry?.status !== "Present") // Exclude 'Present' entries
        .map((entry) => {
          const dateOnly = new Date(entry.date).toISOString().split("T")[0];
          return {
            title: `${entry.status} - ${
              entry.employee_name || entry.holiday_name || ""
            }`,
            start: dateOnly,
            end: dateOnly,
            backgroundColor: getColorByType(entry.status),
            borderColor: getColorByType(entry.status),
            textColor: "#fff", // Optional but recommended
          };
        });

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching attendance events:", error);
    }
  };

  const handleMonthChange = (month, year) => {
    fetchAttendanceEvents(month, year);
  };

  return <Calendar events={events} onMonthChange={handleMonthChange} />;
};

export default UsersCalendar;
