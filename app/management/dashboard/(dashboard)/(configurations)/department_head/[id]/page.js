"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter, useParams } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateDepartmentHead = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();
  const params = useParams();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState();
  const [department, setDepartment] = useState();
  useEffect(() => {
    setValue("departmentId", currentData?.departmentId);
    setValue("description", currentData?.description);
    setValue("departmentHeadId", currentData?.departmentHeadId);
    setValue("is_active", currentData?.is_active === "inactive");
  }, [currentData]);

  useEffect(() => {
    getUsers();
    getDepartmentById();
    getDepartment();
  }, []);

  const getUsers = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/users/get-all-users`, {
        authenticated: true,
      });
      setUsers(res.data.results);
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

  const getDepartmentById = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/department_head/get-department_head-by-id/${params.id}`,
        {
          authenticated: true,
        }
      );
      setCurrentData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      departmentId: data?.departmentId || "",
      departmentHeadId: data?.departmentHeadId || "",
      description: data?.description || "",
      is_active: data.is_active ? "inactive" : "active",
    };

    try {
      setLoading(true);
      await Axios.put(
        `${Baseurl}/department_head/update-department_head/${params.id}`,
        payload,
        {
          authenticated: true,
        }
      );
      toast.success("DepartmentHead Updated successfully");
      setLoading(false);
      navigate.replace("/management/dashboard/department_head");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error occurred while updating department"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Department Head</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/department_head"
            >
              / Department_head
            </Link>
            <span className="ms-2">/ Update</span>
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
                      <option hidden>Open this select menu</option>
                      {users &&
                        Array.isArray(users) &&
                        users.length > 0 &&
                        users.map((item, index) => {
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

export default UpdateDepartmentHead;
