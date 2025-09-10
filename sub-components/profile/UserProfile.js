import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Axios from "app/config/axios";
import { Col, Row, Button, Container } from "react-bootstrap";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";

const API_URL = process.env.NEXT_PUBLIC_APIURL;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

const ProjectForm = (loggedInUser) => {
  const currentData = loggedInUser?.userData?.userData || {};
  const [department, setDepartment] = useState([]);
  const [userDesignation, setUserDesignation] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeTypes,setEmployeeTypes] = useState([])
  const [employees, setEmployees] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const params = useParams();
  const userId = params?.id;

  // Set form default values
  useEffect(() => {
    setValue("name", currentData.name);
    setValue("contactNo", currentData.contactNo);
    setValue("bloodGroup", currentData.bloodGroup);
    setValue("designation_id", currentData.designation_id);
    setValue("department_id", currentData.department_id);
    setValue("dob", formatDate(currentData.dob));
    setValue("joiningDate", formatDate(currentData.joiningDate));
    setValue("official_email", currentData.official_email);
    setValue("emergencyContactNo", currentData.emergencyContactNo);
    setValue("basicSalary", currentData.basicSalary);
    setValue("allowance_Id", currentData.allowance_Id || []);
    setValue("buddyEmpId",currentData.buddyEmpId);
    setValue("empType_id",currentData.empType_id)
  }, [currentData, userDesignation, department]);

  useEffect(() => {
    getDepartment();
    getDesignation();
    getAllowances();
    getEmployeeTypes();
    getEmployees();
  }, []);

  const getDepartment = async () => {
    try {
      const res = await Axios.get(`${API_URL}/department/get-all-department`, {
        authenticated: true,
      });
      setDepartment(res.data.results);
    } catch (error) {
      toast.error(error.message || "Error occurred while getting department");
    }
  };

  const getDesignation = async () => {
    try {
      const res = await Axios.get(`${API_URL}/designation/get-all-designation`, {
        authenticated: true,
      });
      setUserDesignation(res.data.results);
    } catch (error) {
      toast.error(error.message || "Error occurred while getting designation");
    }
  };

    const getEmployees = async () => {
    try {
      const response = await Axios.get(`${API_URL}/users/get-all-users`, {
        authenticated: true,
      });
      setEmployees(response.data.results || []); // ✅ update employees state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

    const getAllowances = async () => {
    try {
      const res = await Axios.get(`${API_URL}/Allowances/get-all-allowance`, {
        authenticated: true,
      });
      setAllowances(res.data.results);
    } catch (error) {
      toast.error(error.message || "Error occures while getting department");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.username = data.official_email;

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key];

        if (value === undefined || value === null || value === "") return;

        // Handle files
        if (key === "profileImg" && value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        } else if (Array.isArray(value)) {
          // Handle arrays like allowance_Id
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      if (userId) {
        await Axios.put(`${API_URL}/users/update-user/${userId}`, formData, {
          authenticated: true,
        });
      } else {
        await Axios.put(`${API_URL}/users/update-user`, formData, {
          authenticated: true,
        });
      }

      toast.success("Profile updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while updating profile");
      setLoading(false);
    }
  };

      const getEmployeeTypes = async () => {
      try {
        const res = await Axios.get(`${API_URL}/employee-type/get-all-employee-type`, {
          authenticated: true,
        });
        setEmployeeTypes(res.data.results);
      } catch (error) {
        toast.error(error.message || "Error occures while getting department");
      }
    };

  return (
    <section className="pt-3">
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Name */}
            <Col md={6} className="mb-3">
              <label className="form-label">Name*</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...register("name", { required: "This field is required" })}
              />
              {errors?.name && <span className="text-warning-custom">{errors.name.message}</span>}
            </Col>

            {/* Department */}
            <Col md={6} className="mb-3">
              <label className="form-label">Department*</label>
              <select
                className="form-control form-control-sm mb-2 form-select"
                {...register("department_id", { required: "This field is required" })}
                defaultValue={currentData.department_id}
              >
                <option value="">Select a department</option>
                {department.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
              {errors?.department_id && (
                <span className="text-warning-custom">{errors.department_id.message}</span>
              )}
            </Col>

            {/* Designation */}
            <Col md={6} className="mb-3">
              <label className="form-label">Designation*</label>
              <select
                className="form-control form-control-sm mb-2 form-select"
                {...register("designation_id", { required: "This field is required" })}
                defaultValue={currentData.designation_id}
              >
                <option value="">Select a designation</option>
                {userDesignation.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.designation}
                  </option>
                ))}
              </select>
              {errors?.designation_id && (
                <span className="text-warning-custom">{errors.designation_id.message}</span>
              )}
            </Col>

            {/* Allowances Multi-Select */}
            <Col md={6} className="mb-3">
              <label className="form-label">Allowances</label>
              <Controller
                name="allowance_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={allowances.map((a) => ({ value: a._id, label: a.title }))}
                    isMulti
                    classNamePrefix="react-select"
                    placeholder="Select allowance(s)"
                    onChange={(selected) => field.onChange(selected.map((s) => s.value))}
                    value={allowances
                      .filter((a) => field.value?.includes(a._id))
                      .map((a) => ({ value: a._id, label: a.title }))}
                  />
                )}
              />
            </Col>

            {/* Basic Salary */}
            <Col md={6} className="mb-3">
              <label className="form-label">Basic Salary*</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...register("basicSalary", { required: "This field is required" })}
                maxLength={10}
              />
              {errors?.basicSalary && <span className="text-warning-custom">{errors.basicSalary.message}</span>}
            </Col>

            {/* Profile Image */}
            <Col md={6} className="mb-3">
              <label className="form-label">Profile Image</label>
              <input type="file" className="form-control form-control-sm" {...register("profileImg")} />
            </Col>

            {/* Employee type */}
                              <Col md={6} className="mb-3">
                    <label className="form-label">Employee Type*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      {...register("empType_id", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select an Employee type</option>
                      {employeeTypes &&
                        Array.isArray(employeeTypes) &&
                        employeeTypes.length > 0 &&
                        employeeTypes.map((item, index) => {
                          return (
                            <option value={item._id} key={index}>
                              {item.type}
                            </option>
                          );
                        })}
                      {/* Add more options as needed */}
                    </select>
                      {register?.empType_id && (
                      <span className="text-warning-custom">
                        {register.empType_id.message}
                      </span>
                    )}
                  </Col>
                  {/* Employee Buddy */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Employee Buddy</label>
                    <Controller
                      name="buddyEmpId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={employees.map((emp) => ({
                            value: emp._id,
                            label: emp.name, // ✅ only name
                          }))}
                          isMulti
                          classNamePrefix="react-select"
                          placeholder="Select Buddy's"
                          onChange={(selected) =>
                            field.onChange(selected.map((s) => s.value))
                          }
                          value={employees
                            .filter((emp) => field.value?.includes(emp._id))
                            .map((emp) => ({
                              value: emp._id,
                              label: emp.name, // ✅ only name
                            }))}
                        />
                      )}
                    />
                  </Col>

            {/* Joining Date */}
            <Col md={6} className="mb-3">
              <label className="form-label">Joining Date</label>
              <input type="date" className="form-control form-control-sm" {...register("joiningDate")} />
            </Col>

            {/* DOB */}
            <Col md={6} className="mb-3">
              <label className="form-label">DOB</label>
              <input type="date" className="form-control form-control-sm" {...register("dob")} />
            </Col>

            {/* Blood Group */}
            <Col md={6} className="mb-3">
              <label className="form-label">Blood Group</label>
              <select className="form-control form-control-sm" {...register("bloodGroup")}>
                <option value="">-- Select Blood Group --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </Col>

            {/* Contact Number */}
            <Col md={6} className="mb-3">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...register("contactNo", {
                  pattern: { value: /^[0-9]+$/, message: "Invalid Phone Number" },
                })}
                maxLength={10}
              />
              {errors?.contactNo && <span className="text-warning-custom">{errors.contactNo.message}</span>}
            </Col>

            {/* Emergency Contact */}
            <Col md={6} className="mb-3">
              <label className="form-label">Emergency Contact Number</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...register("emergencyContactNo", {
                  pattern: { value: /^[0-9]+$/, message: "Invalid Phone Number" },
                })}
                maxLength={10}
              />
              {errors?.emergencyContactNo && (
                <span className="text-warning-custom">{errors.emergencyContactNo.message}</span>
              )}
            </Col>

            {/* Official Email */}
            <Col md={6} className="mb-3">
              <label className="form-label">Official Email*</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...register("official_email", {
                  required: "This field is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid Email Format" },
                })}
              />
              {errors?.official_email && (
                <span className="text-warning-custom">{errors.official_email.message}</span>
              )}
            </Col>

            <Col md={12}>
              <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Container>
    </section>
  );
};

export default ProjectForm;
