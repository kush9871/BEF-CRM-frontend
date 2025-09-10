"use client";

import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import { TagsInput } from "react-tag-input-component";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const AddOnboarding = () => {
  const [employeeType, setEmployeeType] = useState([]);
  const [submitMsg, setSubmitMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useRouter();

  const onSubmit = async (data) => {
    if (!tags || tags.length === 0) {
      setSubmitMsg("Please assign the assets");
      setTimeout(() => {
        setSubmitMsg("");
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", data.user_id);
      formData.append("description", data.description);
      formData.append("is_active", data.is_active ? "true" : "false");

      // ✅ Store assets as array using FormData
      tags.forEach((tag) => {
        formData.append("assets[]", tag);
      });

      if (data.file && data.file.length > 0) {
        for (let i = 0; i < data.file.length; i++) {
          formData.append("file", data.file[i]);
        }
      }

      await Axios.post(`${Baseurl}/Onboarding/create-onboarding`, formData, {
        authenticated: true,
      });

      navigate.replace("/management/dashboard/onboarding");
      reset();
      setTags([]); // reset tags too
      toast.success("Onboarding created successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while assigning assets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  const getAllEmployee = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/users/get-all-users`, {
        authenticated: true,
      });
      setEmployeeType(res?.data?.results || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Assets Form</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/onboarding/"
            >
              / Onboarding
            </Link>
            <span className="ms-2">/ Assign-assets</span>
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
                        {employeeType.map((item, index) =>{
                          return (
                          <option value={item._id?item._id:item.id} key={index}>
                            {item.name}
                          </option>
                        )
                        })}
                      </select>
                      {errors?.user_id && (
                        <span className="text-warning-custom">
                          {errors.user_id.message}
                        </span>
                      )}
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Asset Details*</label>
                      <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Enter asset details"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Upload File*</label>
                      <input
                        type="file"
                        multiple
                        className="form-control"
                        {...register("file", { required: "File is required" })}
                      />
                      {errors.file && (
                        <span className="text-warning-custom">
                          {errors.file.message}
                        </span>
                      )}
                    </div>
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
                {submitMsg && (
                  <div className="mt-4 fs-4 text-danger">{submitMsg}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddOnboarding;
