"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../components/react-responsive-table";
import Link from "next/link";
import Axios from "app/config/axios";
import { MdDeleteOutline } from "react-icons/md";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { CiEdit } from "react-icons/ci";
import style from "styles/form.module.css";
import { toast } from "react-toastify";
import { usePathname } from "node_modules/next/navigation";
import { MdOutlineFileDownload } from "react-icons/md";
import ReactPaginate from "react-paginate";

const API_URL = process.env.NEXT_PUBLIC_APIURL;
const Imgurl = process.env.NEXT_PUBLIC_IMG_URL;

const UserProfile = () => {
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState();
  const pathname = usePathname();
   const [totalPages, setTotalPages] = useState(0);
   const [page, setPage] = useState(1);
   const limit = 10;
  useEffect(() => {
    getEmployees();
  }, [selectedName,page]);

  const getEmployees = async () => {
    try {
      const queryParams = selectedName ? `?name=${selectedName}` : "";
      const response = await Axios.get(
        `${API_URL}/Onboarding/get-all-onboarding${queryParams}?page=${page}&limit=${limit}`,
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
  try {
    await Axios.delete(`${API_URL}/Onboarding/delete-onboarding/${id}`, {
      authenticated: true,
    });

    setData((prevData) => prevData.filter((item) => item._id !== id));
    toast.success("Onboarding deleted successfully");
  } catch (error) {
    console.error(error.message);
    toast.error("Failed to delete Onboarding");
  }
};


  const columns = [
    { title: "Employee Name", key: "user_id",
      render:(_,row)=>{
        return(<span>{row?.user_id?.name}</span>)
      }
     },
      {
        title: "Assets",
        key: "assets",
        render: (_, row) => {
          if (Array.isArray(row.assets) && row.assets.length > 0) {
            return row.assets.join(", ");
          }
          return "-";
        },
      },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Download",
      render: (value, row) => {
        const filePath = row.files?.filename;
     
        const fileUrl = `${Imgurl}/public/${filePath}`;
        return row.files ? (
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <MdOutlineFileDownload size={20} style={{ cursor: "pointer" }} />
          </a>
        ) : (
          "-"
        );
      },
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
            <MdDeleteOutline />
          </button>
        </>
      ),
    },
  ];
       const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className={`breadcrumb-wrapper ${style.leavebreadcrumbWrapper}`}>
        <div>
          <h1>Onboarding</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Onboarding</span>
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
          <Link
            href="/management/dashboard/onboarding/add-new"
            className="btn btn-outline-primary"
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add
          </Link>
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
                  serialize={true}
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

export default UserProfile;
