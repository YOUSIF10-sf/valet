import { Button } from "@/components/ui/button";
import { Download, Printer, Repeat } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { ReportData, hotels } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import * as XLSX from 'xlsx';


interface Step4ExportProps {
    onReset: () => void;
    reportData: ReportData;
    revenueData: RevenueData;
}

export function Step4Export({ onReset, reportData, revenueData }: Step4ExportProps) {
    const handlePrint = () => {
        // This is a simplified print approach. For a perfect print, one might navigate
        // back to step 3 and trigger print there. But this is good for a direct export.
        const printContent = document.getElementById("report-preview-for-export");
        if (printContent) {
            const printWindow = window.open('', '', 'height=800,width=1000');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print Report</title>');
                // You might need to link to your CSS file here for proper styling
                printWindow.document.write('<link rel="stylesheet" href="/globals.css" type="text/css" />');
                printWindow.document.write('</head><body dir="rtl">');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { // Timeout to allow content to load
                    printWindow.print();
                    printWindow.close();
                }, 500);
            }
        }
    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();

        const totals = {
            cars: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.cars || 0), 0),
            parking: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.parking || 0), 0),
            valet: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.valet || 0), 0),
            total: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.parking || 0) + (hotel.valet || 0), 0),
        };
        const paymentTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
        const difference = totals.total - paymentTotal;

        // Sheet 1: Report Details
        const ws1_data = [
            ["تقرير صف السيارات اليومي"],
            [],
            ["التاريخ:", reportData.date],
            ["اسم المشروع:", reportData.projectName],
            ["المشرف:", reportData.supervisorName],
            [],
            ["الحضور والغياب"],
            ["عدد الحضور:", reportData.attendanceCount],
            ["عدد الغياب:", reportData.absenceCount],
            [],
            ["ملاحظات:", reportData.notes]
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(ws1_data);
        XLSX.utils.book_append_sheet(wb, ws1, "تفاصيل التقرير");

        // Sheet 2: Revenue
        const ws2_data = [
            ["الموقع", "عدد السيارات", "مبالغ المواقف (ر.س)", "مبالغ الفاليه (ر.س)", "المجموع (ر.س)"],
            ...hotels.map(hotel => {
                const data = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0 };
                return [
                    hotel,
                    data.cars,
                    data.parking,
                    data.valet,
                    (data.parking || 0) + (data.valet || 0)
                ];
            }),
            ["الإجمالي", totals.cars, totals.parking, totals.valet, totals.total],
            [],
            ["تفاصيل إضافية"],
            ["السيارات المعفاة:", revenueData.exemptedCars],
            ["سبب الإعفاء:", revenueData.exemptionReason],
            ["السيارات المطلوبة بالخطأ:", revenueData.mistakeCars],
            [],
            ["ملخص الدفع"],
            ["إجمالي الكاش:", revenueData.totalCash],
            ["إجمالي الشبكة:", revenueData.totalNetwork],
            ["المجموع:", paymentTotal],
            ["الفرق:", difference],
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(ws2_data);
        XLSX.utils.book_append_sheet(wb, ws2, "تفاصيل الإيرادات");
        
        XLSX.writeFile(wb, `Report-${reportData.date}.xlsx`);
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">التقرير جاهز للتصدير!</h2>
            <p className="text-muted-foreground mb-8">حمّل التقرير الذي تم إنشاؤه بالصيغة التي تفضلها.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleExport}>
                    <Download className="ml-2 h-5 w-5" />
                    تحميل Excel (.xlsx)
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
    );
}
