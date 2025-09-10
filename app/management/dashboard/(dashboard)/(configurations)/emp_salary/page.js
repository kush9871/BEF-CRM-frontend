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
import { MdOutlineFileDownload } from "react-icons/md";
import PaymentPdf from "app/components/payslip";
import { useSession } from "node_modules/next-auth/react";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Salary = () => {
  const [salary, setSalary] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const pathname = usePathname();
  const session = useSession();


  const handleCheckboxChange = (e, row) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, row._id]); // add row ID
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== row._id)); // remove row ID
    }
  };

const columns = [
    {
      title: "",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row._id)}
          onChange={(e) => handleCheckboxChange(e, row)}
        />
      ),
    },
  {
    title: "Name",
    render: (_, row) => <span>{row?.user_id?.name || ""}</span>,
  },
  {
    title: "Basic Salary",
    key: "original_basicSalary",
  },
  {
    title: "Year",
    key: "year",
  },
  {
    title: "Month",
    key: "month",
  },
  {
    title: "Total Allowances(%)",
    key: "totalAllowancePercentage",
  },
  {
    title: "Total Deductions(%)",
    key: "totalDeductionPercentage",
  },
  {
    title: "Additional Leave",
    key: "additionalLeave",
  },
  {
    title: "Net Income",
    key: "netIncome",
  },
  {
    title: "Approved By Admin",
    key: "approvedByAdmin",
  },
  {
    title: "Approved By Accountant",
    key: "approvedByAccountant",
  },
  {
    title: "Download",
    render: (_, row) => {
      const handleDownload = async () => {
        const blob = await PaymentPdf(row);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "Static-SalarySlip.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      };

      return (
        <MdOutlineFileDownload
          size={20}
          style={{ cursor: "pointer" }}
          onClick={handleDownload}
        />
      );
    },
  },
];


  useEffect(() => {
    const fechData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/payment-slip/get-all-employees-monthly-salary?page=${page}&limit=${limit}`,
          {
            authenticated: true,
          }
        );

        setSalary(res.data.results);
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

  const salaryHandler=async(status)=>{
    // return console.log(selectedRows,"selected rows",status,"status")
            const res = await Axios.put(
          `${Baseurl}/payment-slip/update/${selectedRows}/${status}`,
          {
            authenticated: true,
          }
        ); 
     console.log(res,"testing res")
  }

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Salary</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className='breadcrum-link'>Dashboard</Link>
            <span className="ms-2">/ Salary</span>
          </Breadcrumb>
        </div>
          <div className="d-flex align-items-center">
          <button className="btn btn-primary ms-4" onClick={()=>salaryHandler("approve")}>Approve</button>
          <button className="btn btn-secondary ms-4" onClick={()=>salaryHandler("reject")}>Reject</button>
          </div>
      </div>
      <section className="table-parent-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pt-4 super-responsive-table">
                <ReactResponsiveTable columns={columns} data={salary} />

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
export default Salary;
