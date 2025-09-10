"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddOrganization = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showMonthlyInput, setShowMonthlyInput] = useState(false);
  const [showYearlyInput, setShowYearlyInput] = useState(false);
  const [loading, setLoading] = useState();
  const navigate = useRouter();

  const onSubmit = async (data) => {
    // Remove optional fields if not shown
    if (!showMonthlyInput) {
      delete data.monthlyInput;
    }
    if (!showYearlyInput) {
      delete data.yearlyInput;
    }

    // Dummy logic (adjust as per real use case)
    data.is_active = data.is_active ? "inactive" : "active";

    try {
      setLoading(true);
      const res = await Axios.post(`${Baseurl}/kpi/create-kpi`, data, {
        authenticated: true,
      });

      if (res) {
        navigate.replace("/management/dashboard/performance-indicator");
        toast.success("KPI created successfully");
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occureed while creating KPI"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Performance Indicator</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/performance-indicator"
            >
              / Performance Indicator
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/performance-indicator"
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
                  {/* Title */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Title*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("title", {
                        required: "This field is required",
                      })}
                    />
                    {errors.title && (
                      <span className="text-warning-custom">
                        {errors.title.message}
                      </span>
                    )}
                  </Col>

                  {/* Rating */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Rating*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value="5-10"
                      readOnly
                      {...register("rating", {
                        required: "This field is required",
                      })}
                    />
                    {errors.rating && (
                      <span className="text-warning-custom">
                        {errors.rating.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description*</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      {...register("description", {
                        required: "This field is required",
                      })}
                    />
                    {errors.description && (
                      <span className="text-warning-custom">
                        {errors.description.message}
                      </span>
                    )}
                  </Col>
                  {/* Monthly Option */}
                  <Col md={6} className="mb-3 mt-5">
                    <div className="d-flex align-items-center mb-2">
                      <Form.Check
                        type="checkbox"
                        id="monthly"
                        label="Monthly"
                        onChange={(e) => setShowMonthlyInput(e.target.checked)}
                      />
                      {showMonthlyInput && (
                        <>
                          <input
                            type="text"
                            className="form-control form-control-sm ms-2"
                            placeholder="Monthly input"
                            {...register("monthlyInput", {
                              required: "Monthly input is required",
                            })}
                            style={{ maxWidth: "200px" }}
                          />
                          {errors.monthlyInput && (
                            <span className="text-danger ms-2">
                              {errors.monthlyInput.message}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Yearly Option */}
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="yearly"
                        label="Yearly"
                        onChange={(e) => setShowYearlyInput(e.target.checked)}
                      />
                      {showYearlyInput && (
                        <>
                          <input
                            type="text"
                            className="form-control form-control-sm ms-4"
                            placeholder="Yearly input"
                            {...register("yearlyInput", {
                              required: "Yearly input is required",
                            })}
                            style={{ maxWidth: "200px" }}
                          />
                          {errors.yearlyInput && (
                            <span className="text-danger ms-2">
                              {errors.yearlyInput.message}
                            </span>
                          )}
                        </>
                      )}
                    </div>
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

                {/* Submit Button */}
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

export default AddOrganization;
