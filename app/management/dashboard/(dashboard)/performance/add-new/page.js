"use client";

import Axios from "app/config/axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Button, Container, Row, Breadcrumb } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast } from "react-toastify";
import Link from "next/link";
import formatDate from "app/components/formatDate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const PerformancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { handleSubmit, register, reset } = useForm();

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/users/get-all-users`, {
        authenticated: true,
      });
      setEmployees(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const foundEmployee = employees.find((emp) =>
     (emp._id || emp.id) == selectedId);
    setSelectedEmployee(foundEmployee || null);
  };

  const onSubmit = async (data) => {
    try {
      const kpis = [
        {
          name: "product",
          ...data.product,
        },
        { name: "task", ...data.task },
        { name: "punctuality", ...data.punctuality },
      ];
      const evaluatedBy = {
        managerId:
          selectedEmployee?.department_id?.departmentHeadId?.id || null,
      };

      const userID = selectedEmployee?._id || selectedEmployee?.id;
      
      
      const finalData = { kpis, evaluatedBy, user_id: userID };
      
      const res = await Axios.post(
        `${Baseurl}/performance/evaluate-performace`,
        finalData,
        {
          authenticated: true,
        }
      );
      toast.success("Performace is submmitted successfully");
      setSelectedEmployee(null);
      reset({
        product: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
        task: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
        punctuality: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
      });
    } catch (error) {
      setSelectedEmployee(null);
      reset({
        product: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
        task: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
        punctuality: {
          weight: "",
          employeeRating: "",
          managerRating: "",
          hrRating: "",
          comments: "",
        },
      });
      toast.error(error?.response?.data?.message || "error occured");
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Evaluate Performace</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className='breadcrum-link'>Dashboard</Link>
            <Link className="ms-2 breadcrum-link" href="/management/dashboard/performance">
              / Performace
            </Link>
            <span className="ms-2">/ Evaluate performace</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/performance"
            className="btn btn-outline-primary"
          > <i className="bi bi-arrow-left me-1"></i>
            Back
          </Link>
        </div>
      </div>
      <section className="p-4">
        <Container>
          <div className="dashboard-form-wrapper">
            <Row>
              <Col md={6}>
                <Row>
                  <Col md={12}>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={handleSelectChange}
                    >
                      <option selected>Open this select menu</option>
                      {employees &&
                        Array.isArray(employees) &&
                        employees.length > 0 &&
                        employees.map((item, index) => {
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
                  </Col>
                </Row>
              </Col>

              <Col md={6}>
                {selectedEmployee && (
                  <>
                    <div>
                      <p>Name : {selectedEmployee.name}</p>
                      <p>Designation : {selectedEmployee.designation}</p>
                      <p>
                        Joining Date :{" "}
                        {formatDate(selectedEmployee.joiningDate)}
                      </p>
                      <p>D.O.B : {formatDate(selectedEmployee.dob)}</p>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="p-4">
        <Container>
          <Row>
            <Col>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="dashboard-form-wrapper">
                  <Row>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th width={"10%"}>Key</Th>
                          <Th width={"10%"}>Weight (%)</Th>
                          <Th width={"20%"}>Self Rating (5-10)</Th>
                          <Th width={"20%"}>Manager Rating (5-10)</Th>
                          <Th width={"20%"}>HR Rating (5-10)</Th>
                          <Th width={"20%"}>Comments</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Product</Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("product.weight")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("product.employeeRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("product.managerRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("product.hrRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("product.comments")}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Task</Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("task.weight")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("task.employeeRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("task.managerRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("task.hrRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("task.comments")}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>punctuality</Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("punctuality.weight")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("punctuality.employeeRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("punctuality.managerRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("punctuality.hrRating")}
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2 table-input"
                              {...register("punctuality.comments")}
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    <Col className="mt-4">
                      <Button variant="primary" type="submit" className="ps-3 pe-3" disabled={!selectedEmployee}>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PerformancePage;
