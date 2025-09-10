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

const AddOfferletter = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";

    try {
      setLoading(true);
      const res = await Axios.post(
        `${Baseurl}/offer-latter/create-offer-latter`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Offer Letter created successfully");
      setLoading(false);
      navigate.replace("/management/dashboard/offer_letter");
    } catch (error) {
      toast.error(
        data.response.data.message ||
          "An error occurred while creating Offer Letter"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Offer Letter</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/offer_letter"
            >
              / Offer_Letter
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/offer_letter"
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
                    <label className="form-label">Offer Letter Type*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("type", {
                        required: "This field is required",
                      })}
                    />
                    {errors.type && (
                      <span className="text-warning-custom">
                        {errors.type.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      {...register("description", {})}
                    />
                    {errors.description && (
                      <span className="text-warning-custom">
                        {errors.description.message}
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

export default AddOfferletter;
