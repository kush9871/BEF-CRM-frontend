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

const DepartmentHead = () => {
  const [department_head, setDepartment_head] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const pathname = usePathname();

  const columns = [
    {
      title: "Department",
      key: "departmentId",
      render:(_,row)=>{
        return <span>{row?.departmentId?.title}</span>
      }
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "status",
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
    const fechData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/department_head/get-all-department_head?page=${page}&limit=${limit}`,
          {
            authenticated: true,
          }
        );
        setDepartment_head(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error(error.message);
      }
    };

    fechData();
  }, [page]);

  // Pagination click
  const handlePageClick = (event) => {
    setPage(event.selected + 1); // react-paginate starts from 0
  };

  const handleDeleteAction = async (id) => {
  try {
    await Axios.delete(`${Baseurl}/department_head/delete-department_head/${id}`, {
      authenticated: true,
    });

    setDepartment_head(department_head.filter((item) => item._id !== id));
    toast.success("Department Head deleted successfully");
  } catch (error) {
    console.error(error.message);
    toast.error("Failed to delete DepartmentHead");
  }
};

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Department Heads</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className="breadcrum-link">
                Dashboard
              </Link>
              <span className="ms-2">/ Department_Head</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/department_head/add-new"
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
                <ReactResponsiveTable columns={columns} data={department_head} />

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
export default DepartmentHead;
