"use client";

import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Toast,
  Modal,
} from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_APIURL;

const HoliDaysCalendar = () => {
  const [holiday, setHoliday] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    getHolidays();
  }, []);

  const getHolidays = async () => {
    try {
      const res = await Axios.get(`${BASE_URL}/holiday/get-all-holiday`, {
        authenticated: true,
      });
      setHoliday(res?.data?.results || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case "National":
        return "#fdd106"; // Blue
      case "Festival":
        return "#198754"; // Green
      case "Optional":
        return "#637381"; // Green
      default:
        return "#637381"; // Gray
    }
  };

  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]; // format: YYYY-MM-DD
  };

  const events =
    holiday &&
    Array.isArray(holiday) &&
    holiday.length > 0 &&
    holiday.map((h) => ({
      title: `${h.name}`,
      start: h.startDate,
      end: addOneDay(h.endDate), // Add 1 day to show the end date inclusively
      allDay: true,
      backgroundColor: getColorByType(h.type),
      borderColor: getColorByType(h.type),
    }));

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowModal(true);
  };

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";
    try {
      const res = await Axios.post(`${BASE_URL}/holiday/create-holiday`, data, {
        authenticated: true,
      });
      if (res) {
        navigate.replace("/management/dashboard/org-calendar");
        toast.success("Holiday created successfully", {
          type: "success",
          position: "bottom-right",
          theme: "light",
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="calendar-container m-5">
      <div className="d-flex justify-content-end mb-3">
        <Link
          href="/management/dashboard/attendance"
          className="btn btn-outline-primary"
        >
          {" "}
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </Link>
      </div>

      <div className="mb-3">
        <span className="badge bg-primary me-2">National</span>
        <span className="badge bg-success me-2">Festival</span>
        <span className="badge bg-secondary me-2">Optional</span>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        dateClick={handleDateClick}
      />

      <Modal
        show={showModal}
        ref={calendarRef}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dashboard-form-wrapper p-3">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6} className="mb-3">
                  <label className="form-label">Name*</label>
                  <input
                    type="string"
                    className="form-control form-control-sm mb-2`"
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                  {errors && errors.name && (
                    <span className="text-danger">{errors.name.message}</span>
                  )}
                </Col>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Type*</label>
                  <select
                    className="form-control form-control-sm mb-2 form-select"
                    {...register("type", {
                      required: "This field is required",
                    })}
                  >
                    <option value="">-- Select an option --</option>
                    <option value="National">National</option>
                    <option value="Festival">Festival</option>
                    <option value="Optional">Optional</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {errors?.type && (
                    <span className="text-danger">{errors.type.message}</span>
                  )}
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">StartDate*</label>
                  <input
                    type="date"
                    className="form-control form-control-sm mb-2"
                    {...register("startDate", {
                      required: "This field is required",
                    })}
                  />
                  {errors?.startDate && (
                    <span className="text-danger">
                      {errors.startDate.message}
                    </span>
                  )}
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">EndDate*</label>
                  <input
                    type="date"
                    className="form-control form-control-sm mb-2"
                    {...register("endDate", {
                      required: "This field is required",
                    })}
                  />
                  {errors?.endDate && (
                    <span className="text-danger">
                      {errors.endDate.message}
                    </span>
                  )}
                </div>

                <Col md={6} className="mb-3">
                  <label className="form-label">Description*</label>
                  <textarea
                    type="textarea"
                    className="form-control form-control-sm mb-2`"
                    {...register("description")}
                  />
                  {errors && errors.description && (
                    <span className="text-danger">
                      {errors.description.message}
                    </span>
                  )}
                </Col>
                <Col md={6} className="mb-3 d-flex align-items-end">
                  <div className="form-check form-switch ">
                    <input
                      type="checkbox"
                      id="click"
                      className="form-check-input"
                      {...register("is_active")}
                    />
                    <label
                      htmlFor="click"
                      className="form-check-label me-3 px-2"
                    >
                      Mark as Draft*
                    </label>
                  </div>
                </Col>
              </Row>
              <Col className="mt-4">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HoliDaysCalendar;
