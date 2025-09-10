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

const UpdateAllowances = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [currentAllowances, setCurrentAllowances] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const allowanceId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/Allowances/get-allowance-by-id/${allowanceId}`,
          {
            authenticated: true, // Only useful if Axios interceptors handle this
          }
        );
        setCurrentAllowances(res.data || {});
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    })();
  }, [allowanceId]);

  useEffect(() => {
    if (currentAllowances) {
      setValue("title", currentAllowances.title || "");
      setValue("is_active", currentAllowances?.is_active === "inactive");
      setValue(
        "allowancePercentage",
        currentAllowances.allowancePercentage || ""
      );
      setValue("description", currentAllowances.description || "");
    }
  }, [currentAllowances, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/Allowances/update-allowance/${allowanceId}`,
        {
          title: data.title,
          description: data.description,
          allowancePercentage: data.allowancePercentage,
        },
        {
          authenticated: true,
        }
      );
      toast.success("Allowance updated successfully");
      setLoading(false);
      router.replace("/management/dashboard/allowances");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while updating allowance"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Allowance</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/allowances"
            >
              / Allowances
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/allowances"
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
                    <label className="form-label">Allowance*</label>
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

                  {/* Allowance Percentage */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Allowance Percentage*</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      {...register("allowancePercentage", {
                        required: "This field is required",
                      })}
                    />
                    {errors.allowancePercentage && (
                      <span className="text-warning-custom">
                        {errors.allowancePercentage.message}
                      </span>
                    )}
                  </Col>

                  {/* Description */}
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
                </Row>

                {/* Submit Button */}
                <Row>
                  <Col className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default UpdateAllowances;
