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

const AddPatients = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();

  const onSubmit = async (data) => {
    // return console.log(data,"testing data")
    data.is_active = data.is_active ? "inactive" : "active";

    try {
      setLoading(true);
      const res = await Axios.post(
        `${Baseurl}/patients/create-patient`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Patient created successfully");
      setLoading(false);
      navigate.replace("/management/dashboard/patients");
    } catch (error) {
      toast.error(
        data.response.data.message ||
          "An error occurred while creating Patient"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Patient</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/patients"
            >
              / Patients
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/patients"
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
                    <label className="form-label">Name*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("name", {
                        required: "This field is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-warning-custom">
                        {errors.name.message}
                      </span>
                    )}
                  </Col>

                  {/* moblie */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Phone Number*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("mobile", {
                        required: "This field is required",
                      })}
                    />
                    {errors.mobile && (
                      <span className="text-warning-custom">
                        {errors.mobile.message}
                      </span>
                    )}
                  </Col>

                  {/* email */}
                   <Col md={6} className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("email")}
                    />
                  </Col>

                  {/* age */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("age")}
                    />
                  </Col>

                  {/* address */}
                    <Col md={6} className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("address")}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      {...register("description", {
                        
                      })}
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
                  {/* Monthly Option */}
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

export default AddPatients;
