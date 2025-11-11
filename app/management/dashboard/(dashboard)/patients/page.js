"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../components/react-responsive-table";
import Link from "next/link";
import { toast } from "react-toastify";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const pathname = usePathname();
      const [totalPages, setTotalPages] = useState(0);
      const [page, setPage] = useState(1);
      const limit = 10;

  const columns = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Age",
      key: "age",
    },
    {
      title: "Phone Number",
      key: "mobile",
    },
    {
      title: "Address",
      key: "address",
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
        const res = await Axios.get(`${Baseurl}/patients/get-all-patient?page=${page}&limit=${limit}`, {
          authenticated: true,
        });
        setPatients(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching Patients:", error.message);
        toast.error("Failed to load patient");
      }
    };

    fetchData();
  }, [page]);

  // ✅ Delete KPI
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/patients/delete-patient/${id}`, {
        authenticated: true,
      });
      setPatients((prev) => prev.filter((item) => item._id !== id));
      toast.success("Patient deleted successfully");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while deleting Patient"
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
          <h1>Patients</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Patients</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/patients/add-new"
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
                <ReactResponsiveTable columns={columns} data={patients} />

                
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

export default Patients;
