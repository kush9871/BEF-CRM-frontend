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

const Intentform = () => {
  const [kpis, setKpis] = useState([]);
  const [offerLetters, setOfferLetters] = useState([]); // ✅ store all offer letters
  const [selectedOffers, setSelectedOffers] = useState({}); // ✅ track selected offer per user
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ Fetch intent users
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
        console.error("Error fetching KPIs:", error.message);
        toast.error("Failed to load KPIs");
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
        console.error("Error fetching offer letters:", error.message);
        toast.error("Failed to load offer letters");
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
      title: "Intent Letter",
      key: "_id",
      render: (id) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => toast.info(`Send Intent Letter for ${id}`)}
        >
          Send
        </button>
      ),
    },

    // Offer Letter dropdown + Send button
    {
      title: "Offer Letter",
      key: "_id",
      render: (id) => (
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={selectedOffers[id] || ""}
            onChange={(e) => handleSelectOfferLetter(id, e.target.value)}
          >
            <option value="">Select Offer Letter</option>
            {offerLetters.map((offer) => (
              <option key={offer.type} value={offer.type}>
                {offer.title || ` ${offer.type}`}
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleSendOffer(id)}
            disabled={!selectedOffers[id]}
          >
            Send
          </button>
        </div>
      ),
    },

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
        console.error("Error fetching KPIs:", error.message);
        toast.error("Failed to load KPIs");
      }
    };

    fetchData();
  }, [page]);

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Intent</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Intent</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/intent_form/add-new"
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

export default Intentform;
