
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ReportData } from '@/components/report/Step1DataInput';
import { RevenueData } from '@/components/report/Step2TemplateSelection';

// --- Professional Dashboard Styles ---
const styles = {
    title: {
        font: { name: 'Arial', sz: 24, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2F5496" } },
        alignment: { horizontal: 'center', vertical: 'center' },
    },
    cardTitle: {
        font: { name: 'Arial', sz: 16, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "5A9BD5" } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    },
    label: {
        font: { name: 'Arial', sz: 12, bold: true },
        fill: { fgColor: { rgb: "DDEBF7" } },
        border: { left: { style: 'thin' }, right: { style: 'thin' } },
    },
    value: {
        font: { name: 'Arial', sz: 12 },
        fill: { fgColor: { rgb: "F2F2F2" } },
        border: { right: { style: 'thin' } },
    },
    tableHeader: {
        font: { name: 'Arial', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "5A9BD5" } },
        alignment: { horizontal: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    },
    tableCell: { 
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
        alignment: { horizontal: 'right' },
    },
    totalRow: {
        font: { bold: true },
        fill: { fgColor: { rgb: "DDEBF7" } },
        border: { top: { style: 'thick' }, bottom: { style: 'thick' } },
    },
    differenceAlert: {
        font: { color: { rgb: "C00000" }, bold: true },
    },
};

const hotels = ["ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"];

export const exportToExcel = (reportData: ReportData, revenueData: RevenueData, reportId: string) => {
    const isMonthlyReport = reportData.reportType === 'monthly';
    const ws_data: any[][] = [];
    let currentRow = 0;

    // 1. --- Main Title ---
    ws_data[currentRow] = [{ v: "لوحة بيانات تقرير الإيرادات", s: styles.title }];
    currentRow += 2; // Add a spacer row

    // 2. --- Report Info & Financial Summary Cards ---
    const cashNetworkTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
    const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
    const difference = tableTotal - cashNetworkTotal;
    
    // Card 1: Report Details
    ws_data[currentRow] = [{ v: "تفاصيل التقرير", s: styles.cardTitle }];
    ws_data[currentRow + 1] = [{ v: "المشرف", s: styles.label }, { v: reportData.supervisorName, s: styles.value }];
    ws_data[currentRow + 2] = [{ v: "التاريخ", s: styles.label }, { v: new Date(reportData.date).toLocaleDateString(), s: styles.value }];
    if (isMonthlyReport) {
        ws_data[currentRow + 3] = [{ v: "الشهر", s: styles.label }, { v: reportData.month, s: styles.value }];
    } else {
        ws_data[currentRow + 3] = [{ v: "الوردية", s: styles.label }, { v: reportData.shift === 'morning' ? 'صباحية' : 'مسائية', s: styles.value }];
    }

    // Card 2: Financial Summary
    ws_data[currentRow][3] = { v: "الملخص المالي", s: styles.cardTitle };
    ws_data[currentRow + 1][3] = { v: "إجمالي الكاش", s: styles.label };
    ws_data[currentRow + 1][4] = { v: revenueData.totalCash || 0, s: styles.value, t: 'n', z: '#,##0.00' };
    ws_data[currentRow + 2][3] = { v: "إجمالي الشبكة", s: styles.label };
    ws_data[currentRow + 2][4] = { v: revenueData.totalNetwork || 0, s: styles.value, t: 'n', z: '#,##0.00' };
    const diffCellStyle = difference !== 0 ? { ...styles.value, ...styles.differenceAlert } : styles.value;
    ws_data[currentRow + 3][3] = { v: "الفرق", s: styles.label };
    ws_data[currentRow + 3][4] = { v: difference, s: diffCellStyle, t: 'n', z: '#,##0.00' };

    currentRow += 5; // Move past the cards

    // 3. --- Main Revenue Table ---
    const revenueTableHeaders = ["الموقع", ...(isMonthlyReport ? [] : ["الكاشير"]), "عدد السيارات", "مبالغ المواقف", "مبالغ الفاليه", "المجموع"];
    ws_data[currentRow] = revenueTableHeaders.map(h => ({ v: h, s: styles.tableHeader }));
    currentRow++;

    hotels.forEach(hotel => {
        const revenue = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0, cashierName: '-' };
        const total = (revenue.parking || 0) + (revenue.valet || 0);
        const row = [
            { v: hotel, s: styles.tableCell },
            ...(isMonthlyReport ? [] : [{ v: revenue.cashierName || '-', s: styles.tableCell }]),
            { v: revenue.cars || 0, s: styles.tableCell, t: 'n' },
            { v: revenue.parking || 0, s: styles.tableCell, t: 'n', z: '#,##0.00' },
            { v: revenue.valet || 0, s: styles.tableCell, t: 'n', z: '#,##0.00' },
            { v: total, s: { ...styles.tableCell, font: { bold: true } }, t: 'n', z: '#,##0.00' },
        ];
        ws_data[currentRow] = row;
        currentRow++;
    });
    
    // Total Row
    const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0);
    const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0);
    const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0);
    ws_data[currentRow] = [
        { v: "الإجمالي", s: { ...styles.totalRow, ...styles.tableCell } },
        ...(isMonthlyReport ? [] : [{ v: '', s: styles.totalRow }]),
        { v: totalCars, s: { ...styles.totalRow, ...styles.tableCell }, t: 'n' },
        { v: totalParking, s: { ...styles.totalRow, ...styles.tableCell }, t: 'n', z: '#,##0.00' },
        { v: totalValet, s: { ...styles.totalRow, ...styles.tableCell }, t: 'n', z: '#,##0.00' },
        { v: tableTotal, s: { ...styles.totalRow, ...styles.tableCell }, t: 'n', z: '#,##0.00' },
    ];
    currentRow+=2;

    // --- 4. Notes Section ---
    if (reportData.notes) {
        ws_data[currentRow] = [{ v: "الملاحظات", s: styles.cardTitle }];
        currentRow++;
        ws_data[currentRow] = [{ v: reportData.notes, s: styles.value }];
    }

    // --- 5. Finalize Worksheet ---
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Column Widths
    ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 20 }];
    
    // Merges
    ws['!merges'] = [
        XLSX.utils.decode_range('A1:E1'), // Main Title
        XLSX.utils.decode_range('A3:B3'), // Card 1 Title
        XLSX.utils.decode_range('D3:E3'), // Card 2 Title
        ...(reportData.notes ? [XLSX.utils.decode_range(`A${currentRow}:E${currentRow}`)] : []),
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "لوحة بيانات التقرير");

    // --- 6. Generate and Download File ---
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Dashboard_Report_${reportId}.xlsx`);
};
