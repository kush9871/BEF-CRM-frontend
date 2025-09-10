"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../../(dashboard)/components/react-responsive-table";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { toast } from "react-toastify";
import Axios from "app/config/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const OrganizationPage = () => {
  const [organization, setOrganization] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 10;
  const pathname = usePathname();

  const columns = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Address",
      key: "address",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "GST Number",
      key: "gstin",
    },
    {
      title: "CIN Number",
      key: "cin",
    },
    {
      title: "Phone",
      key: "phone",
    },
    {
      title: "Status",
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
          `${Baseurl}/organization/get-all-organization`,
          {
            authenticated: true,
          }
        );

        setOrganization(res.data.result);
        // setTotalPages(Math.ceil(res.data.total / limit));
      } catch (error) {
        console.error(error.message);
      }
    };

    fechData();
  }, []);

  //  const handlePageClick = (event) => {
  //   setPage(event.selected + 1);
  // };

  const handleDeleteAction = async (id) => {
    try {
      await Axios.delete(`${Baseurl}/organization/delete-organization/${id}`, {
        authenticated: true,
      });

      setOrganization(organization.filter((item) => item._id !== id));
      toast.success("Organization deleted successfully");
    } catch (error) {
      console.error(error.messsage);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Organizations</h1>
          <Breadcrumb>
            <Breadcrumb.Item
              href="/management/dashboard/organization"
              className="breadcrum-link"
            >
              Organization
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/organization/add-new"
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
                <ReactResponsiveTable columns={columns} data={organization} />

                {/* <ReactPaginate
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
                  /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrganizationPage;
