"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams, useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdatePolicies = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [currentpolicies, setCurrentPolicies] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const { id } = useParams();

  useEffect(() => {
    getPolicy();
  }, []);

  useEffect(() => {
    if (currentpolicies) {
      setValue("title", currentpolicies.title || "");
      setValue("description", currentpolicies.description || "");
      setValue("is_active", currentpolicies?.is_active === "inactive");
    }
  }, [currentpolicies, setValue]);

  const getPolicy = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/policies/get-policy-by-id/${id}`,
        {
          authenticated: true,
        }
      );
      setCurrentPolicies(res.data?.result); // FIX: Access policy from nested `data`
    } catch (error) {
      console.error("Fetch Error:", error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("is_active", data.is_active ? "inactive" : "active");

      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }
      const res = await Axios.put(
        `${Baseurl}/policies/update-policy/${id}`,
        formData,
        {
          authenticated: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Policy updated successfully");
      setLoading(false);
      navigate.replace("/management/dashboard/policies");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while updating Policies"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Policy</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/policies"
            >
              / Policies
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/policies"
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
                    <label className="form-label">Policy*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
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

                  <Col md={6} className="mb-3">
                    <label className="form-label">Upload Policy*</label>
                    <input
                      type="file"
                      className="form-control form-control-sm mb-2"
                      {...register("file")}
                    />
                    {errors.file && (
                      <span className="text-warning-custom">
                        {errors.file.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description*</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-sm mb-2"
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

export default UpdatePolicies;
