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

const AddDepartmentHead = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  const [org, setOrg] = useState();
  const [department, setDepartment] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    getOrg();
    getUser();
    getDepartment();
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
        `${Baseurl}/department_head/create-department_head`,
        data,
        {
          authenticated: true,
        }
      );

      if (res) {
        navigate.replace("/management/dashboard/department_head");
        setLoading(false);
        toast.success("DepartmentHead created successfully");
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while creating departmentHead"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Department Head</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/department_head"
            >
              / Department_Head
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/department_head"
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
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      aria-label="Default select example"
                      {...register("departmentId", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Open this select menu</option>
                      {department &&
                        Array.isArray(department) &&
                        department.length > 0 &&
                        department.map((item, index) => {
                          return (
                            <option
                              value={item._id ? item._id : item.id}
                              key={index}
                            >
                              {item.title}
                            </option>
                          );
                        })}
                    </select>
                    {errors && errors.departmentHeadId && (
                      <span className="text-warning-custom">
                        {errors.departmentHeadId.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Department Head*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      aria-label="Default select example"
                      {...register("departmentHeadId", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Open this select menu</option>
                      {user &&
                        Array.isArray(user) &&
                        user.length > 0 &&
                        user.map((item, index) => {
                          return (
                            <option
                              value={item._id ? item._id : item.id}
                              key={index}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                    {errors && errors.departmentHeadId && (
                      <span className="text-warning-custom">
                        {errors.departmentHeadId.message}
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

export default AddDepartmentHead;
