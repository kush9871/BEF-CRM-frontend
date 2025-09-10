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

const UpdateIntent = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [currentIntent, setcurrentIntent] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const IntentId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/intent-user/get-intent-by-id/${IntentId}`,
          {
            authenticated: true, // Only useful if Axios interceptors handle this
          }
        );
        setcurrentIntent(res.data || {});
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    })();
  }, [IntentId]);

  useEffect(() => {
    if (currentIntent) {
      setValue("name", currentIntent.name || "");
      setValue("email", currentIntent.email || "");
      setValue("phoneNumber", currentIntent.phoneNumber || "");
      setValue("is_active", currentIntent?.is_active === "inactive");
      setValue("description", currentIntent.description || "");

      // Missing fields
      setValue("address", currentIntent.address || "");
      setValue("state", currentIntent.state || "");
      setValue("city", currentIntent.city || "");
      setValue("pincode", currentIntent.pincode || "");
    }
  }, [currentIntent, setValue]);

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";
    try {
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/intent-user/update-intent/${IntentId}`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Intent user updated successfully");
      setLoading(false);
      router.replace("/management/dashboard/intent_form");
    } catch (error) {
      toast.error(
        data.response.data.message || "An error occurred while updating Intent"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Intent</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/intent_form"
            >
              / Intent
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/intent_form"
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
                  <Col md={6} className="mb-3">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      {...register("email", {
                        required: "This field is required",
                      })}
                    />
                    {errors.email && (
                      <span className="text-warning-custom">
                        {errors.email.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Phone Number*</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      {...register("phoneNumber", {
                        required: "This field is required",
                      })}
                    />
                    {errors.phoneNumber && (
                      <span className="text-warning-custom">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </Col>
                </Row>

                <Row>
                  <h3>Address</h3>
                  {/* Title */}
                  <Col md={3} className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      {...register("address.address")}
                    />
                  </Col>
                  {/* Percentage */}
                  <Col md={3} className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("address.state")}
                    />
                  </Col>

                  <Col md={3} className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("address.city")}
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <label className="form-label">Pin Code</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      {...register("address.pincode")}
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

export default UpdateIntent;
