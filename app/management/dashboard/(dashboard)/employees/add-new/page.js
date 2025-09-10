"use client";

import Link from "next/link";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactResponsiveTable from "../../components/react-responsive-table";
import Axios from "app/config/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import style from "styles/form.module.css";
import Allowances from "../../(configurations)/allowances/page";
const API_URL = process.env.NEXT_PUBLIC_APIURL;
import Select from "react-select";
import { MdDeleteOutline } from "react-icons/md";
// Profile header with tabs
const ProfileHeader = () => {
  const [activeTab, setActiveTab] = useState("User Profile");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState();
  const [isSameaddress, setisSameaddress] = useState(false);
  const [addressData, setAddressData] = useState();
  const [qualificationList, setQualificationList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [employeeTypes,setEmployeeTypes] = useState([])

  // Profile form...........
  const {
    register: profileRegister,
    handleSubmit: profileSubmit,
    reset: profileReset,
    control,
    formState: { errors: profileError },
  } = useForm();

  const profileOnSubmit = (data) => {
    setLoading(true);
    setProfileData({ ...data, username: data.official_email });
    setActiveTab("address");
    setLoading(false);
  };

  useEffect(() => {
    getDepartment();
    getDesignation();
    getAllowances();
    getEmployees();
    getEmployeeTypes();
  }, []);

  const getDesignation = async () => {
    try {
      const res = await Axios.get(
        `${API_URL}/designation/get-all-designation`,
        {
          authenticated: true,
        }
      );

      setDesignation(res.data.results);
    } catch (error) {
      toast.error(error.message || "Error occures while getting designation");
    }
  };

  const getDepartment = async () => {
    try {
      const res = await Axios.get(`${API_URL}/department/get-all-department`, {
        authenticated: true,
      });
      setDepartment(res.data.results);
    } catch (error) {
      toast.error(error.message || "Error occures while getting department");
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

  //  Address form...........
  const {
    register: addressRegister,
    handleSubmit: addressSubmit,
    watch: addressWatch,
    setValue: setAddressValue,
    reset: addressReset,
    formState: { errors: addressError },
  } = useForm();

  const currentAddress = addressWatch("address.current");

  useEffect(() => {
    if (isSameaddress && currentAddress) {
      setAddressValue(
        "address.permanent.address",
        currentAddress?.address || ""
      );
      setAddressValue("address.permanent.state", currentAddress?.state || "");
      setAddressValue("address.permanent.city", currentAddress?.city || "");
      setAddressValue(
        "address.permanent.pincode",
        currentAddress?.pincode || ""
      );
    } else {
      setAddressValue("address.permanent.address");
      setAddressValue("address.permanent.state");
      setAddressValue("address.permanent.city");
      setAddressValue("address.permanent.pincode");
    }
  }, [isSameaddress, currentAddress, setAddressValue]);

  const addressOnSubmit = (data) => {
    setLoading(true);
    setAddressData({ ...data });
    setLoading(false);
    setActiveTab("documents");
  };

  // bank details......
  const {
    register: bankRegister,
    handleSubmit: bankSubmit,
    reset: bankReset,
    formState: { errors: bankError },
  } = useForm();

  const bankOnSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...profileData,
        ...addressData,
        qualifications: [...qualificationList],
        ...data,
      };

      const formData = new FormData();

      // Append simple fields
      Object.entries(payload).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0)
        ) {
          return; // Skip this key
        }

        if (Array.isArray(value) && key === "qualifications") {
          value.forEach((item, i) => {
            Object.entries(item).forEach(([innerKey, innerVal]) => {
              if (
                innerVal !== null &&
                innerVal !== undefined &&
                innerVal !== ""
              ) {
                formData.append(
                  `qualificationsData[${i}].${innerKey}`,
                  innerVal
                );
              }
            });
            if (item?.certificate instanceof File) {
              formData.append(
                `qualificationsData[${i}].certificateFile`,
                item.certificate
              );
            }
          });
        } else if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Append documents with metadata and files
      documentList.forEach((doc, i) => {
        if (doc.documentType?.trim()) {
          formData.append(`documentsData[${i}].documentType`, doc.documentType);
        }
        if (doc.file instanceof File) {
          formData.append(`documentsData[${i}].file`, doc.file);
        }
      });

      // Profile Image
      if (profileData.profileImg instanceof File) {
        formData.append("profileImg", profileData.profileImg);
      }

      const res = await Axios.post(`${API_URL}/users/create-user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        authenticated: true,
      });
      profileReset();
      addressReset();
      documentationReset();
      qualificationReset();
      bankReset();
      setDocumentList([]);
      setQualificationList([]);
      toast.success("Employee created successfully");
      setLoading(false);
      router.push("/management/dashboard/employees");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while creating employee"
      );
      setLoading(false);
    }
  };

  // Qualifications.........
  const {
    register: qualificationRegister,
    handleSubmit: qualificationSubmit,
    reset: qualificationReset,
    formState: { errors: qualificationError },
  } = useForm();

  const qualificationOnSubmit = (data) => {
    const { course_name, percentage, certificate } = data;

    if (!course_name || !percentage || !certificate?.[0]) {
      alert("Please fill all fields properly.");
      return;
    }

    try {
      setLoading(true);
      const file = certificate[0];
      const certificateURL = URL.createObjectURL(file);

      const newRow = {
        course_name,
        percentage,
        certificate: certificateURL,
        certificateFile: certificate[0],
      };

      setQualificationList((prev) => [...prev, newRow]);
      qualificationReset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const qualificationSubmitHandler = () => {
    if (qualificationList.length === 0) {
      toast.error(
        "Please add at least one qualification detail before proceeding."
      );
      return;
    }
    setActiveTab("bank details");
  };

  const handleDeleteAction = (id) => {
    const updatedList = qualificationList.filter((item) => item._id !== id);
    setQualificationList(updatedList);
    toast.success("Qualification deleted successfully");
  };
  const columns = [
    {
      title: "Qualification",
      key: "name",
    },
    {
      title: "Percentage",
      key: "percentage",
    },
    {
      title: "Certificate",
      key: "certificate",
      render: (row) => {
        return <img src={row} alt="Qualification" width="50" />;
      },
    },
    {
      title: "Actions",
      key: "_id",
      render: (value, row) => (
        <button className="btn" onClick={() => handleDeleteAction(value)}>
          <MdDeleteOutline />
        </button>
      ),
    },
  ];

  // Document.......

  const aadharInputRef = useRef(null);
  const panInputRef = useRef(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);

  const {
    register: documentationRegister,
    handleSubmit: documentationSubmit,
    setValue: documentationSetValue,
    reset: documentationReset,
    formState: { errors: documentationError },
  } = useForm();

  const documentaionhandleClick = (type) => {
    if (type === "aadhar" && aadharInputRef.current) {
      aadharInputRef.current.click();
    }
    if (type === "pan" && panInputRef.current) {
      panInputRef.current.click();
    }
  };
  const documentationhandleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);

      // Replace or add to documentList
      setDocumentList((prevList) => {
        const updatedList = prevList.filter((doc) => doc.documentType !== type);
        return [...updatedList, { documentType: type, file }];
      });

      // Set preview and form value
      if (type === "aadhar") {
        setAadharPreview(preview);
        documentationSetValue("aadharCard", file);
      } else if (type === "pan") {
        setPanPreview(preview);
        documentationSetValue("panCard", file);
      }
    }
  };

  const documentSubmitHandler = () => {
    setActiveTab("qualifications");
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Employee Creation</h1>
          <Breadcrumb>
            <Link
              href="/management/dashboard/employees"
              className="breadcrum-link"
            >
              Employees
            </Link>
            <span className="ms-2">/ Add</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/employees"
            className="btn btn-outline-primary"
          >
            {" "}
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </Link>
        </div>
      </div>
      <Row className="align-items-center p-3">
        <Col xl={12}>
          {/* {activeTab && activeTab == "overview" && } */}
          <div className="bg-white rounded-bottom smooth-shadow-sm">
            <ul
              className={`nav nav-lt-tab px-4 ${style.employessTabs}`}
              role="tablist"
            >
              {[
                "User Profile",
                "address",
                "documents",
                "qualifications",
                "bank details",
              ].map((tab) => (
                <li className="nav-item" key={tab}>
                  <span
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    // onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
            {activeTab && activeTab == "User Profile" && (
              <form className="p-4" onSubmit={profileSubmit(profileOnSubmit)}>
                <Row>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Name*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...profileRegister("name", {
                        required: "This field is required",
                      })}
                    />
                    {profileError?.name && (
                      <span className="text-warning-custom">
                        {profileError.name.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Department*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      {...profileRegister("department_id", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select an department</option>
                      {department &&
                        Array.isArray(department) &&
                        department.length > 0 &&
                        department.map((item, index) => {
                          return (
                            <option value={item._id} key={index}>
                              {item.title}
                            </option>
                          );
                        })}
                      {/* Add more options as needed */}
                    </select>
                    {profileError && profileError.department_id && (
                      <span className="text-warning-custom">
                        {profileError.department_id.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Designation*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      {...profileRegister("designation_id", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select an designation</option>
                      {designation &&
                        Array.isArray(designation) &&
                        designation.length > 0 &&
                        designation.map((item, index) => {
                          return (
                            <option value={item._id} key={index}>
                              {item.designation}
                            </option>
                          );
                        })}
                      {/* Add more options as needed */}
                    </select>
                    {profileError && profileError.designation_id && (
                      <span className="text-warning-custom">
                        {profileError.designation_id.message}
                      </span>
                    )}
                  </Col>
                  {/* allowances */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Allowances</label>
                    <Controller
                      name="allowance_Id"
                      control={control} // <-- use this, not register
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={allowances.map((a) => ({
                            value: a._id,
                            label: a.title,
                          }))}
                          isMulti
                          classNamePrefix="react-select"
                          placeholder="Select allowance(s)"
                          onChange={(selected) =>
                            field.onChange(selected.map((s) => s.value))
                          }
                          value={allowances
                            .filter((a) => field.value?.includes(a._id))
                            .map((a) => ({ value: a._id, label: a.title }))}
                        />
                      )}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Basic Salary*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...profileRegister("basicSalary", {
                        required: "This field is required",
                      })}
                      maxLength={10}
                    />
                    {profileError?.basicSalary && (
                      <span className="text-warning-custom">
                        {profileError.basicSalary.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      {...profileRegister("profileImg")}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Employee Type*</label>
                    <select
                      className="form-control form-control-sm mb-2 form-select"
                      {...profileRegister("empType_id", {
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
                      {profileError?.empType_id && (
                      <span className="text-warning-custom">
                        {profileError.empType_id.message}
                      </span>
                    )}
                  </Col>
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

                  <Col md={6} className="mb-3">
                    <label className="form-label">Joining Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      {...profileRegister("joiningDate")}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">DOB</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      {...profileRegister("dob")}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-control form-control-sm"
                      {...profileRegister("bloodGroup")}
                    >
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

                  <Col md={6} className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      {...profileRegister("contactNo", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Invalid Phone Number",
                        },
                      })}
                      maxLength={10}
                    />
                    {profileError?.contactNo && (
                      <span className="text-warning-custom">
                        {profileError.contactNo.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">
                      Emergency Contact Number
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      {...profileRegister("emergencyContactNo", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Invalid Phone Number",
                        },
                      })}
                      maxLength={10}
                    />
                    {profileError?.emergencyContactNo && (
                      <span className="text-warning-custom">
                        {profileError.emergencyContactNo.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Official Email*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...profileRegister("official_email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid Email Format",
                        },
                      })}
                    />
                    {profileError?.official_email && (
                      <span className="text-warning-custom">
                        {profileError.official_email.message}
                      </span>
                    )}
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={loading}
                >
                  Save & Next
                </Button>
              </form>
            )}
            {activeTab && activeTab == "address" && (
              <form className="p-4" onSubmit={addressSubmit(addressOnSubmit)}>
                <Row>
                  <Col md={6}>
                    <lable>Address</lable>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.current.address", {
                        required: "This field is required",
                      })}
                    />
                    {addressError &&
                      addressError?.address?.current?.address && (
                        <p className="text-warning-custom">
                          {addressError.address.current.address.message}
                        </p>
                      )}
                  </Col>
                  <Col md={6}>
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.current.state", {
                        required: "This field is required",
                      })}
                    />
                    {addressError && addressError?.address?.current?.state && (
                      <p className="text-warning-custom">
                        {addressError.address.current.state.message}
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.current.city", {
                        required: "This field is required",
                      })}
                    />
                    {addressError && addressError?.address?.current?.city && (
                      <p className="text-warning-custom">
                        {addressError.address.current.city.message}
                      </p>
                    )}
                  </Col>
                  <Col>
                    <label>Pin Code</label>
                    <input
                      type="number"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.current.pincode", {
                        required: "This field is required",
                      })}
                    />
                    {addressError &&
                      addressError?.address?.current?.pincode && (
                        <p className="text-warning-custom">
                          {addressError.address.current.pincode.message}
                        </p>
                      )}
                  </Col>
                </Row>
                <Row>
                  <Col className="form-check m-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      checked={isSameaddress}
                      onChange={() => setisSameaddress(!isSameaddress)}
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                      if your current address is permanent address
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h3 className="mb-5">Permanent Address:-</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <lable>Address</lable>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.permanent.address", {
                        required: "This field is required",
                      })}
                    />
                    {addressError &&
                      addressError?.address?.permanent?.address && (
                        <p className="text-warning-custom">
                          {addressError.address.permanent.address.message}
                        </p>
                      )}
                  </Col>
                  <Col md={6}>
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.permanent.state", {
                        required: "This field is required",
                      })}
                    />
                    {addressError &&
                      addressError?.address?.permanent?.state && (
                        <p className="text-warning-custom">
                          {addressError.address.permanent.state.message}
                        </p>
                      )}
                  </Col>
                  <Col md={6}>
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.permanent.city", {
                        required: "This field is required",
                      })}
                    />
                    {addressError && addressError?.address?.permanent?.city && (
                      <p className="text-warning-custom">
                        {addressError.address.permanent.city.message}
                      </p>
                    )}
                  </Col>
                  <Col>
                    <label>Pin Code</label>
                    <input
                      type="number"
                      className="form-control form-control-sm mb-2"
                      {...addressRegister("address.permanent.pincode", {
                        required: "This field is required",
                      })}
                    />
                    {addressError &&
                      addressError?.address?.permanent?.pincode && (
                        <p className="text-warning-custom">
                          {addressError.address.permanent.pincode.message}
                        </p>
                      )}
                  </Col>
                </Row>
                <Col className="mt-4 d-flex justify-content-between">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setActiveTab("User Profile")}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    Save & Next
                  </Button>
                </Col>
              </form>
            )}
            {activeTab && activeTab === "documents" && (
              <Form
                className="p-4"
                onSubmit={documentationSubmit(documentSubmitHandler)}
              >
                <Row className="mb-3">
                  {/* Aadhar Box */}
                  <Col md={6}>
                    <label>Aadhar Card*</label>
                    <div
                      className="upload-container border text-center"
                      style={{
                        cursor: "pointer",
                        background: "#f8f8f8",
                        borderRadius: "5px",
                        minHeight: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                      onClick={() => documentaionhandleClick("aadhar")}
                    >
                      {aadharPreview ? (
                        <img
                          src={aadharPreview}
                          alt="Aadhar Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "Click to upload AADHAR"
                      )}
                    </div>

                    {/* File input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={aadharInputRef}
                      onChange={(e) => {
                        documentationhandleFileChange(e, "aadhar");
                        if (e.target.files[0]) {
                          documentationSetValue(
                            "aadharCard",
                            e.target.files[0],
                            {
                              shouldValidate: true,
                            }
                          );
                        }
                      }}
                      style={{ display: "none" }}
                    />

                    {/* Hidden field with required validation */}
                    <input
                      type="hidden"
                      {...documentationRegister("aadharCard", {
                        required: "Aadhar card is required",
                      })}
                    />

                    {/* Error Message */}
                    {documentationError.aadharCard && (
                      <p className="text-warning-custom">
                        {documentationError.aadharCard.message}
                      </p>
                    )}
                  </Col>

                  {/* PAN Box */}
                  <Col md={6}>
                    <label>PAN Card*</label>
                    <div
                      className="upload-container border text-center"
                      style={{
                        cursor: "pointer",
                        background: "#f8f8f8",
                        borderRadius: "5px",
                        minHeight: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                      onClick={() => documentaionhandleClick("pan")}
                    >
                      {panPreview ? (
                        <img
                          src={panPreview}
                          alt="PAN Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "Click to upload PAN"
                      )}
                    </div>

                    {/* File input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={panInputRef}
                      onChange={(e) => {
                        documentationhandleFileChange(e, "pan");
                        if (e.target.files[0]) {
                          documentationSetValue("panCard", e.target.files[0], {
                            shouldValidate: true,
                          });
                        }
                      }}
                      style={{ display: "none" }}
                    />

                    {/* Hidden field with required validation */}
                    <input
                      type="hidden"
                      {...documentationRegister("panCard", {
                        required: "PAN card is required",
                      })}
                    />

                    {/* Error Message */}
                    {documentationError.panCard && (
                      <p className="text-warning-custom">
                        {documentationError.panCard.message}
                      </p>
                    )}
                  </Col>
                </Row>

                {/* Buttons */}
                <Col className="p-3 d-flex align-items-end justify-content-between">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setActiveTab("address")}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    Save & Next
                  </Button>
                </Col>
              </Form>
            )}

            {activeTab && activeTab == "qualifications" && (
              <>
                <form
                  className="p-4"
                  onSubmit={qualificationSubmit(qualificationOnSubmit)}
                >
                  <Row>
                    <Col md={6}>
                      <label>Course Name*</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        {...qualificationRegister("course_name", {
                          required: "This field is required",
                        })}
                      />
                      {qualificationError?.course_name && (
                        <span className="text-warning-custom">
                          {qualificationError.course_name.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6}>
                      <label>Percentage*</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        {...qualificationRegister("percentage", {
                          required: "This feild is required",
                        })}
                      />
                      {qualificationError?.percentage && (
                        <span className="text-warning-custom">
                          {qualificationError.percentage.message}
                        </span>
                      )}
                    </Col>
                    <Col md={6}>
                      <label>Certificate*</label>
                      <input
                        type="file"
                        className="form-control mb-2"
                        {...qualificationRegister("certificate", {
                          required: "This field is required",
                        })}
                      />
                      {qualificationError?.certificate && (
                        <span className="text-warning-custom">
                          {qualificationError.certificate.message}
                        </span>
                      )}
                    </Col>
                    <Col className="d-flex align-items-end">
                      <Button type="submit" variant="primary">
                        Add
                      </Button>
                    </Col>
                  </Row>
                  {qualificationList.length > 0 && (
                    <>
                      <Container className="table-parent-wrapper">
                        <Row className="mt-4">
                          <Col className="super-responsive-table">
                            <ReactResponsiveTable
                              columns={columns}
                              data={qualificationList}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </>
                  )}
                </form>
                <Col className="p-3 d-flex align-items-end justify-content-between">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setActiveTab("documents")}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={qualificationSubmitHandler}
                    disabled={loading}
                  >
                    Save & Next
                  </Button>
                </Col>
              </>
            )}
            {activeTab && activeTab == "bank details" && (
              <form className="p-4" onSubmit={bankSubmit(bankOnSubmit)}>
                <Row>
                  <Col md={6}>
                    <label>Account Holder Name*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-3"
                      {...bankRegister("bankDetails.accountHolder", {
                        required: "Account Holder Name is required",
                      })}
                    />
                    {bankError?.bankDetails?.accountHolder && (
                      <span className="text-warning-custom">
                        {bankError.bankDetails.accountHolder.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6}>
                    <label>Account Number*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-3"
                      {...bankRegister("bankDetails.accountNumber", {
                        required: "Account Number is required",
                      })}
                    />
                    {bankError?.bankDetails?.accountNumber && (
                      <span className="text-warning-custom">
                        {bankError.bankDetails.accountNumber.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6}>
                    <label>IFSC Code*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-3"
                      {...bankRegister("bankDetails.ifsc", {
                        required: "IFSC Code is required",
                      })}
                    />
                    {bankError?.bankDetails?.ifsc && (
                      <span className="text-warning-custom">
                        {bankError.bankDetails.ifsc.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6}>
                    <label>Bank Name*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-3"
                      {...bankRegister("bankDetails.bankName", {
                        required: "Bank Name is required",
                      })}
                    />
                    {bankError?.bankDetails?.bankName && (
                      <span className="text-warning-custom">
                        {bankError.bankDetails.bankName.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6}>
                    <label>Branch*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-3"
                      {...bankRegister("bankDetails.branch", {
                        required: "Branch is required",
                      })}
                    />
                    {bankError?.bankDetails?.branch && (
                      <span className="text-warning-custom">
                        {bankError.bankDetails.branch.message}
                      </span>
                    )}
                  </Col>
                </Row>

                <Col className="mt-4 d-flex justify-content-between">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setActiveTab("qualifications")}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    Submit
                  </Button>
                </Col>
              </form>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProfileHeader;
