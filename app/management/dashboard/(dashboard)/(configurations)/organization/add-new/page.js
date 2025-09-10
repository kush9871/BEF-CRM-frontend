"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";

// import { Link } from 'react-feather';
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddOrganization = () => {
  // const [showToast , setShowToast] =  useState(false);
  const [loading,setLoading] = useState(false)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  // const [toast,setToast] = useState(false);

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";

    try {
      setLoading(true)
      const res = await Axios.post(
        `${Baseurl}/organization/create-organization`,
        data,
        {
          authenticated: true,
        }
      );      
        toast.success("Organization created successfully");
        setLoading(false)
        navigate.replace("/management/dashboard/organization");
    } catch (error) {
      setLoading(false)
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Organization</h1>
          <Breadcrumb>
            <Breadcrumb.Item
              href="/management/dashboard/organization"
              className="breadcrum-link"
            >
              Organization
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/management/dashboard/organization/add-new">
              Add
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/organization"
            className="btn btn-outline-primary"
          >
            {" "}
            <i className="bi bi-arrow-left me-1"></i>Back
          </Link>
        </div>
      </div>
      <section className="p-5">
        <Container>
          <Row>
            <Col>
              <div className="dashboard-form-wrapper">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <label className="form-label">Name*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("name", {
                          required: "This field is required",
                        })}
                      />
                      {errors && errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">Organization Number*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("code", {
                          required: "This field is required",
                        })}
                      />
                      {errors && errors.code && (
                        <span className="text-danger">
                          {errors.code.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">Address*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("address", {
                          required: "This field is required",
                        })}
                      />
                      {errors && errors.address && (
                        <span className="text-danger">
                          {errors.address.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">Email*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("email", {
                          required: "This field is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid Email Format",
                          },
                        })}
                      />
                      {errors && errors.email && (
                        <span className="text-danger">
                          {errors.email.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">Phone*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("phone", {
                          required: "This field is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "Invalid Phone Number",
                          },
                        })}
                        maxLength={10}
                      />
                      {errors && errors.phone && (
                        <span className="text-danger">
                          {errors.phone.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">GST Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("gstin", {
                          required: "This field is required",
                          pattern: {
                            value:
                              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                            message: "Invalid GSTN Format",
                          },
                        })}
                        maxLength={15}
                      />
                      {errors && errors.gstin && (
                        <span className="text-danger">
                          {errors.gstin.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="form-label">CIN Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2`"
                        {...register("cin", {
                          required: "This field is required",
                          pattern: {
                            value:
                              /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
                            message: "Invalid CIN Number",
                          },
                        })}
                        maxLength={21}
                      />
                      {errors && errors.cin && (
                        <span className="text-danger">
                          {errors.cin.message}
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
        </Container>

        {/* <ToastContainer position="top-end" className="p-3">
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Organization Created Successfully!</Toast.Body>
      </Toast>
    </ToastContainer> */}
      </section>
    </>
  );
};

export default AddOrganization;
