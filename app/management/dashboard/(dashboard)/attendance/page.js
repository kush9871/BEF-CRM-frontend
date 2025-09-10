"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../components/react-responsive-table";
import Link from "next/link";
import Axios from "app/config/axios";
import { Breadcrumb } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import formatDate from "app/components/formatDate";
import style from "styles/form.module.css"
import ReactPaginate from "react-paginate";


const BASE_URL = process.env.NEXT_PUBLIC_APIURL;

const Attendance = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
   const [totalPages, setTotalPages] = useState(0);
   const [page, setPage] = useState(1);
   const limit = 10;
  const pathname = usePathname();
  useEffect(() => {
    getAttendanceByDate(selectedDate || new Date().toISOString().split("T")[0]);
  }, [users, selectedDate,page]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await Axios.get(`${BASE_URL}/users/get-all-users`, {
        authenticated: true,
      });

      const usersData = response.data.results;
      setUsers(usersData);
      setData(usersData);

      const defaultStatus = {};
      usersData.forEach((user) => {
        defaultStatus[user.id] = user.attendance?.status || "Present";
      });
      setAttendanceStatus(defaultStatus);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message || error
      );
    }
  };

  const getAttendanceByDate = async (date) => {
    try {
      const res = await Axios.get(
        `${BASE_URL}/attendence/get-all-attendence-by-date/${date}?page=${page}&limit=${limit}`,
        { authenticated: true }
      );
      setData(res?.data?.result);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };
  const updateUserAttendance = async (user, status) => {
    try {
      const userId = user._id || user.id;

      if (!userId) {
        console.error("User ID is undefined for:", user);
        toast.error("Cannot update attendance. Invalid user.");
        return;
      }

      const payload = {
        date: selectedDate,
        leave_type: user.leave_type,
        status: status,
      };

      await Axios.post(
        `${BASE_URL}/attendence/create-attendence/${userId}`,
        payload,
        { authenticated: true }
      );

      toast.success(`Attendance updated: ${user.name} - ${status}`);

      // ✅ Refresh attendance data after successful update
      await getAttendanceByDate(selectedDate);
    } catch (error) {
      console.error(
        "Error updating attendance:",
        error.response?.data || error.message || error
      );
      toast.error("Failed to update attendance");
    }
  };

  const handleStatusChange = (id, status, row) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [id]: status,
    }));
    updateUserAttendance(row, status);
  };

  const columns = [
    { title: "Employee Name", key: "name" },
    { title: "Start Date", key: "startDate",render:(value)=><span>{formatDate(value)}</span> },
    { title: "End Date", key: "endDate",render:(value)=><span>{formatDate(value)}</span>  },
    { title: "Number Of Leaves", key: "noOfLeaves" },
    { title: "Reason", key: "reason" },
    {
      title: "Date",
      key: "date",
render: (value, row) => {
  const rowId = row._id || row.id;
  const currentStatus = Array.isArray(data)
    ? data.find((d) => (d._id || d.id) === rowId)?.attendance?.status
    : null;

  const isDisabled = row.leaveRequestStatus !== "approved";
  return (
    <div className={`d-flex align-items-center justify-content-center gap-3 mb-2 ${style.attendanceView}`}>
      {["Present", "Absent", "Half Day"].map((status) => (
        <div key={status} className="d-flex flex-column text-center">
          <label>{status}</label>
          <input
            type="radio"
            name={`status-${rowId}`}
            value={status}
            disabled={isDisabled }
            checked={
              currentStatus
                ? currentStatus === status
                : attendanceStatus[rowId] === status ||
                  (status === "Present" && !attendanceStatus[rowId])
            }
            onChange={() => handleStatusChange(rowId, status, row)}
          />
        </div>
      ))}
      <div className="d-flex flex-column text-center mt-4">
        <Link className="btn" href={`${pathname}/${rowId}`}>
          <span>
            <FaEye size={20} style={{ color: "#007bff" }} />
          </span>
        </Link>
      </div>
    </div>
  );
},
    },
  ];

     const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className={`breadcrumb-wrapper ${style.breadcrumbWrapper}`}>
        <div>
          <h1>Attendance</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className='breadcrum-link'>Dashboard</Link>
              <span className="ms-2">/ Attendance</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div>
            <label htmlFor="filter-date" className="form-label mb-0">
              Filter Date
            </label>
            <input
              type="date"
              id="filter-date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ minWidth: "180px" }}
            />
          </div>
        </div>
      </div>

      <section className="p-3">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pt-4 super-responsive-table">
                <ReactResponsiveTable
                  columns={columns}
                  data={data}
                  serialize={true}
                />
                
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    initialPage={page - 1}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPages}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    className='react-pagination'
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Attendance;
