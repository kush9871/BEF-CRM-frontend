"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
// import { Link } from 'react-feather';
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter, useParams } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateOrganization = () => {
  const [updateOrganization, setUpdateOrganization] = useState([]);
  const [currentOrg, setCurrentOrg] = useState({});
  const [loading,setLoading] = useState(false)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...currentOrg },
  });

  const { id } = useParams();
  const navigate = useRouter();

  useEffect(() => {
    getOrganization();
  }, []);

  useEffect(() => {
    setValue("name", currentOrg?.name || "");
    setValue("code", currentOrg?.code || "");
    setValue("address", currentOrg?.address || "");
    setValue("email", currentOrg?.email || "");
    setValue("phone", currentOrg?.phone || "");
    setValue("gstin", currentOrg?.gstin || "");
    setValue("cin", currentOrg?.cin || "");
    setValue("is_active", currentOrg?.is_active === "inactive");
  }, [currentOrg]);

  const getOrganization = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/organization/get-organization-by-id/${id}`,
        {
          authenticated: true,
        }
      );
      setCurrentOrg({ ...res.data });
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data?.name || "",
      address: data.address || "",
      contact_email: data.contact_email || "",
      contact_phone: data.contact_phone || "",
      is_active: data.is_active ? "inactive" : "active",
    };

    try {
      setLoading(true)
      await Axios.put(
        `${Baseurl}/organization/update-organization/${id}`,
        payload,
        {
          authenticated: true,
        }
      );
      toast.success("Organization Updated successfully");
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
          <h1>Update Organization</h1>
          <Breadcrumb>
            <Link
              href="/management/dashboard/organization"
              className="breadcrum-link"
            >
              Organization
            </Link>
            <span>/ Update</span>
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
                        defaultValue={currentOrg.name}
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
                        defaultValue={currentOrg.code}
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
                        defaultValue={currentOrg.address}
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
                        defaultValue={currentOrg.email}
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
                        defaultValue={currentOrg.phone}
                        {...register("phone", {
                          required: "This field is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "Invalid Phone Number",
                          },
                        })}
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
                          defaultValue={currentOrg.is_active}
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
      </section>
    </>
  );
};

export default UpdateOrganization;
