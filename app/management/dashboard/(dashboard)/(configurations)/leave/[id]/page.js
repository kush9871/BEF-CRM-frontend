"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter, useParams } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateLeave = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  const params = useParams();
  const [currentData, setCurrentData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showMonthlyInput, setShowMonthlyInput] = useState(false);
  const [showYearlyInput, setShowYearlyInput] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [yearlyLimit, setYearlyLimit] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (value) => {
    let updatedOptions = [...selectedOptions];
    if (updatedOptions.includes(value)) {
      updatedOptions = updatedOptions.filter((item) => item !== value);
    } else {
      updatedOptions.push(value);
    }
    setSelectedOptions(updatedOptions);
    setValue("leave_add_On", updatedOptions);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // returns 'yyyy-mm-dd'
  };

  useEffect(() => {
    getAllLeaveTypeById();
  }, []);

  useEffect(() => {
    if (currentData) {
      // Set basic fields
      setValue("type", currentData.type);
      setValue("no_of_leave", currentData.no_of_leave);
      setValue("startDate", formatDate(currentData.leaveYear?.startDate));
      setValue("endDate", formatDate(currentData.leaveYear?.endDate));
      setValue("description", currentData.description);
      setValue("allowAdvanceLeave", currentData.allowAdvanceLeave);
      setValue("paidLeave", currentData.paidLeave);
      setValue("is_active", currentData?.is_active === "inactive");

      // Set selected leave add ons (checkboxes)
      if (currentData.leave_add_On && Array.isArray(currentData.leave_add_On)) {
        setSelectedOptions(currentData.leave_add_On); // assume setSelectedOptions updates the checkbox state
      }

      // Set monthly and yearly checkbox state and day limits
      if (currentData.days_limit) {
        if (currentData.days_limit.monthly?.enabled) {
          setShowMonthlyInput(true);
          setMonthlyLimit(currentData.days_limit.monthly.days || 0);
        }
        if (currentData.days_limit.yearly?.enabled) {
          setShowYearlyInput(true);
          setYearlyLimit(currentData.days_limit.yearly.days || 0);
        }
      }
    }
  }, [currentData]);

  const getAllLeaveTypeById = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/leave-type/get-leave-type-by-id/${params.id}`,
        {
          authenticated: true,
        }
      );
      setCurrentData(res?.data?.result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      const days_limit = {
        monthly: {
          enabled: showMonthlyInput,
          days: showMonthlyInput ? parseInt(monthlyLimit || "0", 10) : 0,
        },
        yearly: {
          enabled: showYearlyInput,
          days: showYearlyInput ? parseInt(yearlyLimit || "0", 10) : 0,
        },
      };

      const payLoad = {
        type: data.type,
        leaveYear: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
        no_of_leave: data.no_of_leave,
        days_limit,
        description: data.description,
        allowAdvanceLeave: data.allowAdvanceLeave,
        is_active: data.is_active ? "inactive" : "active",
        paidLeave: data.paidLeave,
      };
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/leave-type/update-leave-type/${params.id}`,
        payLoad,
        {
          authenticated: true,
        }
      );
      toast.success("leave Updated successfully");
      navigate.replace("/management/dashboard/leave");
      setLoading(false);
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while updating leave type"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Leave Type</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/leave"
            >
              / Leaves
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/leave"
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
                    <label className="form-label">Leave Type*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2`"
                      {...register("type", {
                        required: "This field is required",
                      })}
                    />
                    {errors && errors.type && (
                      <span className="text-warning-custom">
                        {errors.type.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Count*</label>
                    <input
                      type="string"
                      className="form-control form-control-sm mb-2`"
                      {...register("no_of_leave", {
                        required: "This field is required",
                      })}
                    />
                    {errors && errors.no_of_leave && (
                      <span className="text-warning-custom">
                        {errors.no_of_leave.message}
                      </span>
                    )}
                  </Col>
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

                  {/* <div className="col-md-6">
                    <label className="form-label mt-2">Leave Add On</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="monthly"
                        onChange={() => handleCheckboxChange("monthly")}
                        checked={selectedOptions.includes("monthly")}
                      />
                      <label className="form-check-label" htmlFor="monthly">
                        Monthly
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="yearly"
                        onChange={() => handleCheckboxChange("yearly")}
                        checked={selectedOptions.includes("yearly")}
                      />
                      <label className="form-check-label" htmlFor="yearly">
                        Yearly
                      </label>
                    </div>
                    <input type="hidden" {...register("leave_add_On")} />
                    {errors?.leave_add_On && (
                      <span className="text-warning-custom">
                        {errors.leave_add_On.message}
                      </span>
                    )}

                    {selectedOptions.length > 0 && (
                      <div className="mt-1 text-primary">
                        Selected: {selectedOptions.join(", ")}
                      </div>
                    )}
                  </div> */}

                  {/* Days Limit Section */}
                  <div className="col-md-6 mt-2">
                    <h5 className="mb-3">Days Limit</h5>

                    <div className="d-flex align-items-center mb-3">
                      <label className="me-2 mb-0">
                        <input
                          type="checkbox"
                          checked={showMonthlyInput}
                          onChange={() =>
                            setShowMonthlyInput(!showMonthlyInput)
                          }
                        />
                        <span className="ms-1">Monthly</span>
                      </label>
                      {showMonthlyInput && (
                        <input
                          type="number"
                          placeholder="Enter month Day Limit"
                          className="form-control ms-2"
                          style={{ width: "200px" }}
                          value={monthlyLimit}
                          onChange={(e) => setMonthlyLimit(e.target.value)}
                        />
                      )}
                    </div>

                    {/* <div className="d-flex align-items-center">
                      <label className="me-2 mb-0">
                        <input
                          type="checkbox"
                          checked={showYearlyInput}
                          onChange={() => setShowYearlyInput(!showYearlyInput)}
                        />
                        <span className="ms-1">Yearly</span>
                      </label>
                      {showYearlyInput && (
                        <input
                          type="number"
                          placeholder="Enter year Day Limit"
                          className="form-control ms-5"
                          style={{ width: "200px" }}
                          value={yearlyLimit}
                          onChange={(e) => setYearlyLimit(e.target.value)}
                        />
                      )}
                    </div> */}
                  </div>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="textarea"
                      className="form-control form-control-sm mb-2`"
                      {...register("description")}
                    />
                  </Col>
                  {/* Allow Advance leave */}
                  <div className="col-md-3 d-flex align-items-center">
                    <div className="form-cehck">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="advanceLeave"
                        {...register("allowAdvanceLeave")}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="advanceLeave"
                      >
                        Allow Advance Leave
                      </label>
                    </div>
                  </div>
                  {/* Allow Paid leave */}
                  <div className="col-md-3 d-flex align-items-center">
                    <div className="form-cehck">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="paidLeave"
                        {...register("paidLeave")}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="paidLeave"
                      >
                        Allow Paid Leave
                      </label>
                    </div>
                  </div>
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

export default UpdateLeave;
