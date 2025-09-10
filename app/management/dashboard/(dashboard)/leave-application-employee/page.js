"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../components/react-responsive-table";
import Link from "next/link";
import Axios from "app/config/axios";
import { Breadcrumb } from "react-bootstrap";
import formatDate from "app/components/formatDate";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import style from "styles/form.module.css";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UserProfile = () => {
  const [data, setData] = useState([]);
  const [departmentHead, setDepartmentHead] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading,setLoading] = useState(false)

  const pathname = usePathname();

  useEffect(() => {
    getEmployees();
  }, [selectedDate, page]);

  const transformData = (apiData) => {
    return apiData.map(item => {
      const firstReq = item.requests[0];
      const lastReq = item.requests[item.requests.length - 1];

      return {
        _id: item.requestId,
        user_id: firstReq.user,
        leave_type: item.requests.map(r => r.leaveType?.type).join(", "),
        startDate: formatDate(firstReq.startDate),
        endDate: formatDate(lastReq.endDate),
        noOfLeaves: item.requests.map(r => r.noOfLeaves).join(", "),
        reason: firstReq.reason,
        status: firstReq.status,
        requests: item.requests,
      };
    });
  };

  const getEmployees = async () => {
    try {
      const queryParams = selectedDate ? `?targetDate=${selectedDate}` : '';
      const response = await Axios.get(
        `${Baseurl}/Leave-request/get-all-leave-request${queryParams}&page=${page}&limit=${limit}`,
        { authenticated: true }
      );

      setDepartmentHead(response.data.isDepartmentHead);
      setData(transformData(response.data.result));
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const leaveRequestHandler = async (requestId, userId, status) => {
  try {
    setLoading(true)
    const payload = {
      leaveRequestId: requestId, // send parent requestId
      user_id: userId,
      status,
    };

    await Axios.post(
      `${Baseurl}/Leave-request/update-Leave-request`,
      payload,
      { authenticated: true }
    );

    // Update status locally
    const updatedData = data.map(row => {
      if (row._id === requestId) {
        return { ...row, status };
      }
      return row;
    });
    setData(updatedData);
   setLoading(false)
    toast.success("Leave Request Updated successfully");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "An error occurred while updating leave request"
    );
    setLoading(false)
  }
};


  const columns = [
    {
      title: "Employee Name",
      key: "user_id",
      render: (value) => <span>{value?.name || "N/A"}</span>,
    },
    {
      title: "Leave Type",
      key: "leave_type",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "Start Date",
      key: "startDate",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "End Date",
      key: "endDate",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "No. of Leave",
      key: "noOfLeaves",
    },
    {
      title: "Reason",
      key: "reason",
    },
    {
      title: "Status",
      key: "status",
    },
{
  title: "Actions",
  render: (_, row) => {
    const requestId = row._id; // parent requestId
    const userId = row.user_id?._id;

    return (
      <div>
        <button
          className="btn btn-primary me-2"
          disabled={loading || row.status === "approved" || row.status === "rejected"}
          onClick={() => leaveRequestHandler(requestId, userId, "approved")}
        >
          Approve
        </button>
        <button
          className="btn btn-secondary"
          disabled={loading || row.status === "approved" || row.status === "rejected"}
          onClick={() => leaveRequestHandler(requestId, userId, "rejected")}
        >
          Reject
        </button>
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
      <div className={`breadcrumb-wrapper ${style.leavebreadcrumbWrapper}`}>
        <div>
          <h1>Leave Application - Employee</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className='breadcrum-link'>Dashboard</Link>
            <span className="ms-2">/ Leave Application-Employee</span>
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
    </>
  );
};

export default UserProfile;
