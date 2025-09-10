"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams, useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateAnnouncement = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [currentAnnouncement, setcurrentAnnouncement] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const AnnouncementId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/announcement/get-announcement-by-id/${AnnouncementId}`,
          {
            authenticated: true, // Only useful if Axios interceptors handle this
          }
        );
        setcurrentAnnouncement(res.data || {});
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    })();
  }, [AnnouncementId]);

  useEffect(() => {
    if (currentAnnouncement) {
      setValue("title", currentAnnouncement.title || "");
      setValue("description", currentAnnouncement.description || "");

      if (currentAnnouncement.DOP) {
        const date = new Date(currentAnnouncement.DOP);
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        setValue("DOP", formattedDate);
      }

      setValue("is_active", currentAnnouncement?.is_active === "inactive");
    }
  }, [currentAnnouncement, setValue]);

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";
    try {
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/announcement/update-announcement/${AnnouncementId}`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Announcement updated successfully");
      setLoading(false);
      router.replace("/management/dashboard/announcement");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating Announcement"
      );

      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Announcement</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/announcement"
            >
              / Announcement
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/announcement"
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
                  {/* Title */}
                  <Col md={6} className="mb-3">
                    <label className="form-label">Announcement Title*</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...register("title", {
                        required: "This field is required",
                      })}
                    />
                    {errors.title && (
                      <span className="text-warning-custom">
                        {errors.title.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      {...register("description", {})}
                    />
                    {errors.description && (
                      <span className="text-warning-custom">
                        {errors.description.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label">Date Of Publish*</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      {...register("DOP", {
                        required: "This field is required",
                      })}
                    />
                    {errors.DOP && (
                      <span className="text-warning-custom">
                        {errors.DOP.message}
                      </span>
                    )}
                  </Col>

                  <Col md={6} className="mb-3 d-flex align-items-end">
                    <div className="form-check form-switch ">
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

export default UpdateAnnouncement;
