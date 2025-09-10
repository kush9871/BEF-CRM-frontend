import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const handleExport = async ({
  salary,
  activeAllowances,
  activeDeductions,
  leaveTypes,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('PaySlips');

  // --- 1. Build Header Row ---
  const headerRow = [
    'SR. NO.',
    'NAME',
    'DESIGNATION',
    'BASIC',
    ...activeAllowances.map((a) => `${a.title} (${a.allowancePercentage}%)`),
    'GROSS SALARY',
    'WORKING DAYS',
    ...leaveTypes.map((l) => {
      const count = l?.days_limit?.monthly?.enabled
        ? l.days_limit.monthly.days
        : l?.days_limit?.yearly?.enabled
        ? l.days_limit.yearly.days
        : l.no_of_leave;
      return `${l.type} (${count})`;
    }),
    'TOTAL DAYS',
    'DEDUCTION BASIC',
    ...activeAllowances.map((a) => `${a.title} (${a.allowancePercentage}%)`),
    'DEDUCTION GROSS',
    ...activeDeductions.map((d) => `${d.title} (${d.deductionPercentage}%)`),
    'TOTAL DEDUCTION',
    'NET PAYABLE',
    'SIGNATURE',
  ];

  worksheet.addRow(headerRow);

  // --- 2. Add Data Rows ---
  salary.forEach((item, index) => {
    const base = item.original_basicSalary || 0;
    const deductBase = item.deduction_basicSalary || 0;

    const allowanceValues = activeAllowances.map(
      (a) => ((base * a.allowancePercentage) / 100).toFixed(2)
    );

    const deductionAllowances = activeAllowances.map(
      (a) => ((deductBase * a.allowancePercentage) / 100).toFixed(2)
    );

    const leaveCounts = leaveTypes.map((l) => {
      const matched = item?.leaveDetails?.find((ld) => ld.leaveTypeId === l._id);
      return matched?.leaveCount || 0;
    });

    const deductionValues = activeDeductions.map((d) => {
      const matched = item?.deductions?.find((ded) => ded._id === d._id);
      const amount = matched ? ((deductBase * matched.percentage) / 100) : 0;
      return amount.toFixed(2);
    });

    const totalDeduction = (
      activeDeductions.reduce(
        (sum, d) => sum + ((deductBase * (d.deductionPercentage || 0)) / 100),
        0
      ) + (item?.additionalLeave || 0)
    ).toFixed(2);

    const rowData = [
      index + 1,
      item?.user_id?.name,
      item?.user_id?.designation_id?.designation,
      base,
      ...allowanceValues,
      item.original_grossSalary || 0,
      item.totalWorkingDays || 0,
      ...leaveCounts,
      item.totalDays || 0,
      deductBase,
      ...deductionAllowances,
      item.deduction_grossSalary || 0,
      ...deductionValues,
      totalDeduction,
      item.netIncome || 0,
      '',
    ];

    const row = worksheet.addRow(rowData);

    // Style alternating rows
    const bg = index % 2 === 0 ? 'FFF7F7F7' : 'FFFFFFFF';
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bg },
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // --- 3. Add Total Row ---
  const totalRowData = [
    'TOTAL',
    '',
    '',
    salary.reduce((sum, item) => sum + (item.original_basicSalary || 0), 0).toFixed(2),
    ...activeAllowances.map((a) => {
      const total = salary.reduce(
        (sum, item) =>
          sum + ((item.original_basicSalary || 0) * a.allowancePercentage) / 100,
        0
      );
      return total.toFixed(2);
    }),
    salary.reduce((sum, item) => sum + (item.original_grossSalary || 0), 0).toFixed(2),
    salary.reduce((sum, item) => sum + (item.totalWorkingDays || 0), 0),
    ...leaveTypes.map((l) => {
      return salary.reduce((sum, item) => {
        const matched = item?.leaveDetails?.find((ld) => ld.leaveTypeId === l._id);
        return sum + (matched?.leaveCount || 0);
      }, 0);
    }),
    salary.reduce((sum, item) => sum + (item.totalDays || 0), 0),
    salary.reduce((sum, item) => sum + (item.deduction_basicSalary || 0), 0).toFixed(2),
    ...activeAllowances.map((a) => {
      const total = salary.reduce(
        (sum, item) =>
          sum + ((item.deduction_basicSalary || 0) * a.allowancePercentage) / 100,
        0
      );
      return total.toFixed(2);
    }),
    salary.reduce((sum, item) => sum + (item.deduction_grossSalary || 0), 0).toFixed(2),
    ...activeDeductions.map((d) => {
      const total = salary.reduce((sum, item) => {
        const matched = item?.deductions?.find((ded) => ded._id === d._id);
        return sum + (matched ? ((item.deduction_basicSalary || 0) * matched.percentage) / 100 : 0);
      }, 0);
      return total.toFixed(2);
    }),
    salary.reduce((sum, item) => {
      return (
        sum +
        activeDeductions.reduce(
          (dSum, d) =>
            dSum +
            ((item.deduction_basicSalary || 0) * (d.deductionPercentage || 0)) / 100,
          0
        ) +
        (item.additionalLeave || 0)
      );
    }, 0).toFixed(2),
    salary.reduce((sum, item) => sum + (item.netIncome || 0), 0).toFixed(2),
    '',
  ];

  const totalRow = worksheet.addRow(totalRowData);
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB6D7A8' }, // light green
    };
  });

  // --- 4. Style Header Row ---
  const header = worksheet.getRow(1);
  header.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCE5FF' }, // light blue
    };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
  });

  // --- 5. Export as .xlsx ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, 'PaySlips_JUNE_2025.xlsx');
};
