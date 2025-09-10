"use client";

import React, { useEffect, useState } from "react";
import ReactResponsiveTable from "../../../dashboard/(dashboard)/components/react-responsive-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Axios from "app/config/axios";
import { FaEye } from "react-icons/fa";
import {
  Row,
  Col,
  Image,
  Dropdown,
  ListGroup,
  Button,
  Modal,
} from "react-bootstrap";
import style from "styles/form.module.css";
import ReactPaginate from "react-paginate";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const Department = () => {
  const [department, setDepartment] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [performance, setPerformance] = useState([]);
  const pathname = usePathname();
  const [userPerformance, setUserPerformance] = useState();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      title: "Name",
      key: "userName",
    },
    {
      title: "KPIs",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Employee Score",
      dataIndex: "employeeScore",
      key: "employeeScore",
    },
    {
      title: "Manager Score",
      dataIndex: "managerScore",
      key: "managerScore",
    },
    {
      title: "HR Score",
      dataIndex: "hrScore",
      key: "hrScore",
    },
    {
      title: "Final Score",
      dataIndex: "finalScore",
      key: "finalScore",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <button
          className="btn btn-link p-0"
          onClick={() => {
            setSelectedRecord(record.fullData);
            setShowModal(true);
          }}
        >
          <FaEye style={{ color: "#007bff" }} />
        </button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/performance/get-all-performace?page=${page}&limit=${limit}`,
          {
            authenticated: true,
          }
        );
        const rawData = res.data.results;
        const formattedScores = rawData.map((item) => ({
          name: item.kpis.map((kpi) => kpi.name).join(", "),
          employeeScore: item.scores.employeeScore,
          managerScore: item.scores.managerScore,
          hrScore: item.scores.hrScore,
          finalScore: item.scores.finalScore,
          userName: item?.user_id?.name,
          fullData: item,
        }));

        setPerformance(formattedScores);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [page]);
           const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <div className={`breadcrumb-wrapper ${style.leavebreadcrumbWrapper}`}>
        <div>
          <h1>Performance</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ performance</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-add-btn">
          <Link
            href="/management/dashboard/performance/add-new"
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
                <ReactResponsiveTable columns={columns} data={performance} />
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-performance"
      >
        <Modal.Header closeButton>
          <Modal.Title>Performance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord?.kpis &&
            Array.isArray(selectedRecord?.kpis) &&
            selectedRecord?.kpis.length > 0 && (
              <table className="table table-bordered performance-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>KPI</th>
                    <th>Weight</th>
                    <th>Manager Rating</th>
                    <th>HR Rating</th>
                    <th>Self Rating</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord?.kpis?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.weight}</td>
                      <td>{item.managerRating}</td>
                      <td>{item.hrRating}</td>
                      <td>{item.employeeRating}</td>
                      <td>{item.comments || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          {selectedRecord ? (
            <>
              <table className="table table-bordered performance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Manager Score</th>
                    <th>HR Score</th>
                    <th>Self Score</th>
                    <th>Final Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-secondary fw-bold">
                    <td>
                      {selectedRecord.kpis?.map((kpi) => kpi.name).join(", ") ||
                        "-"}
                    </td>
                    <td>{selectedRecord.scores.managerScore}</td>
                    <td>{selectedRecord.scores.hrScore}</td>
                    <td>{selectedRecord.scores.employeeScore}</td>
                    <td>Final: {selectedRecord.scores.finalScore}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <p>No performance data available.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Department;
