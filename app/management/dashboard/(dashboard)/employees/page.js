"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../components/react-responsive-table";
import Link from "next/link";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Breadcrumb } from "node_modules/react-bootstrap/esm";
import formatDate from "app/components/formatDate";
import { Button } from "react-bootstrap";
import { toast } from "node_modules/react-toastify/dist";
import { useSession } from "next-auth/react";
import style from "styles/form.module.css";
import axios from "node_modules/axios";
import ReactPaginate from "react-paginate";

const API_URL = process.env.NEXT_PUBLIC_APIURL;

const UserProfile = () => {
  const session = useSession();
  const role = session?.data?.user?.role;
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState();
  const [loadingId, setLoadingId] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    getEmployees();
  }, [selectedName, page]);

  const getEmployees = async () => {
    try {
      const queryParams = selectedName ? `?name=${selectedName}` : "";
      const response = await Axios.get(
        `${API_URL}/users/get-all-users${queryParams}?page=${page}&limit=${limit}`,
        {
          authenticated: true,
        }
      );
      setData(response.data.results);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteAction = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      await Axios.delete(
        `${API_URL}/attendence/delete-attendence-by-id/${id}`,
        {
          authenticated: true,
        }
      );
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting employee"
      );
    }
  };

  const paymentSlipHandler = async (id) => {
    try {
      setLoadingId(id);
      await Axios.post(
        `${API_URL}/payment-slip/create-payment-slip/${id}`,
        null,
        {
          authenticated: true,
        }
      );
      toast.success("User Payment is generated successfully");

      if (data && Array.isArray(data)) {
        const index = data.findIndex(
          (item) => item._id === id || item.id === id
        );
        if (index !== -1) {
          const updatedData = [...data];
          updatedData[index] = {
            ...updatedData[index],
            paymentSlip: "generated",
          };
          setData(updatedData);
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while generating payment slip"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    { title: "Name", key: "name" },
    {
      title: "Designation",
      key: "designation_id",
      render: (_, row) => <span>{row.designation_id?.designation}</span>,
    },
    {
      title: "Joining Date",
      key: "joiningDate",
      render: (value) => <span>{formatDate(value)}</span>,
    },
    { title: "Contact Number", key: "contactNo" },

    ...(role === "admin"
      ? [
          {
            title: "Actions",
            key: "id",
            render: (value, row) => (
              <>
                <Link
                  className="btn me-2"
                  href={`/management/dashboard/profile/${row._id || row.id}`}
                >
                  <CiEdit />
                </Link>
                <button
                  className="btn"
                  onClick={() => handleDeleteAction(value)}
                >
                  <MdDeleteOutline />
                </button>
              </>
            ),
          },
          {
            title: "Payment Slip",
            key: "id",
            render: (value, row) => (
              <Button
                disabled={
                  loadingId === row._id ||
                  loadingId === row.id ||
                  row?.paymentSlip === "generated"
                }
                onClick={() => paymentSlipHandler(row._id || row.id)}
              >
                {loadingId === row._id || loadingId === row.id
                  ? "Generating..."
                  : row?.paymentSlip === "generated"
                  ? "Generated"
                  : "Generate"}
              </Button>
            ),
          },
        ]
      : []),
  ];
  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className={`breadcrumb-wrapper ${style.breadcrumbWrapper}`}>
        <div>
          <h1>Employees</h1>
          <Breadcrumb>
            <Breadcrumb>
              <Link href="/management/dashboard" className="breadcrum-link">
                Dashboard
              </Link>
              <span className="ms-2">/ Employees</span>
            </Breadcrumb>
          </Breadcrumb>
        </div>

        <div className="dashboard-add-btn">
          <div className="me-3">
            <input
              type="text"
              id="name"
              className="form-control mt-2"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              style={{ minWidth: "180px" }}
              placeholder="Search by Name"
            />
          </div>
          {role && role == "admin" && (
            <Link
              href="/management/dashboard/employees/add-new"
              className="btn btn-outline-primary"
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add
            </Link>
          )}
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
                  startIndex={(page - 1) * limit}
                  rowStyle={(row) => ({
                    backgroundColor: row.empType_id?.colorCode || "transparent",
                    color: row.empType_id ? "#fff" : "inherit", // ✅ text white only if empType_id exists
                  })}
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

export default UserProfile;
