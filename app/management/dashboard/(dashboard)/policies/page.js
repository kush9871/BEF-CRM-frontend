"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../(dashboard)/components/react-responsive-table";
import Link from "next/link";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Axios from "app/config/axios";
import { MdOutlineFileDownload } from "react-icons/md";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;
const Imgurl = process.env.NEXT_PUBLIC_IMG_URL;

const Policies = () => {
  const [Policies, setPolicies] = useState([]);
  const session = useSession();
  const role = session?.data?.user?.role;
  const pathname = usePathname();
        const [totalPages, setTotalPages] = useState(0);
        const [page, setPage] = useState(1);
        const limit = 10;
  const columns = [
    {
      title: "Policy Name",
      key: "title",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Download",
      render: (value, row) => {
        const filePath = row.file?.filename;

        const fileUrl = `${Imgurl}/public/${filePath}`;

        return row.file ? (
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <MdOutlineFileDownload size={20} style={{ cursor: "pointer" }} />
          </a>
        ) : (
          "-"
        );
      },
    },
    ...(role && role !== "user"
      ? [
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
                <button
                  className="btn"
                  onClick={() => handleDeleteAction(value)}
                >
                  <span>
                    <MdDeleteOutline />
                  </span>
                </button>
              </>
            ),
          },
        ]
      : []),
  ];

  useEffect(() => {
    const fechData = async () => {
      try {
        const res = await Axios.get(`${Baseurl}/policies/get-all-policies?page=${page}&limit=${limit}`, {
          authenticated: true,
        });

        setPolicies(res.data.results);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error(error.message);
      }
    };

    fechData();
  }, [page]);

   const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/policies/delete-policy/${id}`, {
        authenticated: true,
      });
      setPolicies(Policies.filter((item) => item._id !== id));
      toast.success("Policy deleted successfully");
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred while deleting policy"
      );
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Policies</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Policies</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          {role && role != "user" && (
            <Link
              href="/management/dashboard/policies/add-new"
              className="btn btn-outline-primary"
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add
            </Link>
          )}
        </div>
      </div>

      <section className="table-parent-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pt-4 super-responsive-table">
                <ReactResponsiveTable columns={columns} data={Policies} />

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
export default Policies;
