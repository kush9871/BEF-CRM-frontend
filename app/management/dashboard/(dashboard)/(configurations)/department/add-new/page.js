"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddDepartment = () => {
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
  const [loading, setLoading] = useState();
  useEffect(() => {
    getOrg();
    getUser();
  }, []);

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

  const getUser = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/users/get-all-users`, {
        authenticated: true,
      });
      setUser(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";
    try {
      setLoading(true);
      const res = await Axios.post(
        `${Baseurl}/department/create-department`,
        data,
        {
          authenticated: true,
        }
      );

      if (res) {
        navigate.replace("/management/dashboard/department");
        setLoading(false);
        toast.success("Department created successfully");
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while creating department"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Department</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/department"
            >
              / Departments
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/department"
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
                    <label className="form-label">Department*</label>
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
                    <label className="form-label">Description</label>
                    <textarea
                      type="textarea"
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

export default AddDepartment;
