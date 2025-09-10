"use client";

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";

const Calendar = ({ events = [], onMonthChange }) => {
  const calendarRef = useRef(null);

  

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const date = calendarApi.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      onMonthChange?.(month, year);
    }
  }, []);

  const handleDatesSet = (arg) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const currentDate = calendarApi.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    onMonthChange?.(month, year);
  };



  return (
    <div className="calendar-container m-5">
      <div className="d-flex justify-content-end mb-3">
        <Link href="/management/dashboard/attendance" className="btn btn-outline-primary"> <i className="bi bi-arrow-left me-1"></i>
          Back
        </Link>
      </div>

      <div className="mb-3">
        <span className="badge bg-primary me-2">Holiday</span>
        <span className="badge bg-danger me-2">Absent</span>
        <span className="badge bg-warning">Half Day</span>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        datesSet={handleDatesSet} // Triggered on view/month change
        eventDisplay="block"
        
      />



    </div>

    
  );
};

export default Calendar;
