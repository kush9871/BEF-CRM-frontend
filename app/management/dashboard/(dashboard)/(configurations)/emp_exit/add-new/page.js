"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddEmpExit = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const navigate = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 👇 fetch employees on load
  useEffect(() => {
    getEmployees();
  }, [page]);

  const getEmployees = async () => {
    try {
      const response = await Axios.get(
        `${Baseurl}/users/get-all-users?page=${page}&limit=10`,
        {
          authenticated: true,
        }
      );
      setEmployees(response.data.results || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";

    data.address = {
      address: data.address,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
    };

    delete data.state;
    delete data.city;
    delete data.pincode;

    try {
      setLoading(true);
      const res = await Axios.post(
        `${Baseurl}/intent-user/create-intent`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Intent user created successfully");
      navigate.replace("/management/dashboard/intent_form");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while creating Intent"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Add Employee Exit</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/emp_exit"
            >
              / Employee Exit
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/intent_form"
            className="btn btn-outline-primary"
          >
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
                  {/* Employee Name (Dropdown) */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Employee Name*</label>
                    <Form.Select
                      className="form-control form-control-sm"
                      {...register("employeeId", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.employeeId && (
                      <span className="text-warning-custom">
                        {errors.employeeId.message}
                      </span>
                    )}
                  </Col>

                  {/* Assets */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Assets*</label>
                    <div className="d-flex flex-column">
                      {["Laptop", "Mobile", "ID Card", "Access Card"].map(
                        (asset) => (
                          <Form.Check
                            key={asset}
                            type="checkbox"
                            label={asset}
                            value={asset}
                            {...register("assets", {
                              required: "Select at least one asset",
                            })}
                          />
                        )
                      )}
                    </div>
                    {errors.assets && (
                      <span className="text-warning-custom">
                        {errors.assets.message}
                      </span>
                    )}
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

export default AddEmpExit;
