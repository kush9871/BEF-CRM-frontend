"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddHoliday = () => {
  const [loading, setLoading] = useState();

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
      setLoading(true);
      const res = await Axios.post(`${Baseurl}/holiday/create-holiday`, data, {
        authenticated: true,
      });
      if (res) {
        navigate.replace("/management/dashboard/holidays");
        toast.success("Holiday created successfully");
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while creating department"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Holiday</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/holidays"
            >
              / Holidays
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/holidays"
            className="btn btn-outline-primary"
          >
            {" "}
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </Link>
        </div>
      </div>
      <section className="p-5">
        <Row>
          <Col>
            <div className="dashboard-form-wrapper">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Holiday*</label>
                    <input
                      type="string"
                      className="form-control form-control-sm mb-2`"
                      {...register("name", {
                        required: "This field is required",
                      })}
                    />
                    {errors && errors.name && (
                      <span className="text-warning-custom">
                        {errors.name.message}
                      </span>
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
                      <span className="text-warning-custom">
                        {errors.type.message}
                      </span>
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
                      <span className="text-warning-custom">
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
                      <span className="text-warning-custom">
                        {errors.endDate.message}
                      </span>
                    )}
                  </div>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="textarea"
                      className="form-control form-control-sm mb-2`"
                      {...register("description")}
                    />
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
                        Mark as Draft
                      </label>
                    </div>
                  </Col>
                </Row>
                <Col className="mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Col>
              </Form>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default AddHoliday;
