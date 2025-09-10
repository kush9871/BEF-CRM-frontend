"use client";
import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Axios from "app/config/axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import ReactResponsiveTable from "../../app/management/dashboard/(dashboard)/components/react-responsive-table";
import { MdDeleteOutline } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_APIURL;
const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;

const QualificationPage = (loggedInUser) => {
  const [qualificationList, setQualificationList] = useState(
    loggedInUser?.userData?.userData?.qualifications || []
  );
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState("")

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const params = useParams();
  const userId = params?.id;

  const qualificationOnSubmit = (data) => {
    const { course_name, percentage } = data;
    const fileList = getValues("certificate");

    const file = fileList[0];
    const certificateURL = URL.createObjectURL(file);

    const newRow = {
      course_name,
      percentage,
      certificate: certificateURL,
      certificateFile: file, // Only new files have this
    };

    setQualificationList((prev) => [...prev, newRow]);
    reset();
  };

  const handleDeleteAction = (id) => {
    const updatedList = qualificationList.filter((item) => item._id !== id);
    setQualificationList(updatedList);
    toast.success("Qualification deleted successfully");
  };

  const columns = [
    {
      title: "Qualification",
      key: "course_name",
    },
    {
      title: "Percentage",
      key: "percentage",
    },
    {
      title: "Certificate",
      key: "certificate",
      render: (_, row) => {
        const certificateSrc =
          typeof row?.certificate === "string" && row.certificate.startsWith("blob:")
            ? row.certificate
            : `${IMG_URL}/${row?.certificate?.path}`;

        return (
          <img
            src={certificateSrc}
            alt="Certificate"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
          />
        );
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

const qualificationHandlerClick = async () => {
  try {
    setLoading(true);
        if (!qualificationList || qualificationList.length == 0) {
       setError("Please add at least one qualification.")
       return setTimeout(()=>{
        setError("")
       },3000)

    }
    const formData = new FormData();
    
    // Send full updated qualification list
    qualificationList.forEach((item, index) => {
      formData.append(`qualificationsData[${index}].course_name`, item.course_name);
      formData.append(`qualificationsData[${index}].percentage`, item.percentage);

      if (item?.certificateFile instanceof File) {
        // New file upload
        formData.append(
          `qualificationsData[${index}].certificateFile`,
          item.certificateFile
        );
      } else if (item?.certificate?.path) {
        // Existing qualification (coming from backend)
        formData.append(
          `qualificationsData[${index}].certificate`,
          item.certificate.path
        );
      }
    });
    if(userId){
      await Axios.put(`${API_URL}/users/update-user/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      authenticated: true,
    });
    }
    else{
    await Axios.put(`${API_URL}/users/update-user`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      authenticated: true,
    });
  }
    toast.success("Qualification updated successfully");
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while updating profile"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="pt-3">
      <Container>
      <Row>
        <Col>
          <form  onSubmit={handleSubmit(qualificationOnSubmit)}>
            <Row>
              <Col md={6}>
                <label>Course Name*</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  {...register("course_name", {
                    required: "This field is required",
                  })}
                />
                {errors?.course_name && (
                  <p className="text-warning-custom">{errors.course_name.message}</p>
                )}
              </Col>
              <Col md={6}>
                <label>Percentage*</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  {...register("percentage", {
                    required: "This field is required",
                  })}
                />
                {errors?.percentage && (
                  <p className="text-warning-custom">{errors.percentage.message}</p>
                )}
              </Col>
              <Col md={6}>
                <label>Certificate*</label>
                <input
                  type="file"
                  className="form-control mb-2"
                  {...register("certificate", {
                    required: "This field is required",
                  })}
                />
                {errors?.certificate && (
                  <p className="text-warning-custom">{errors.certificate.message}</p>
                )}
              </Col>
              <Col className="d-flex align-items-end">
                <Button type="submit" variant="primary">
                  Add
                </Button>
              </Col>
            </Row>
          </form>

          {qualificationList.length > 0 && (
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
          )}
          {error && <span className="text-warning-custom">{error}</span>}
          <Col className="p-3 d-flex align-items-end justify-content-between">
            <Button
              variant="primary"
              disabled={loading}
              onClick={qualificationHandlerClick}
            >
              Submit
            </Button>
          </Col>
        </Col>
      </Row>
      </Container>
      
    </section>
  );
};

export default QualificationPage;
