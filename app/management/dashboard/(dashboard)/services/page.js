"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../(dashboard)/components/react-responsive-table";
import Link from "next/link";
import { toast } from "react-toastify";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Services = () => {
  const [services, setServices] = useState([]);
  const pathname = usePathname();
      const [totalPages, setTotalPages] = useState(0);
      const [page, setPage] = useState(1);
      const limit = 10;

  const columns = [
    {
      title: "Deduction",
      key: "title",
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
        const res = await Axios.get(`${Baseurl}/services/get-all-services?page=${page}&limit=${limit}`, {
          authenticated: true,
        });
        setServices(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching services:", error.message);
        toast.error("Failed to load services");
      }
    };

    fetchData();
  }, [page]);

  // ✅ Delete KPI
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/services/delete-service/${id}`, {
        authenticated: true,
      });
      setServices((prev) => prev.filter((item) => item._id !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while deleting Service"
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
          <h1>Services</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Services</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/services/add-new"
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
                <ReactResponsiveTable columns={columns} data={services} />

                
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

export default Services;
