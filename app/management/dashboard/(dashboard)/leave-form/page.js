"use client";

import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSession } from "node_modules/next-auth/react";
import { MdDeleteOutline } from "node_modules/react-icons/md";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Leave = () => {
  const session = useSession();
  const role = session?.data?.user?.role;
  const [leaveType, setLeaveType] = useState();
  const [employeeType, setEmployeeType] = useState();
  const [submitMsg, setSubmitMsg] = useState("");
  const [days, setDays] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [balanceLeave, setBalanceLeave] = useState();

  // New state for dynamic leave count add
  const [leaveEntries, setLeaveEntries] = useState([]);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState("");
  const [leaveCountInput, setLeaveCountInput] = useState("");
  const [loading,setLoading] = useState(false)
  const [leaveEntryError,setLeaveEntryError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedLeave = watch("leave_type");
  const advanceLeave = watch("advanceLeave");
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (advanceLeave && selectedLeave) {
      const getAllowAdvanceLeave =
        leaveType &&
        Array.isArray(leaveType) &&
        leaveType.find((item) => item._id == selectedLeave);
      if (getAllowAdvanceLeave?.allowAdvanceLeave) {
        return;
      } else {
        setLeaveError("Advance leave is not allowed for this leave type");
        setValue("advanceLeave", false);
        setTimeout(() => {
          return setLeaveError("");
        }, 10000);
      }
    }
  }, [advanceLeave, selectedLeave]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start <= end) {
        const timeDiff = end.getTime() - start.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);
        const leaveDays = dayDiff + 1;
        setDays(leaveDays);
        setValue("noOfLeaves", leaveDays);
      } else {
        setDays("");
        setValue("noOfLeaves", "");
      }
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = async (data) => {
    if(leaveEntries && leaveEntries.length == 0){
      return setLeaveEntryError("This field is required")
    }
    const payload = {
      user_id: data.user_id,
      leave_type: data.leave_type,
      startDate: data.startDate,
      endDate: data.endDate,
      noOfLeaves: data.noOfLeaves,
      reason: data.reason,
      advanceLeave: data.advanceLeave,
      leaveEntries: leaveEntries, // new data added
    };
    try {
      setLoading(true)
      await Axios.post(
        `${Baseurl}/Leave-request/create-leave-request`,
        payload,
        { authenticated: true }
      );
      reset();
      setLeaveEntries([]); // clear table
      toast.success("Leave Request created successfully");
      setSubmitMsg(
        "Leave request submitted successfully. The HR team will review it and get back to you shortly."
      );
      setLoading(false)
      setTimeout(() => {
        setSubmitMsg("");
      }, 6000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating leave request"
      );
      setLoading(false)
    }
  };

  useEffect(() => {
    getAllLeaveType();
    getAllEmployee();
  }, []);

  const getAllLeaveType = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/leave-type/get-all-leave-type`, {
        authenticated: true,
      });
      setLeaveType(res?.data?.results || []);
    } catch (error) {
      console.error(error.message);
    }
  };

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

  const balanceleaveHandler = async (userId) => {
    try {
      const res = await Axios.get(
        `${Baseurl}/Leave-request/get-balance-leave/${userId}`,
        {
          authenticated: true,
        }
      );
      setBalanceLeave(res?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Leave Request Form</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ leave-form</span>
          </Breadcrumb>
        </div>
      </div>

      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
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
                        onChange={(e) => balanceleaveHandler(e.target.value)}
                      >
                        <option value="" hidden>
                          Select Employee Name
                        </option>
                        {employeeType?.map((item, index) => (
                          <option value={item._id || item.id} key={index}>
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

                    <div className="mb-3 col-md-6">
                      <label className="form-label">Start Date*</label>
                      <input
                        type="date"
                        className="form-control form-control-sm mb-2"
                        {...register("startDate", {
                          required: "This field is required",
                        })}
                        min={new Date().toISOString().split("T")[0]} // sets min date to today
                      />
                      {errors?.startDate && (
                        <span className="text-warning-custom">
                          {errors.startDate.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 col-md-6">
                      <label className="form-label">End Date*</label>
                      <input
                        type="date"
                        className="form-control form-control-sm mb-2"
                        {...register("endDate", {
                          required: "This field is required",
                        })}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors?.endDate && (
                        <span className="text-warning-custom">
                          {errors.endDate.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 col-md-6">
                      <label className="form-label">No. of Leave</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control form-control-sm mb-2"
                        {...register("noOfLeaves")}
                      />
                    </div>

                    <div className="mb-3 col-md-6">
                      <label className="form-label">Reason*</label>
                      <textarea
                        className="form-control form-control-sm mb-2"
                        {...register("reason", {
                          required: "This field is required",
                        })}
                      />
                      {errors?.reason && (
                        <span className="text-warning-custom">
                          {errors.reason.message}
                        </span>
                      )}
                    </div>

                    {/* Leave Type */}
                    <div className="mb-3 col-md-6 d-flex gap-3 ">
                      <div className="row d-flex">
                      {/* Leave Type */}
                      <div className="col-5 flex-fill">
                        <label className="form-label">Leave Type*</label>
                        <select
                          className="form-control form-control-sm"
                          {...register("leave_type")}
                          value={selectedLeaveTypeId}
                          onChange={(e) => {
                            setSelectedLeaveTypeId(e.target.value);
                            setValue("leave_type", e.target.value);
                          }}
                        >
                          <option value="" hidden>
                            Select Leave Type
                          </option>
                          {leaveType?.map((item, index) => (
                            <option value={item._id} key={index}>
                              {item.type}
                            </option>
                          ))}
                        </select>
                        {/* {errors?.leave_type && (
                          <span className="text-warning-custom">
                            {errors.leave_type.message}
                          </span>
                        )} */}
                      </div>

                      {/* Leave Count Input */}
                      {selectedLeaveTypeId && (
                        <div className="col-5 flex-fill">
                          <label className="form-label">Leave Count</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={leaveCountInput}
                            onChange={(e) =>{ setLeaveCountInput(e.target.value);setLeaveEntryError("")}}
                            min={1}
                          />
                        </div>
                      )}

                      {/* Add Button */}
                      {selectedLeaveTypeId && (
                        <div className="col-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm mt-5"
                            onClick={() => {
                              const typeObj = leaveType.find(
                                (t) => t._id === selectedLeaveTypeId
                              );
                              const alreadyAdded = leaveEntries.find(
                                (e) => e.typeId === selectedLeaveTypeId
                              );

                              if (!leaveCountInput || !typeObj || alreadyAdded)
                                return;

                              setLeaveEntries((prev) => [
                                ...prev,
                                {
                                  typeId: selectedLeaveTypeId,
                                  type: typeObj.type,
                                  count: leaveCountInput,
                                  allowAdvanceLeave: typeObj.allowAdvanceLeave,
                                },
                              ]);

                              setSelectedLeaveTypeId("");
                              setLeaveCountInput("");
                              setValue("leave_type", "");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      )}
                        <div>{leaveEntryError && <span>{leaveEntryError}</span>}</div>
                      </div>
                    </div>
                    {leaveEntries.length > 0 && (
  <div className="mt-4">
    <h5>Added Leave Types</h5>
    <table className="table table-bordered table-sm">
      <thead>
        <tr>
          <th>Leave Type</th>
          <th>Leave Count</th>
          <th>Advance Leave</th>
          <th>Action</th> {/* New column for delete button */}
        </tr>
      </thead>
      <tbody>
        {leaveEntries.map((entry, index) => (
          <tr key={index}>
            <td>{entry.type}</td>
            <td>{entry.count}</td>
            <td>
        {entry.allowAdvanceLeave ? (
          <input
            type="checkbox"
            className="form-check-input"
           
            {...register("advanceLeave")}
            id="advanceLeave"
            
          />
        ) : (
          "-"
        )}
      </td>
            <td>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  // Remove the clicked row by index
                  setLeaveEntries((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              >
              <span>
                            <MdDeleteOutline />
                          </span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

                    {/* Advance Leave Checkbox */}
                    {/* <div className="mb-3 col-md-6">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="advanceLeave"
                        {...register("advanceLeave")}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="advanceLeave"
                      >
                        Advance Leave
                      </label>
                    </div> */}
                  </div>

                  <Col className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Submiting..." : "Submit"}
                    </Button>
                  </Col>
                </Form>

                {submitMsg && (
                  <div className="mt-4 fs-5 text-success">{submitMsg}</div>
                )}
                {leaveError && (
                  <div className="mt-4 fs-5 text-danger">{leaveError}</div>
                )}

                {/* Added Leave Table */}
              </div>
            </div>

            {/* Balance Leave Table */}
            <div className="col-md-4">
              <div className="card">
                <h2 className="ms-4 mt-3">Balance Leave</h2>
                <div className="card-body pt-4">
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>
                            <b>Leave type</b>
                          </th>
                          <th>
                            <b>Allow Leave</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {balanceLeave?.length > 0 ? (
                          balanceLeave.map((item, index) => (
                            <tr key={item._id || index}>
                              <td>{item.type}</td>
                              <td>
                                {item.monthlyBalance?.[
                                  String(new Date().getMonth() + 1).padStart(
                                    2,
                                    "0"
                                  )
                                ] ?? item.yearlyBalance}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center">
                              No Leave Types Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Leave;
