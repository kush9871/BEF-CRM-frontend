"use client";

import { Fragment, useEffect, useState } from "react";
import { Container, Col, Row, Card, Table } from "react-bootstrap";
import Link from "next/link";
import formatDate from "../../../components/formatDate";
import { useSession } from "next-auth/react";

// Icons
import { People, ListTask, Bullseye } from "react-bootstrap-icons";
import { Briefcase } from "react-feather";

// Components
import { StatRightTopIcon } from "widgets";

// Axios
import Axios from "app/config/axios";
import BirthdayGif from "./birthdayGif/page";
import AnnouncementModal from "./announcementmodal/page";

// Charts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const Home = () => {
  const { data: session } = useSession();
  const [latestEmployees, setLatestEmployees] = useState([]);
  const [birthdayUser, setBirthdayUser] = useState();
  const [isBirthday, setIsBirthday] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const [stats, setStats] = useState({
    userCount: 0,
    designationCount: 0,
    absentUserCount: 0,
    holidayCount: 0,
    policyCount: 0,
    salary: {},
  });

  useEffect(() => {
    fetchStats();
    getBirthdayUsers();
  }, []);

  const fetchStats = async () => {
    try {
      let response;
      if (
        session?.user.role == "admin" ||
        session?.user?.role == "super-admin"
      ) {
        response = await Axios.get("/dashboard/get-all-dashboard-data", {
          authenticated: true,
        });
      } else {
        response = await Axios.get("/dashboard/get-all-dashboard-user-data", {
          authenticated: true,
        });
      }

      const data = response.data?.data || response.data;

      setStats({
        userCount: data.userCount || 0,
        designationCount: data.designationCount || 0,
        absentUserCount: data.absentUserCount || 0,
        holidayCount: data.holidayCount || 0,
        policyCount: data.policyCount || 0,
        salary: data.salary || {},
      });
      setLatestEmployees(data.latestUsers || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

 const getBirthdayUsers = async () => {
  try {
    const res = await Axios.get("/users/get-users-birthday", {
      authenticated: true,
    });
    setBirthdayUser(res.data.birthdayUsers || []);
    setIsBirthday(true);

    // Show birthday GIF for 5 seconds only
    setTimeout(() => {
      setIsBirthday(false);
      setShowAnnouncementModal(true);

      // 👇 Auto-close announcement modal after 5 sec
      setTimeout(() => {
        setShowAnnouncementModal(false);
      }, 6000);

    }, 5000);
  } catch (error) {
    console.log(error);
  }
};


  const salary = stats.salary;
  const salaryData = [];

  // Basic
  if (salary?.basicSalary > 0) {
    salaryData.push({
      name: "Basic",
      value: salary.basicSalary,
      type: "basic",
    });
  }

  // Allowances
  if (Array.isArray(salary?.allowances)) {
    salary.allowances
      .filter((item) => item.percentage && item.percentage > 0)
      .forEach((item) => {
        salaryData.push({
          name: item.title,
          value: (salary.basicSalary * item.percentage) / 100,
          type: "allowance",
        });
      });
  }

  // Deductions
  if (Array.isArray(salary?.deductions)) {
    salary.deductions
      .filter((item) => item.percentage && item.percentage > 0)
      .forEach((item) => {
        salaryData.push({
          name: item.title,
          value: (salary.basicSalary * item.percentage) / 100,
          type: "deduction",
        });
      });
  }

  // Net Income
  if (salary?.netIncome > 0) {
    salaryData.push({
      name: "Net Income",
      value: salary.netIncome,
      type: "netIncome",
    });
  }

  // Colors
  const TYPE_COLORS = {
    basic: "#8884d8", // purple-ish
    allowance: "#82ca9d", // green
    deduction: "#ff6b6b", // red
    netIncome: "#ffc658", // yellow-ish
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#F1948A",
  ];

  // Designation Data
  const designationData = Object.values(
    latestEmployees.reduce((acc, emp) => {
      acc[emp.designation_id] = acc[emp.designation_id] || {
        designation: emp.designation_id,
        count: 0,
      };
      acc[emp.designation_id].count += 1;
      return acc;
    }, {})
  );

  return (
    <>
      {isBirthday && birthdayUser?.length > 0 ? (
        <BirthdayGif birthdayUser={birthdayUser} />
      ) : birthdayUser !== undefined ? (
        <Fragment>
          <div className="dashboard-background pt-10 pb-21"></div>
          <Container fluid className="mt-n22 px-6">
            {/* Stat Cards */}
            <Row>
              <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
                <Link
                  href="/management/dashboard/employees"
                  passHref
                  legacyBehavior
                >
                  <a style={{ textDecoration: "none", display: "block" }}>
                    <StatRightTopIcon
                      info={{
                        id: 1,
                        title: "Patients",
                        value: stats.userCount,
                        icon: <People size={18} />,
                      }}
                    />
                  </a>
                </Link>
              </Col>

              <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
                <Link
                  href="/management/dashboard/designation"
                  passHref
                  legacyBehavior
                >
                  <a style={{ textDecoration: "none", display: "block" }}>
                    <StatRightTopIcon
                      info={{
                        id: 2,
                        title: "Eye Related Issue",
                        value: stats.designationCount,
                        icon: <Briefcase size={18} />,
                      }}
                    />
                  </a>
                </Link>
              </Col>

              {session?.user.role == "admin" ||
              session?.user?.role == "super-admin" ? (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
                  <Link
                    href="/management/dashboard/attendance"
                    passHref
                    legacyBehavior
                  >
                    <a style={{ textDecoration: "none", display: "block" }}>
                      <StatRightTopIcon
                        info={{
                          id: 3,
                          title: "Due Date",
                          value: stats.absentUserCount,
                          icon: <ListTask size={18} />,
                        }}
                      />
                    </a>
                  </Link>
                </Col>
              ) : (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
                  <Link
                    href="/management/dashboard/policies"
                    passHref
                    legacyBehavior
                  >
                    <a style={{ textDecoration: "none", display: "block" }}>
                      <StatRightTopIcon
                        info={{
                          id: 2,
                          title: "Policies",
                          value: stats.policyCount,
                          icon: <Briefcase size={18} />,
                        }}
                      />
                    </a>
                  </Link>
                </Col>
              )}

              <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
                <Link href="/management/dashboard/holidays" passHref legacyBehavior>
                  <a style={{ textDecoration: "none", display: "block" }}>
                    <StatRightTopIcon
                      info={{
                        id: 4,
                        title: "Patients With Overdue Date",
                        value: stats.holidayCount,
                        icon: <Bullseye size={18} />,
                      }}
                    />
                  </a>
                </Link>
              </Col>
            </Row>

            {/* Employees Table + Charts */}
            <Row className="mt-6">
              <Col md={12} xs={12}>
                <Card>
                  <Card.Header className="bg-white py-4">
                    <h4 className="mb-0">Patients</h4>
                  </Card.Header>
                  <Table responsive className="text-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email Address</th>
                        <th>Contact Number</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Dob</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestEmployees.length > 0 ? (
                        latestEmployees.map((employee, index) => (
                          <tr key={index}>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                <div className="lh-1">
                                  <h5 className="mb-1">
                                    <Link href="#" className="text-inherit">
                                      {employee.name}
                                    </Link>
                                  </h5>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">
                              {employee.personal_email}
                            </td>
                            <td className="align-middle">{employee.contactNo}</td>
                            <td className="align-middle text-dark">
                              {employee?.designation_id?.designation}
                            </td>
                            <td className="align-middle text-dark">
                              {formatDate(employee.joiningDate)}
                            </td>
                            <td className="align-middle text-dark">
                              {formatDate(employee.dob)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  {/* Charts */}
                  <Card.Body>
                    <Row>
                      {session?.user?.role == "admin" ||
                      session?.user?.role == "super-admin" ? (
                        <Col md={6}>
                          <h5 className="mb-3">Employee Distribution (Pie)</h5>
                          <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                              <Pie
                                data={latestEmployees.map((emp) => ({
                                  name: emp.name,
                                  value: 1,
                                }))}
                                cx="60%"
                                cy="50%"
                                outerRadius={130}
                                dataKey="value"
                                label
                              >
                                {latestEmployees.map((_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Col>
                      ) : (
                        <Col md={6}>
                          <h5 className="mb-3">
                            Employee Current Salary Details (Pie)
                          </h5>
                          <Row>
                            <Col md={3}>
                              <div style={{ marginTop: "1rem" }}>
                                <h6>Legend / Indicators</h6>
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                  <li>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        backgroundColor: TYPE_COLORS.basic,
                                        marginRight: 8,
                                      }}
                                    ></span>
                                    Basic
                                  </li>
                                  <li>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        backgroundColor: TYPE_COLORS.allowance,
                                        marginRight: 8,
                                      }}
                                    ></span>
                                    Allowances
                                  </li>
                                  <li>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        backgroundColor: TYPE_COLORS.deduction,
                                        marginRight: 8,
                                      }}
                                    ></span>
                                    Deductions
                                  </li>
                                  <li>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        backgroundColor: TYPE_COLORS.netIncome,
                                        marginRight: 8,
                                      }}
                                    ></span>
                                    Net Income
                                  </li>
                                </ul>
                              </div>
                            </Col>
                            <Col md={9}>
                              <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                  <Pie
                                    data={salaryData}
                                    cx="60%"
                                    cy="50%"
                                    outerRadius={130}
                                    dataKey="value"
                                    label
                                  >
                                    {salaryData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={TYPE_COLORS[entry.type] || "#cccccc"}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </Col>
                          </Row>
                        </Col>
                      )}
                      <Col md={6}>
                        <h5 className="mb-3">Designation-wise Count (Bar)</h5>
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={designationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="designation" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Fragment>
      ) : null}

      {/* 👇 Announcement Modal */}
      {showAnnouncementModal && (
        <AnnouncementModal onClose={() => setShowAnnouncementModal(false)} />
      )}
    </>
  );
};

export default Home;
