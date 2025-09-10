"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// import { Link } from 'react-feather';
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddPolicies = () => {
  const session = useSession();
  const role = session?.data?.user?.role;
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  const [org, setOrg] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      // Skip undefined/null/empty string
      if (value === undefined || value === null || value === "") return;

      // Handle FileList or File separately
      if (key === "file" && value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]); // append only the first file
      } else if (key !== "file") {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);
      const res = await Axios.post(
        `${Baseurl}/policies/create-policy`,
        formData,
        {
          authenticated: true,
        }
      );
      toast.success("Policy created successfully");
      setLoading(false);
      navigate.replace("/management/dashboard/policies");
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred while creating policy"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Policy</h1>
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
            <span className="ms-2">/ Add</span>
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
                      className="form-control form-control-sm mb-2`"
                      {...register("title", {
                        required: "This field is required",
                      })}
                    />
                    {errors && errors.title && (
                      <span className="text-warning-custom">
                        {errors.title.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Upload Policy*</label>
                    <input
                      type="file"
                      className="form-control form-control-sm mb-2`"
                      {...register("file")}
                    />
                    {errors && errors.file && (
                      <span className="text-warning-custom">
                        {errors.file.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Description*</label>
                    <textarea
                      type="textarea"
                      className="form-control form-control-sm mb-2`"
                      {...register("description")}
                    />
                    {errors && errors.description && (
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

export default AddPolicies;
