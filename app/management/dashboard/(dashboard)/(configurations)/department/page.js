"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../../(dashboard)/components/react-responsive-table";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Axios from "app/config/axios";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Department = () => {
  const [department, setDepartment] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1); // start from page 1
  const limit = 10;
  const pathname = usePathname();

  const columns = [
    {
      title: "Department",
      key: "title",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Status",
      key: "is_active",
      render: (value) => (value ? "Active" : "Inactive"),
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

  // Fetch data with pagination
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/department/get-all-department?page=${page}&limit=${limit}`,
          { authenticated: true }
        );

        setDepartment(res.data.results || []);
        setTotalPages(res.data.totalPages || 0); // backend gives totalPages
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [page]);

  // Delete Action
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/department/delete-department/${id}`, {
        authenticated: true,
      });

      setDepartment((prev) => prev.filter((item) => item._id !== id));
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Pagination click
  const handlePageClick = (event) => {
    setPage(event.selected + 1); // react-paginate starts from 0
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Departments</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className="breadcrum-link">
                Dashboard
              </Link>
              <span className="ms-2">/ Departments</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/department/add-new"
            className="btn btn-outline-primary"
          >
            <i className="bi bi-plus-lg me-1"></i>Add
          </Link>
        </div>
      </div>

      <section className="table-parent-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pt-4 super-responsive-table">
                <ReactResponsiveTable columns={columns} data={department}/>

                {totalPages > 1 && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Department;
