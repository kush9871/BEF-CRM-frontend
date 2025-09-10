"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {Button } from "react-bootstrap";
import Link from "next/link";
import Axios from "app/config/axios";
import { useRouter } from "next/navigation";
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const API_URL = process.env.NEXT_PUBLIC_APIURL;

const Attendance = () => {
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const status = watch("status");
  const showTimeFields = status === "Present" || status === "Half Day";
  const showDescriptionField =
    status === "Absent" || status === "Half Day" || status === "Leave";

  const onSubmit = async (data) => {
    const result = {
      name: data.name,
      date: data.date,
      status: data.status,
    };

    if (status === "Present" || status === "Half Day") {
      result.checkin = data.checkin;
      result.checkout = data.checkout;
    }

    if (status !== "Present") {
      result.remark = data.remark;
    }

    try {
      const response = await Axios.post(`${API_URL}/attendence/create-attendence`, result,{
        authenticated:true
      });
      reset();
      router.push("/management/dashboard/attendance"); // ✅ Redirect after successful submission
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
    <div className='breadcrumb-wrapper'>
 <div>
    <h1>
       Attendance
    </h1>
    <Breadcrumb>
      
      <Breadcrumb.Item href="/management/dashboard/attendance" className='breadcrum-link'>
       Organization
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/management/dashboard/attendance/add-new">
       Add
      </Breadcrumb.Item>
    </Breadcrumb>
 </div>
<div className='dashboard-back-btn'>
              <Link href="/management/dashboard/attendance" className="btn btn-outline-primary"> <i className="bi bi-arrow-left me-1"></i>Back</Link>
            </div>
            </div>
      <section className="p-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="dashboard-form-wrapper">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    {/* Name */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Employee Name*</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2"
                        {...register("name", {
                          required: "This field is required",
                        })}
                      />
                      {errors?.name && <span className="text-danger">{errors.name.message}</span>}
                    </div>

                    {/* Date */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Date*</label>
                      <input
                        type="date"
                        className="form-control form-control-sm mb-2"
                        {...register("date", {
                          required: "This field is required",
                        })}
                      />
                      {errors?.date && <span className="text-danger">{errors.date.message}</span>}
                    </div>

                    {/* Status */}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Status*</label>
                      <select
                        className="form-control form-control-sm mb-2"
                        {...register("status", {
                          required: "This field is required",
                        })}
                      >
                        <option value="">-- Select an option --</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Leave">Leave</option>
                      </select>
                      {errors?.status && <span className="text-danger">{errors.status.message}</span>}
                    </div>

                    {/* Time fields if Present or Half Day */}
                    {showTimeFields && (
                      <>
                        <div className="mb-3 col-md-6">
                          <label className="form-label">Check In*</label>
                          <input
                            type="time"
                            className="form-control form-control-sm mb-2"
                            {...register("checkin", {
                              required: "This field is required",
                            })}
                          />
                          {errors?.checkin && (
                            <span>{errors.checkin.message}</span>
                          )}
                        </div>

                        <div className="mb-3 col-md-6">
                          <label className="form-label">Check Out*</label>
                          <input
                            type="time"
                            className="form-control form-control-sm mb-2"
                            {...register("checkout", {
                              required: "This field is required",
                            })}
                          />
                          {errors?.checkout && (
                            <span>{errors.checkout.message}</span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Remark field if Absent / Half Day / Leave */}
                    {showDescriptionField && (
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Description*</label>
                        <textarea
                          type="text"
                          className="form-control form-control-sm mb-2"
                          {...register("remark", {
                            required: "This field is required",
                          })}
                        />
                        {errors?.remark && <span>{errors.remark.message}</span>}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Attendance;
