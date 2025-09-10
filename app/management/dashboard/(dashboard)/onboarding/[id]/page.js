"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { TagsInput } from "react-tag-input-component";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateOnboarding = () => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const params = useParams();

  const [employeeType, setEmployeeType] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
    getOnboardingById();
  }, []);

  const getUsers = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/users/get-all-users`, {
        authenticated: true,
      });
      setEmployeeType(res.data.results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getOnboardingById = async () => {
    try {
      const res = await Axios.get(
        `${Baseurl}/Onboarding/get-onboarding-by-id/${params.id}`,
        { authenticated: true }
      );
      const data = res.data;
      // Correctly set all fields
      setValue("user_id",  data.user_id);
      setValue("description", data.description);
      setValue("is_active", data.is_active === "inactive");

      // Set tags only if array
      if (Array.isArray(data.assets)) {
        setTags(data.assets);
      }
    } catch (error) {
      console.error("Error fetching onboarding:", error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("description", data.description);
    formData.append("is_active", data.is_active ? "inactive" : "active");

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    tags.forEach((tag, index) => {
      formData.append(`assets[${index}]`, tag);
    });

    try {
      setLoading(true);
      await Axios.put(
        `${Baseurl}/Onboarding/update-onboarding/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          authenticated: true,
        }
      );
      toast.success("Onboarding updated successfully");
      router.replace("/management/dashboard/onboarding");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error occurred while updating onboarding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Onboarding</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <Link href="/management/onboarding/" className="ms-2 breadcrum-link">
              / Onboarding
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
      </div>

      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="dashboard-form-wrapper">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    {/* Employee Name */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Employee Name*</label>
                      <select
                        className="form-control form-control-sm mb-2 form-select"
                        {...register("user_id", {
                          required: "This field is required",
                        })}
                      >
                        <option value="" hidden>
                          Select Employee Name
                        </option>
                        {employeeType.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {errors?.user_id && (
                        <span className="text-warning-custom">
                          {errors.user_id.message}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Asset Details*</label>
                      <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Enter asset details"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Upload File*</label>
                      <input
                        type="file"
                        className="form-control"
                        {...register("file")}
                      />
                    </div>

                    {/* Description */}
                    <Col md={6} className="mb-3">
                      <label className="form-label">Description*</label>
                      <textarea
                        className="form-control form-control-sm"
                        {...register("description", {
                          required: "This field is required",
                        })}
                      />
                      {errors.description && (
                        <span className="text-warning-custom">
                          {errors.description.message}
                        </span>
                      )}
                    </Col>

                    {/* Draft Switch */}
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
                  </div>

                  <Col className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Col>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateOnboarding;
