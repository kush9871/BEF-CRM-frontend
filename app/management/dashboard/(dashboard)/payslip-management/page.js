"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../../../styles/paySlip.module.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Link from "next/link";
import Axios from "app/config/axios";
import { data } from "node_modules/react-router-dom/dist";
import {handleExport} from "../../../../components/downloadExcel"

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const PaySlipsManagement = () => {
  const [salary, setSalary] = useState([]);
  const [allowance, setAllowance] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [leave, setLeaves] = useState([]);

  useEffect(() => {
    const fechData = async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/payment-slip//get-all-employees-monthly-salary`,
          {
            authenticated: true,
          }
        );
        setAllowance(res?.data?.organization_allowance || []);
        setDeductions(res?.data?.organization_deduction || []);
        setLeaves(res?.data?.organization_leave || []);
        setSalary(res.data.results || []);
      } catch (error) {
        console.error(error.message);
      }
    };
    fechData();
  }, []);

  const activeAllowances =
    allowance?.filter((a) => a.is_active === "active" && !a.isDeleted) || [];
  const activeDeductions =
    deductions?.filter((d) => d.is_active === "active" && !d.isDeleted) || [];
  const leaveTypes = leave || [];

  return (
    <>
      <div className="breadcrumb-wrapper align-items-center">
        <div>
          <h1>Payslip Records</h1>
          <Breadcrumb>
            <Link href="/management/dashboard/" className="breadcrum-link">
              Dashboard
            </Link>
            <span className="ms-2">/ Payslip</span>
          </Breadcrumb>
        </div>
        <div>
        <button onClick={() =>
        handleExport({
          salary,
          activeAllowances,
          activeDeductions,
          leaveTypes,
        })
      } className="btn btn-primary">
          Download Records
        </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <h4 className="text-center">
          STAFF SALARY FOR THE MONTH OF JUNE 2025
        </h4>
        <table className={styles.salaryTable}>
          <thead>
            <tr>
              <th rowSpan="2">SR. NO.</th>
              <th rowSpan="2">NAME</th>
              <th rowSpan="2">DESIGNATION</th>
              <th
                colSpan={2 + activeAllowances.length}
                className={styles.salaryDetails}
              >
                Salary Details
              </th>
              <th
                colSpan={1 + leaveTypes.length}
                className={styles.daysWorked}
              >
                No. of Days Worked
              </th>
              <th rowSpan="2">TOTAL DAYS</th>
              <th
                colSpan={2 + activeAllowances.length}
                className={styles.earningDetails}
              >
                Earning Details
              </th>
              <th
                colSpan={activeDeductions.length + 1}
                className={styles.deductions}
              >
                Deductions
              </th>
              <th rowSpan="2">NET PAYABLE</th>
              <th rowSpan="2">SIGNATURE</th>
            </tr>
            <tr>
              {/* Salary Details */}
              <th>BASIC</th>
              {activeAllowances.map((a) => (
                <th key={a._id}>
                  {a.title} ({a.allowancePercentage}%)
                </th>
              ))}
              <th>Gross Salary</th>

              {/* No. of Days Worked */}
              <th>WORKING DAYS</th>
              {leaveTypes.map((l) => {
                const count = l?.days_limit?.monthly?.enabled
                  ? l.days_limit.monthly.days
                  : l?.days_limit?.yearly?.enabled
                  ? l.days_limit.yearly.days
                  : l.no_of_leave;

                return (
                  <th key={l._id}>
                    {l.type} ({count})
                  </th>
                );
              })}

              {/* Earning Details */}
              <th>BASIC</th>
              {activeAllowances.map((a) => (
                <th key={`earn-${a._id}`}>
                  {a.title} ({a.allowancePercentage}%)
                </th>
              ))}
              <th>Gross Salary</th>

              {/* Deductions including PF, ESI, etc */}
              {activeDeductions.map((d) => (
                <th key={d._id}>
                  {d.title} ({d.deductionPercentage}%)
                </th>
              ))}
              <th>TOTAL DEDUCTION</th>
            </tr>
          </thead>

          <tbody>
            {/* You can render dynamic rows here as needed. This is a static example row */}
            {salary && Array.isArray(salary) && salary.map((item,index)=>{
              return(
                <>
              <tr key={index}>
              <td>1</td>
              <td>{item?.user_id?.name}</td>
              <td>{item?.user_id?.designation_id?.designation}</td>
              <td>{item?.original_basicSalary}</td>
                {activeAllowances.map((a) => {
                  const baseSalary = item?.original_basicSalary; // You can replace this with dynamic value
                  const amount = ((baseSalary * a.allowancePercentage) / 100).toFixed(2);
                  return <td key={`amount-${a._id}`}>₹{amount}</td>;
                })}
              <td>{item?.original_grossSalary}</td>
              <td>{item?.totalWorkingDays}</td>
              {leave && leave.map((leaveType) => {
                const matchedLeave = item?.leaveDetails?.find(
                  (ld) => ld.leaveTypeId === leaveType._id
                );
                return (
                  <td key={`leave-${leaveType._id}`}>
                    {matchedLeave ? matchedLeave.leaveCount : 0}
                  </td>
                );
              })}
              <td>{item?.totalDays}</td>

              <td>{item?.deduction_basicSalary}</td>
                {activeAllowances.map((a) => {
                  const baseSalary = item?.deduction_basicSalary; // You can replace this with dynamic value
                  const amount = ((baseSalary * a.allowancePercentage) / 100).toFixed(2);
                  return <td key={`amount-${a._id}`}>₹{amount}</td>;
                })}
              <td>{item?.deduction_grossSalary}</td>
              {/* Dynamic Deductions */}
              {activeDeductions.map((d) => {
                const matchedDeduction = item?.deductions?.find(
                  (ded) =>{
                    return ded._id == d._id
                  }
                );

                const amount = matchedDeduction
                  ? ((item?.deduction_basicSalary || 0) * (matchedDeduction.percentage || 0)) / 100
                  : 0;

                return <td key={`ded-${d._id}`}>₹{amount.toFixed(2)}</td>;
              })}
              <td>
                ₹{(
                  activeDeductions.reduce(
                    (sum, d) =>
                      sum +
                      ((item?.deduction_basicSalary || 0) * (d?.deductionPercentage || 0)) / 100,
                    0
                  ) + (item?.additionalLeave || 0)
                ).toFixed(2)}
              </td>

              <td>{item?.netIncome}</td>
              <td></td>
            </tr>
                </>
              )
            })}
                        <tr className={styles.totalRow}>
              <td colSpan="3">TOTAL</td>

              {/* BASIC total */}
              <td>
                ₹{salary.reduce((sum, item) => sum + (item.original_basicSalary || 0), 0).toFixed(2)}
              </td>

              {/* Allowance totals */}
              {activeAllowances.map((a) => {
                const total = salary.reduce((sum, item) => {
                  return sum + ((item.original_basicSalary || 0) * (a.allowancePercentage || 0)) / 100;
                }, 0);
                return <td key={`total-allowance-${a._id}`}>₹{total.toFixed(2)}</td>;
              })}

              {/* Gross Salary total */}
              <td>
                ₹{salary.reduce((sum, item) => sum + (item.original_grossSalary || 0), 0).toFixed(2)}
              </td>

              {/* Total Working Days */}
              <td>
                {salary.reduce((sum, item) => sum + (item.totalWorkingDays || 0), 0)}
              </td>

              {/* Leaves taken per type */}
              {leaveTypes.map((l) => {
                const totalLeave = salary.reduce((sum, item) => {
                  const matchedLeave = item.leaveDetails?.find(ld => ld.leaveTypeId === l._id);
                  return sum + (matchedLeave?.leaveCount || 0);
                }, 0);
                return <td key={`total-leave-${l._id}`}>{totalLeave}</td>;
              })}

              {/* Total Days */}
              <td>{salary.reduce((sum, item) => sum + (item.totalDays || 0), 0)}</td>

              {/* Deduction BASIC */}
              <td>
                ₹{salary.reduce((sum, item) => sum + (item.deduction_basicSalary || 0), 0).toFixed(2)}
              </td>

              {/* Allowance totals on deduction_basicSalary */}
              {activeAllowances.map((a) => {
                const total = salary.reduce((sum, item) => {
                  return sum + ((item.deduction_basicSalary || 0) * (a.allowancePercentage || 0)) / 100;
                }, 0);
                return <td key={`total-deduct-allow-${a._id}`}>₹{total.toFixed(2)}</td>;
              })}

              {/* Deduction Gross Salary */}
              <td>
                ₹{salary.reduce((sum, item) => sum + (item.deduction_grossSalary || 0), 0).toFixed(2)}
              </td>

              {/* Individual deductions (PF, ESI, etc.) */}
              {activeDeductions.map((d) => {
                const total = salary.reduce((sum, item) => {
                  const matched = item.deductions?.find((ded) => ded._id == d._id);
                  const amount = matched
                    ? ((item?.deduction_basicSalary || 0) * (matched.percentage || 0)) / 100
                    : 0;
                  return sum + amount;
                }, 0);
                return <td key={`total-deduction-${d._id}`}>₹{total.toFixed(2)}</td>;
              })}

              {/* TOTAL Deduction */}
              <td>
                ₹{salary.reduce((sum, item) => {
                  const totalDeduction = activeDeductions.reduce((dSum, d) => {
                    return (
                      dSum +
                      ((item.deduction_basicSalary || 0) * (d.deductionPercentage || 0)) / 100
                    );
                  }, 0);
                  return sum + totalDeduction + (item.additionalLeave || 0);
                }, 0).toFixed(2)}
              </td>

              {/* NET PAYABLE */}
              <td>
                ₹{salary.reduce((sum, item) => sum + (item.netIncome || 0), 0).toFixed(2)}
              </td>

              {/* SIGNATURE */}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PaySlipsManagement;
