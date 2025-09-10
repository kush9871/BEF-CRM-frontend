"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../../(dashboard)/components/react-responsive-table";
import Link from "next/link";
import { toast } from "react-toastify";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const EmployeeType = () => {
  const [kpis, setKpis] = useState([]);
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

const columns = [
  {
    title: "Title",
    key: "type",
  },
  {
    title: "Time Period",
    key: "timePeriod",
  },
  {
    title: "Color",
    key: "colorCode",
    render: (color) => (
      <div
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: color,
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        className="text-center"
        title={color} // shows hex code on hover
      />
    ),
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Actions",
    key: "_id",
    render: (value) => (
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


  // ✅ Get KPI data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/employee-type/get-all-employee-type?page=${page}&limit=${limit}`,

          {
            authenticated: true,
          }
        );
        setKpis(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching KPIs:", error.message);
        toast.error("Failed to load KPIs");
      }
    };

    fetchData();
  }, [page]);

  // ✅ Delete KPI
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(
        `${Baseurl}/employee-type/delete-employee-type/${id}`,
        {
          authenticated: true,
        }
      );
      setKpis((prev) => prev.filter((item) => item._id !== id));
      toast.success("Employee Type deleted successfully");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while deleting Employee Type"
      );
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Employee Type</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Employee Type</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/employee_type/add-new"
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
                <ReactResponsiveTable columns={columns} data={kpis} />

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
                  className="react-pagination"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmployeeType;
