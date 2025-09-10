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

const Holiday = () => {
  const [holiday, setHoliday] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const pathname = usePathname();

  const columns = [
    {
      title: "Holiday",
      key: "name",
    },
    {
      title: "StartDate",
      key: "startDate",
      render: (_, row) => <span>{formatDate(row.startDate)}</span>,
    },
    {
      title: "EndDate",
      key: "endDate",
      render: (_, row) => <span>{formatDate(row.endDate)}</span>,
    },
    {
      title: "Type",
      key: "type",
    },
    {
      title: "Description",
      key: "description",
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
    getHolidays();
  }, [page]);

  const getHolidays = async () => {
    try {
      const res = await Axios.get(`${Baseurl}/holiday/get-all-holiday?page=${page}&limit=${limit}`, {
        authenticated: true,
      });

      setHoliday(res?.data?.results);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/holiday/delete-holiday/${id}`, {
        authenticated: true,
      });

      setHoliday(holiday.filter((item) => item._id !== id));
      toast.success("Holiday deleted successfully");
    } catch (error) {
      console.error(error.messsage);
    }
  };

     const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Holidays</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className="breadcrum-link">
                Dashboard
              </Link>
              <span className="ms-2 ">/ Holidays</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/holidays/add-new"
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
                <ReactResponsiveTable columns={columns} data={holiday} />

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
export default Holiday;
