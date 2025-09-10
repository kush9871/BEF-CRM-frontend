import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import formatDate from "./formatDate";

const PaymentPdf = async (data) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageHeight = pdf.internal.pageSize.height;

  const headerImage = "/images/pdfHeader.png"; // Update if needed
  const footerImage = "/images/pdfFooter.png";

  const tempDiv = document.createElement("div");
  tempDiv.style.width = "800px";
  tempDiv.style.padding = "10px 50px";
  tempDiv.style.backgroundColor = "#fff";
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";

const { allowances = [], deductions = [], basicSalary, netIncome } = data;

// Ensure basicSalary is a number
const basic = Number(basicSalary);

// Determine the max number of rows
const maxRows = Math.max(allowances.length, deductions.length);

let tableRows = "";
  const totalEarningAmount = data?.totalAllowancePercentage ? ((data?.totalAllowancePercentage / 100) * basic + basic).toFixed(2) : "0.00";
  const totalDeductionAmount = data?.totalDeductionPercentage ? ((data?.totalDeductionPercentage / 100) * basic).toFixed(2) : "0.00";
for (let i = 0; i < maxRows; i++) {
  const allowance = allowances[i];
  const deduction = deductions[i];

  const allowanceAmount = allowance ? ((allowance.percentage / 100) * basic).toFixed(2) : "0.00";
  const deductionAmount = deduction ? ((deduction.percentage / 100) * basic).toFixed(2) : "0.00";

  const allowanceHTML = allowance
    ? `<td style="padding: 5px;">${allowance.title} (${allowance.percentage}%)</td><td style="padding: 5px;">${allowanceAmount}</td>`
    : `<td></td><td></td>`;

  const deductionHTML = deduction
    ? `<td style="padding: 5px;">${deduction.title} (${deduction.percentage}%)</td><td style="padding: 5px;">${deductionAmount}</td>`
    : `<td></td><td></td>`;

  tableRows += `<tr>${allowanceHTML}${deductionHTML}</tr>`;
}
  tempDiv.innerHTML = `
    <div>
      <img src="${headerImage}" alt="Header" style="width: 100%; max-height: 80px;" />
    </div>
    <h2 style="text-align: center; font-size: 16px; margin: 10px 0;">Salary Slip</h2>
    
    <table border="1" width="100%" style="border-collapse: collapse; font-size: 10px; margin-bottom: 10px;">
      <tr>
        <td style="padding: 5px;"><strong>Date of Joining</strong></td>
        <td style="padding: 5px;">${formatDate(data?.user_id?.joiningDate)}</td>
        <td style="padding: 5px;"><strong>Employee Name</strong></td>
        <td style="padding: 5px;">${data?.user_id?.name ?? ""}</td>
      </tr>
      <tr>
        <td style="padding: 5px;"><strong>Pay Period</strong></td>
        <td style="padding: 5px;">${data?.salarySlipMonth}</td>
        <td style="padding: 5px;"><strong>Designation</strong></td>
        <td style="padding: 5px;">${data?.user_id?.designation ?? "Full stack developer"}</td>
      </tr>
      <tr>
        <td style="padding: 5px;"><strong>Total Working Days</strong></td>
        <td style="padding: 5px;">${data?.totalWorkingDays || 30}</td>
        <td style="padding: 5px;"></td>
        <td style="padding: 5px;"></td>
      </tr>
    </table>

<table border="1" width="100%" style="border-collapse: collapse; font-size: 10px; margin-top: 10px;">
  <thead>
    <tr>
      <th colspan="2" style="padding: 5px;">Earnings</th>
      <th colspan="2" style="padding: 5px;">Deductions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5px;">Basic</td>
      <td style="padding: 5px;">${basicSalary}.00</td>
      <td style="padding: 5px;">Fine</td>
      <td style="padding: 5px;">0.00</td>
    </tr>
    ${tableRows}
    <tr>
      <td style="padding: 5px; font-weight: bold;">Total Earnings</td>
      <td style="padding: 5px;">${totalEarningAmount}</td>
      <td style="padding: 5px; font-weight: bold;">Total Deductions</td>
      <td style="padding: 5px;">${totalDeductionAmount}</td>
    </tr>
    <tr>
      <td colspan="2"></td>
      <td style="padding: 5px; font-weight: bold;">Net Pay</td>
      <td style="padding: 5px;">${netIncome}</td>
    </tr>
  </tbody>
</table>
  `;

  document.body.appendChild(tempDiv);

  await Promise.all([
    new Promise((resolve) => {
      const img = new Image();
      img.src = headerImage;
      img.onload = resolve;
    }),
    new Promise((resolve) => {
      const img = new Image();
      img.src = footerImage;
      img.onload = resolve;
    }),
  ]);

  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  document.body.removeChild(tempDiv);

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 5, imgWidth, imgHeight);

  const footerHeight = 15;
  const footerYPosition = pageHeight - footerHeight;
  pdf.addImage(footerImage, "PNG", 0, footerYPosition, imgWidth, footerHeight);

  const pdfBlob = pdf.output("blob");
  return pdfBlob;
};

export default PaymentPdf;
