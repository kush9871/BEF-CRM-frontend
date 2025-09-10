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

const UpdateDesignation = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  const params = useParams();

  const [org, setOrg] = useState();
  const [department, setDepartment] = useState();
  const [currentData, setCurrentData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue("designation", currentData?.designation);
    setValue("department_id", currentData?.department_id);
    setValue("description", currentData?.description);
    setValue("is_active", currentData?.is_active === "inactive");
  }, [currentData]);

  useEffect(() => {
    getOrg();
    getDepartment();
    getDesignationById();
  }, []);

  const getDesignationById = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/designation/get-designation-by-id/${params.id}`,
        {
          authenticated: true,
        }
      );
      setCurrentData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getOrg = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/organization/get-all-organization`,
        {
          authenticated: true,
        }
      );
      setOrg(res.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartment = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/department/get-all-department`, {
        authenticated: true,
      });
      setDepartment(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      designation: data.designation || "",
      is_active: data.is_active ? "inactive" : "active",
      description: data.description || "",
      department_id: data.department_id || "",
    };

    try {
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/designation/update-designation/${params.id}`,
        payload,
        {
          authenticated: true,
        }
      );
      navigate.replace("/management/dashboard/designation");
      toast.success("Designation updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while updating department"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Designation</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/designation"
            >
              / Designations
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/designation"
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
                    <label className="form-label">Designation*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2`"
                      {...register("designation", {
                        required: "This field is required",
                      })}
                    />
                    {errors && errors.designation && (
                      <span className="text-warning-custom">
                        {errors.designation.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Department*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      {...register("department_id", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select an department</option>
                      {department &&
                        Array.isArray(department) &&
                        department.length > 0 &&
                        department.map((item, index) => {
                          return (
                            <option value={item._id} key={index}>
                              {item.title}
                            </option>
                          );
                        })}
                      {/* Add more options as needed */}
                    </select>
                    {errors && errors.department_id && (
                      <span className="text-warning-custom">
                        {errors.department_id.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm mb-2`"
                      {...register("description")}
                    />
                  </Col>
                  <Col md={6} className="mb-3 d-flex align-items-end">
                    <div className="form-check form-switch">
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

export default UpdateDesignation;
