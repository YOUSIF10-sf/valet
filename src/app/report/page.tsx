'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useTranslation } from '../context/TranslationContext';
import { translations } from '../../lib/translations';

function ReportContent() {
    const searchParams = useSearchParams();
    const { language } = useTranslation();
    const t = translations[language] || translations.en;
    const [day, setDay] = useState('');

    const reportDate = searchParams.get('date');

    useEffect(() => {
        if (reportDate) {
            const dayIndex = new Date(reportDate).getDay();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            setDay(t[days[dayIndex]]);
        } else {
            setDay('');
        }
    }, [reportDate, t]);

    const hotels = [
        'DoubleTree',
        'Marriott',
        'Hilton Conferences',
        'Hilton Suites',
        'Hyatt Regency',
        'Conrad',
        'Jumeirah',
    ];

    const exemptedCars = searchParams.get('exemptedCars');
    const notesText = searchParams.get('notes');
    const totalOnHand = searchParams.get('totalOnHand');
    const difference = searchParams.get('difference');
    const shift = searchParams.get('shift');
    const valetCash = searchParams.get('valetCash');
    const valetCredit = searchParams.get('valetCredit');
    const lostTickets = searchParams.get('lostTickets');
    const damageClaims = searchParams.get('damageClaims');

    const hotelData = hotels.map(hotel => ({
        name: hotel,
        cars: searchParams.get(`${hotel.replace(/\s/g, '_')}_cars`) || '0',
        parking: searchParams.get(`${hotel.replace(/\s/g, '_')}_parking`) || '0.00',
        valet: searchParams.get(`${hotel.replace(/\s/g, '_')}_valet`) || '0.00',
        budget: searchParams.get(`${hotel.replace(/\s/g, '_')}_budget`) || '0.00',
    }));

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([]);
        const rtl = language === 'ar';

        // Deluxe Color Palette
        const palette = {
            darkGreen: "064E3B",
            mediumGreen: "047857",
            lightCream: "FEFBF6",
            darkText: "1F2937",
            lightText: "FFFFFF",
            subtleGray: "D1D5DB",
            headerGray: "374151"
        };

        const styles = {
            title: { font: { name: 'Poppins', sz: 26, bold: true, color: { rgb: palette.darkGreen } }, alignment: { horizontal: "center", vertical: "middle" } },
            dateHeader: { font: { name: 'Poppins', sz: 14, color: { rgb: palette.headerGray } }, alignment: { vertical: "middle" } },
            dayDisplay: { font: { name: 'Poppins', sz: 14, bold: true, color: { rgb: palette.darkText } }, alignment: { vertical: "middle" } },
            sectionTitle: { font: { name: 'Poppins', sz: 16, bold: true, color: { rgb: palette.lightText } }, fill: { fgColor: { rgb: palette.mediumGreen } } },
            tableHeader: { font: { name: 'Poppins', sz: 12, bold: true, color: { rgb: palette.lightText } }, fill: { fgColor: { rgb: palette.headerGray } }, alignment: { horizontal: "center", vertical: "middle" } },
            tableCell: { font: { name: 'Poppins', sz: 11, color: {rgb: palette.darkText} }, border: { top: {style:"thin", color: {rgb: palette.subtleGray}}, bottom: {style:"thin", color: {rgb: palette.subtleGray}}, left: {style:"thin", color: {rgb: palette.subtleGray}}, right: {style:"thin", color: {rgb: palette.subtleGray}} } },
            tableCellAlt: { font: { name: 'Poppins', sz: 11, color: {rgb: palette.darkText} }, fill: { fgColor: { rgb: palette.lightCream } }, border: { top: {style:"thin", color: {rgb: palette.subtleGray}}, bottom: {style:"thin", color: {rgb: palette.subtleGray}}, left: {style:"thin", color: {rgb: palette.subtleGray}}, right: {style:"thin", color: {rgb: palette.subtleGray}} } },
            dataLabel: { font: { name: 'Poppins', sz: 12, bold: true, color: { rgb: palette.headerGray } } },
            dataValue: { font: { name: 'Poppins', sz: 12, bold: true, color: {rgb: palette.darkText} }, fill: { fgColor: { rgb: palette.lightCream } }, border: { top: {style:"thin", color: {rgb: palette.subtleGray}}, bottom: {style:"thin", color: {rgb: palette.subtleGray}}, left: {style:"thin", color: {rgb: palette.subtleGray}}, right: {style:"thin", color: {rgb: palette.subtleGray}} } },
            footer: { font: { name: 'Poppins', sz: 10, italic: true, color: { rgb: "A0AEC0" } }, alignment: { horizontal: "center" } }
        };

        const addCell = (r, c, v, style, t) => {
            const cellRef = XLSX.utils.encode_cell({ r, c });
            if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
            const cell = ws[cellRef];
            cell.v = v;
            cell.s = style;
            if (t) cell.t = t;
            else if (typeof v === 'number') cell.t = 'n';
        };

        ws['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
        ws['!merges'] = [];

        let rowIndex = 0;

        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        addCell(rowIndex, 0, t.dailyReport, styles.title);
        rowIndex+=2;

        addCell(rowIndex, 0, `${t.date}: ${reportDate}`, { ...styles.dateHeader, alignment: { ...styles.dateHeader.alignment, horizontal: rtl ? "right" : "left" } });
        addCell(rowIndex, 4, day, { ...styles.dayDisplay, alignment: { ...styles.dayDisplay.alignment, horizontal: rtl ? "left" : "right" } });
        rowIndex+=2;

        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        addCell(rowIndex, 0, t.hotelDetails, styles.sectionTitle);
        rowIndex++;
        const hotelTableHeader = [t.hotel, t.numberOfCars, t.parkingFees, t.valetFees, t.budget];
        hotelTableHeader.forEach((h, i) => addCell(rowIndex, i, h, styles.tableHeader));
        rowIndex++;
        hotelData.forEach((hotel, index) => {
            const style = index % 2 === 0 ? styles.tableCell : styles.tableCellAlt;
            addCell(rowIndex, 0, hotel.name, style);
            addCell(rowIndex, 1, parseInt(hotel.cars), { ...style, alignment: { horizontal: "center" } });
            addCell(rowIndex, 2, parseFloat(hotel.parking), { ...style, alignment: { horizontal: "center" }, z: '#,##0.00' });
            addCell(rowIndex, 3, parseFloat(hotel.valet), { ...style, alignment: { horizontal: "center" }, z: '#,##0.00' });
            addCell(rowIndex, 4, parseFloat(hotel.budget), { ...style, alignment: { horizontal: "center" }, z: '#,##0.00' });
            rowIndex++;
        });
        rowIndex++;

        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        addCell(rowIndex, 0, t.valetReport, styles.sectionTitle);
        rowIndex++;
        const valetTableHeader = [t.shift, t.valetCash, t.valetCredit, t.lostTickets, t.damageClaims];
        valetTableHeader.forEach((h, i) => addCell(rowIndex, i, h, styles.tableHeader));
        rowIndex++;
        addCell(rowIndex, 0, shift, { ...styles.tableCellAlt, alignment: { horizontal: "center" } });
        addCell(rowIndex, 1, parseFloat(valetCash), { ...styles.tableCellAlt, alignment: { horizontal: "center" }, z: '#,##0.00' });
        addCell(rowIndex, 2, parseFloat(valetCredit), { ...styles.tableCellAlt, alignment: { horizontal: "center" }, z: '#,##0.00' });
        addCell(rowIndex, 3, parseInt(lostTickets), { ...styles.tableCellAlt, alignment: { horizontal: "center" } });
        addCell(rowIndex, 4, parseInt(damageClaims), { ...styles.tableCellAlt, alignment: { horizontal: "center" } });
        rowIndex+=2;

        const summaryData = [
            { label: t.exemptedCars, value: parseInt(exemptedCars) },
            { label: t.totalOnHand, value: parseFloat(totalOnHand), format: '#,##0.00' },
            { label: t.difference, value: parseFloat(difference), format: '#,##0.00' },
        ];
        summaryData.forEach(item => {
            ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 1 } });
            addCell(rowIndex, 0, item.label, styles.dataLabel);
            ws['!merges'].push({ s: { r: rowIndex, c: 2 }, e: { r: rowIndex, c: 4 } });
            addCell(rowIndex, 2, item.value, { ...styles.dataValue, z: item.format, alignment: { horizontal: "center"} });
            rowIndex++;
        });
        rowIndex++;

        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        addCell(rowIndex, 0, t.notes, styles.sectionTitle);
        rowIndex++;
        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        const noteCell = { font: {name: 'Poppins'}, alignment: { wrapText: true, vertical: "top" }, fill: { fgColor: { rgb: palette.lightCream } } };
        addCell(rowIndex, 0, notesText || t.noNotes, noteCell);
        if (!ws['!rows']) ws['!rows'] = [];
        ws['!rows'][rowIndex] = { hpt: 60, hpx: 60 };
        rowIndex+=2;

        ws['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 4 } });
        addCell(rowIndex, 0, t.generatedBy, styles.footer);

        ws['!ref'] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 4, r: rowIndex } });

        if (rtl) {
            ws['!cols'] = ws['!cols'].reverse();
            ws['!rightToLeft'] = true;
        }

        XLSX.utils.book_append_sheet(wb, ws, t.dailyReport);
        XLSX.writeFile(wb, `Easy_Valet_Report_${reportDate}.xlsx`);
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h1>{t.dailyReport}</h1>
                <div className="report-date-header">
                    <p>{t.date}: {reportDate}</p>
                    {day && <span className="day-display">{day}</span>}
                </div>
            </div>

            <div className="report-section">
                <h2>{t.hotelDetails}</h2>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>{t.hotel}</th>
                            <th>{t.numberOfCars}</th>
                            <th>{t.parkingFees}</th>
                            <th>{t.valetFees}</th>
                            <th>{t.budget}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotelData.map((hotel, index) => (
                            <tr key={index}>
                                <td>{hotel.name}</td>
                                <td>{hotel.cars}</td>
                                <td>{hotel.parking}</td>
                                <td>{hotel.valet}</td>
                                <td>{hotel.budget}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="report-section">
                <h2>{t.valetReport}</h2>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>{t.shift}</th>
                            <th>{t.valetCash}</th>
                            <th>{t.valetCredit}</th>
                            <th>{t.lostTickets}</th>
                            <th>{t.damageClaims}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{shift}</td>
                            <td>{valetCash}</td>
                            <td>{valetCredit}</td>
                            <td>{lostTickets}</td>
                            <td>{damageClaims}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

             <div className="report-section">
                <div className="grid-container-report">
                    <div>
                        <h2>{t.exemptedCars}</h2>
                        <p>{exemptedCars}</p>
                    </div>
                    <div>
                        <h2>{t.totalOnHand}</h2>
                        <p>{totalOnHand}</p>
                    </div>
                    <div>
                        <h2>{t.difference}</h2>
                        <p>{difference}</p>
                    </div>
                </div>
            </div>

            <div className="report-section">
                <h2>{t.notes}</h2>
                <p>{notesText || t.noNotes}</p>
            </div>

            <div className="report-footer">
                 <div className="button-container">
                    <button onClick={handlePrint} className="print-btn">{t.print}</button>
                    <button onClick={handleExport} className="export-btn">{t.exportToExcel}</button>
                 </div>
                <p>{t.generatedBy}</p>
            </div>
        </div>
    );
}

export default function ReportPage() {
    return (
        <Suspense fallback={<div>Loading report...</div>}>
            <main className="main-container">
                <ReportContent />
            </main>
        </Suspense>
    );
}
