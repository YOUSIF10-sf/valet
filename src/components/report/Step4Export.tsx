import { Button } from "@/components/ui/button";
import { Download, Printer, Repeat } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { ReportData, hotels } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import * as XLSX from 'xlsx';
import { Step3MappingPreview } from "./Step3MappingPreview";

interface Step4ExportProps {
    onReset: () => void;
    reportData: ReportData;
    revenueData: RevenueData;
    reportId: string;
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const shiftMap: { [key: string]: string } = {
  morning: 'صباحية',
  evening: 'مسائية',
};

export function Step4Export({ onReset, reportData, revenueData, reportId }: Step4ExportProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleExcelExport = () => {
        // 1. Define Styles
        const headerStyle = { font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 }, fill: { fgColor: { rgb: "1E293B" } }, alignment: { horizontal: "center", vertical: "center" } };
        const subHeaderStyle = { font: { bold: true, color: { rgb: "000000" } }, fill: { fgColor: { rgb: "F1F5F9" } }, alignment: { horizontal: "center" } };
        const totalRowStyle = { font: { bold: true }, fill: { fgColor: { rgb: "E2E8F0" } } };
        const boldText = { font: { bold: true } };
        const centeredText = { alignment: { horizontal: "center" } };
        const rightAligned = { alignment: { horizontal: "right" } };

        // 2. Prepare Data
        const revenueTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
        const paymentTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
        const difference = revenueTotal - paymentTotal;
        const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0);
        const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0);
        const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0);

        // 3. Worksheet Data Structure
        let reportInfoRows = [
            [
                { v: "التاريخ", t: 's', s: boldText }, { v: formatDate(reportData.date), t: 's' },
                { v: "المشرف", t: 's', s: boldText }, { v: reportData.supervisorName, t: 's' },
            ],
            [
                { v: "الحضور", t: 's', s: boldText }, { v: reportData.attendanceCount, t: 'n' },
                { v: "الغياب", t: 's', s: boldText }, { v: reportData.absenceCount, t: 'n' },
            ],
        ];

        if (reportData.reportType === 'daily' && reportData.shift) {
            reportInfoRows[0].push({ v: "الوردية", t: 's', s: boldText }, { v: shiftMap[reportData.shift] || reportData.shift, t: 's' });
        }

        if (reportData.notes) {
             reportInfoRows.push([{ v: "ملاحظات", t: 's', s: boldText }, { v: reportData.notes, t: 's' }])
        }

        let ws_data = [
            [{ v: "تقرير الإيرادات اليومي", t: 's', s: headerStyle }],
            [{ v: reportData.projectName, t: 's', s: { ...headerStyle, font: { ...headerStyle.font, sz: 12 } } }],
            [],
            [{ v: "معلومات التقرير", t: 's', s: subHeaderStyle }],
            ...reportInfoRows,
            [],
            [{ v: "ملخص الإيرادات", t: 's', s: subHeaderStyle }],
            [
                { v: "الموقع", t: 's', s: subHeaderStyle }, { v: "اسم الكاشير", t: 's', s: subHeaderStyle },
                { v: "السيارات", t: 's', s: subHeaderStyle }, { v: "المواقف (ر.س)", t: 's', s: subHeaderStyle },
                { v: "الفاليه (ر.س)", t: 's', s: subHeaderStyle }, { v: "المجموع (ر.س)", t: 's', s: subHeaderStyle },
            ],
        ];

        // Append revenue rows
        hotels.forEach(hotel => {
            const data = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0, cashierName: '' };
            ws_data.push([
                { v: hotel, t: 's' },
                { v: data.cashierName || '-', t: 's' },
                { v: data.cars || 0, t: 'n', s: centeredText },
                { v: data.parking || 0, t: 'n', s: { numFmt: "#,##0.00" } },
                { v: data.valet || 0, t: 'n', s: { numFmt: "#,##0.00" } },
                { v: (data.parking || 0) + (data.valet || 0), t: 'n', s: { numFmt: "#,##0.00", ...boldText, ...rightAligned } },
            ]);
        });

        // Append total row
        ws_data.push([
            { v: "الإجمالي", t: 's', s: totalRowStyle }, { v: "", t: 's', s: totalRowStyle },
            { v: totalCars, t: 'n', s: { ...totalRowStyle, ...centeredText } },
            { v: totalParking, t: 'n', s: { ...totalRowStyle, numFmt: "#,##0.00" } },
            { v: totalValet, t: 'n', s: { ...totalRowStyle, numFmt: "#,##0.00" } },
            { v: revenueTotal, t: 'n', s: { ...totalRowStyle, numFmt: "#,##0.00", ...rightAligned } },
        ]);

        ws_data.push([]);

        // Payment & Details
        ws_data.push([{ v: "ملخص الدفع والتفاصيل", t: 's', s: subHeaderStyle }]);
        ws_data.push([
            { v: "إجمالي الكاش", t: 's', s: boldText }, { v: revenueData.totalCash, t: 'n', s: { numFmt: "#,##0.00 \"ر.س\"" } },
            { v: "سيارات معفاة", t: 's', s: boldText }, { v: revenueData.exemptedCars || 0, t: 'n' },
        ]);
        ws_data.push([
            { v: "إجمالي الشبكة", t: 's', s: boldText }, { v: revenueData.totalNetwork, t: 'n', s: { numFmt: "#,##0.00 \"ر.س\"" } },
            { v: "سيارات بالخطأ", t: 's', s: boldText }, { v: revenueData.mistakeCars || 0, t: 'n' },
        ]);
        if (revenueData.exemptionReason) {
            ws_data.push([{}, {}, { v: "سبب الإعفاء", t: 's', s: boldText }, { v: revenueData.exemptionReason, t: 's' }]);
        }

        ws_data.push([
            { v: "المجموع المستلم", t: 's', s: totalRowStyle }, 
            { v: paymentTotal, t: 'n', s: { ...totalRowStyle, numFmt: "#,##0.00 \"ر.س\"" } },
        ]);

        ws_data.push([]);

        // Financial Difference
        const diffStyle = { font: { bold: true, color: { rgb: difference !== 0 ? "991B1B" : "065F46" } }, fill: { fgColor: { rgb: difference !== 0 ? "FECACA" : "D1FAE5" } } };
        ws_data.push([
            { v: "الفرق المالي", t: 's', s: diffStyle },
            { v: difference, t: 'n', s: { ...diffStyle, numFmt: `#,##0.00 \"ر.س\"` } }
        ]);
        if (difference !== 0 && revenueData.differenceReason) {
            ws_data.push([{}, { v: `السبب: ${revenueData.differenceReason}`, t: 's' } ]);
        }

        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        const merges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, 
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, 
            { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
        ];
        
        let currentRow = 4 + reportInfoRows.length;
        merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 5 } }); // Revenue Summary Title
        currentRow += hotels.length + 2; // header + data rows + total row
        merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 5 } }); // Payment details title
        if(reportData.notes) {
             const notesRowIndex = ws_data.findIndex(row => row[0]?.v === "ملاحظات");
             if(notesRowIndex !== -1) merges.push({ s: { r: notesRowIndex, c: 1 }, e: { r: notesRowIndex, c: 5 } });
        }

        ws["!merges"] = merges;
        ws["!cols"] = [ { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 } ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "تقرير الإيرادات");
        XLSX.writeFile(wb, `تقرير-${formatDate(reportData.date)}.xlsx`);
    };
    
    return (
        <>
            <div className="hidden print:block">
                <Step3MappingPreview 
                    reportData={reportData} 
                    revenueData={revenueData} 
                    reportId={reportId} 
                />
            </div>

            <div className="print:hidden flex flex-col items-center justify-center h-full text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">التقرير جاهز للتصدير!</h2>
                <p className="text-muted-foreground mb-8">حمّل التقرير الذي تم إنشاؤه بالصيغة التي تفضلها.</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button size="lg" className="w-full sm:w-auto" onClick={handleExcelExport}>
                        <Download className="ml-2 h-5 w-5" />
                        تحميل Excel (تصميم مميز)
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handlePrint}>
                        <Printer className="ml-2 h-5 w-5" />
                        طباعة التقرير
                    </Button>
                </div>
                <Button variant="ghost" onClick={onReset}>
                    <Repeat className="ml-2 h-4 w-4" />
                    إنشاء تقرير آخر
                </Button>
            </div>
        </>
    );
}
