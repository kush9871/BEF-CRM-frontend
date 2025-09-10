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

const EmpExit = () => {
  const [kpis, setKpis] = useState([]);
  const [offerLetters, setOfferLetters] = useState([]); // ✅ store all offer letters
  const [selectedOffers, setSelectedOffers] = useState({}); // ✅ track selected offer per user
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ Fetch employee users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/intent-user/get-all-intent?page=${page}&limit=${limit}`,
          { authenticated: true }
        );
        setKpis(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        toast.error(error.response.data.message || "Failed to load KPIs");
      }
    };

    fetchData();
  }, [page]);

  // ✅ Fetch all offer letters (once)
  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/offer-latter/get-all-offer-latter?page=1&limit=1000`,
          { authenticated: true }
        );
        setOfferLetters(res.data.results || []);
      } catch (error) {
        toast.error(error.response.data.message || "Failed to load KPIs");
      }
    };

    fetchOfferLetters();
  }, []);

  // ✅ Handle dropdown selection
  const handleSelectOfferLetter = (userId, offerId) => {
    setSelectedOffers((prev) => ({
      ...prev,
      [userId]: offerId,
    }));
  };

  // ✅ Handle send button
  const handleSendOffer = async (userId) => {
    const offerId = selectedOffers[userId];
    if (!offerId) {
      toast.error("Please select an offer letter first");
      return;
    }

    try {
      await Axios.post(
        `${Baseurl}/offer-latter/send-offer/${userId}`,
        { offerId },
        { authenticated: true }
      );
      toast.success("Offer letter sent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send offer letter"
      );
    }
  };

  // ✅ Delete KPI
  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/intent-user/delete-intent/${id}`, {
        authenticated: true,
      });
      setKpis((prev) => prev.filter((item) => item._id !== id));
      toast.success("Intent user deleted successfully");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while deleting Intents"
      );
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  // ✅ Table columns
  const columns = [
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Phone Number", key: "phoneNumber" },

    // Intent Letter button
    {
      title: "Approved By Admin",
      key: "_id",
      render: (id) => <span>Pending</span>,
    },

    // Offer Letter dropdown + Send button

    // Actions
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
          `${Baseurl}/intent-user/get-all-intent?page=${page}&limit=${limit}`,
          {
            authenticated: true,
          }
        );
        setKpis(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        toast.error(error.response.data.message || "Failed to load KPIs");
      }
    };

    fetchData();
  }, [page]);

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Employee Exit</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Employee Exit</span>
          </Breadcrumb>
        </div>

        <div className="dashboard-add-btn">
          <button className="btn btn-primary me-2">Approved</button>
          <Link
            href="/management/dashboard/emp_exit/add-new"
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

export default EmpExit;
