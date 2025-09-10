"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../../(dashboard)/components/react-responsive-table";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { toast } from "react-toastify";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import formatDate from "app/components/formatDate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Leave = () => {
  const [leave, setLeave] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const pathname = usePathname();

  const columns = [
    {
      title: "Leave Type",
      key: "type",
    },
    {
      title: "Start Date",
      render: (_, row) => <span>{formatDate(row?.leaveYear?.startDate)}</span>,
    },
    {
      title: "Start Date",
      render: (_, row) => <span>{formatDate(row?.leaveYear?.endDate)}</span>,
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Allow Advance Leave",
      key: "allowAdvanceLeave",
      render: (value)=><span>{value ? "true" : "false"}</span>
    },
    {
      title: "Paid Leave",
      key: "paidLeave",
      render: (value)=><span>{value ? "true" : "false"}</span>
    },
    {
      title: "Status",
      key: "is_active",
    },
    {
      title: "Actions",
      key: "_id",
      render: (value, row, index) => (
        <>
          <Link className="btn" href={`${pathname}/${value}`}>
            <span>
              <CiEdit />
            </span>
          </Link>
          <button className="btn" onClick={() => handleDeleteAction(value)}>
            <span>
              <MdDeleteOutline />
            </span>
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getAllLeaveType();
  }, [page]);

  const getAllLeaveType = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/leave-type/get-all-leave-type?page=${page}&limit=${limit}`, {
        authenticated: true,
      });

      setLeave(res.data.results);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error(error.message);
    }
  };

   const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  const handleDeleteAction = async (id) => {
    try {
      await Axios.put(`${Baseurl}/leave-type/delete-leave-type/${id}`, null, {
        authenticated: true,
      });
      setLeave(leave.filter((item) => item._id !== id));
      toast.success("leave deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while deleting leave type"
      );
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Leave Types</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className="breadcrum-link">
                Dashboard
              </Link>
              <span className="ms-2">/ Leave Types</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/leave/add-new"
            className="btn btn-outline-primary"
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add
          </Link>
        </div>
      </div>
      <section className="table-parent-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pt-4 super-responsive-table">
                <ReactResponsiveTable columns={columns} data={leave} />

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
export default Leave;
