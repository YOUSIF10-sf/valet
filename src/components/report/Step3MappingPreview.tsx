'use client';

import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { Download, Printer } from "lucide-react";
import { hotels } from "./Step1DataInput";
import ExcelJS from 'exceljs';

interface PreviewProps {
    reportData: ReportData;
    revenueData: RevenueData;
}

export function Step3MappingPreview({ reportData, revenueData }: PreviewProps) {

    const totals = {
        cars: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.cars || 0), 0),
        parking: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.parking || 0), 0),
        valet: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.valet || 0), 0),
        total: Object.values(revenueData.revenueByHotel).reduce((acc, hotel) => acc + (hotel.parking || 0) + (hotel.valet || 0), 0),
    };

    const paymentTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
    const difference = totals.total - paymentTotal;

    const handlePrint = () => {
        window.print();
    };

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.rtl = true;

        // --- Styles ---
        const headerStyle = {
            font: { name: 'Cairo', size: 18, bold: true, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF222831' } }, // Dark Charcoal/Black
            alignment: { horizontal: 'center', vertical: 'middle' }
        };
        const subHeaderStyle = {
            font: { name: 'Cairo', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF393E46' } }, // Grey
            alignment: { horizontal: 'center', vertical: 'middle' }
        };
        const tableHeaderStyle = {
            font: { name: 'Cairo', bold: true, color: { argb: 'FF222831' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAEAEA' } },
             alignment: { horizontal: 'center' },
            border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        };
        const labelStyle = { font: { name: 'Cairo', bold: true } };
        const totalRowStyle = {
            font: { name: 'Cairo', bold: true, size: 12 },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } },
            border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        };
        const differenceStyle = (diff) => ({
            font: { name: 'Cairo', bold: true, color: { argb: diff !== 0 ? 'FFFF6347' : 'FF2E8B57' } }
        });

        // --- Sheet 1: Report Details ---
        const ws1 = workbook.addWorksheet("تفاصيل التقرير");
        ws1.views = [{ rightToLeft: true }];
        ws1.mergeCells('A1:C1');
        const titleCell = ws1.getCell('A1');
        titleCell.value = "تقرير صف السيارات اليومي";
        titleCell.style = headerStyle;
        ws1.getRow(1).height = 40;

        ws1.addRow([]); // Spacer

        ws1.addRow(["التاريخ:", new Date(reportData.date).toLocaleDateString('ar-EG')]).eachCell(c => c.style = labelStyle);
        ws1.addRow(["اسم المشروع:", reportData.projectName]).eachCell(c => c.style = labelStyle);
        ws1.addRow(["المشرف:", reportData.supervisorName]).eachCell(c => c.style = labelStyle);

        ws1.addRow([]); // Spacer
        ws1.mergeCells('A7:B7');
        const attendanceHeader = ws1.getCell('A7');
        attendanceHeader.value = "ملخص الحضور";
        attendanceHeader.style = subHeaderStyle;
        ws1.getRow(7).height = 30;
        ws1.addRow(["عدد الحضور:", reportData.attendanceCount]);
        ws1.addRow(["عدد الغياب:", reportData.absenceCount]);

        if (reportData.notes) {
            ws1.addRow([]); // Spacer
            ws1.mergeCells('A11:C11');
            const notesHeader = ws1.getCell('A11');
            notesHeader.value = "الملاحظات";
            notesHeader.style = subHeaderStyle;
            ws1.getRow(11).height = 30;
            ws1.mergeCells('A12:C13');
            const notesCell = ws1.getCell('A12');
            notesCell.value = reportData.notes;
            notesCell.style = { alignment: { wrapText: true, vertical: 'top' } };
        }
        ws1.columns = [{ width: 20 }, { width: 30 }, { width: 30 }];
        

        // --- Sheet 2: Revenue --- 
        const ws2 = workbook.addWorksheet("تفاصيل الإيرادات");
        ws2.views = [{ rightToLeft: true }];

        const revenueHeaderRow = ws2.addRow(["الموقع", "عدد السيارات", "مبالغ المواقف (ر.س)", "مبالغ الفاليه (ر.س)", "المجموع (ر.س)"]);
        revenueHeaderRow.eachCell(cell => cell.style = tableHeaderStyle);
        revenueHeaderRow.height = 25;
        
        hotels.forEach(hotel => {
            const revenue = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0 };
            const total = (revenue.parking || 0) + (revenue.valet || 0);
            if (total || revenue.cars) {
                ws2.addRow([hotel, revenue.cars, revenue.parking, revenue.valet, total]);
            }
        });

        const totalRow = ws2.addRow(["الإجمالي", totals.cars, totals.parking, totals.valet, totals.total]);
        totalRow.eachCell(cell => cell.style = totalRowStyle);

        ws2.addRow([]); // Spacer

        // Additional Details & Payment Summary side-by-side
        const sectionHeaderStyle = subHeaderStyle;
        ws2.mergeCells('A15:B15');
        const additionalDetailsHeader = ws2.getCell('A15');
        additionalDetailsHeader.value = "تفاصيل إضافية";
        additionalDetailsHeader.style = sectionHeaderStyle;

        ws2.mergeCells('D15:E15');
        const paymentSummaryHeader = ws2.getCell('D15');
        paymentSummaryHeader.value = "ملخص الدفع";
        paymentSummaryHeader.style = sectionHeaderStyle;

        ws2.getRow(16).values = ["السيارات المعفاة:", revenueData.exemptedCars, "", "إجمالي الكاش:", `${revenueData.totalCash.toFixed(2)} ر.س`];
        ws2.getRow(17).values = ["سبب الإعفاء:", revenueData.exemptionReason, "", "إجمالي الشبكة:", `${revenueData.totalNetwork.toFixed(2)} ر.س`];
        ws2.getRow(18).values = ["السيارات المطلوبة بالخطأ:", revenueData.mistakeCars, "", "", ""];
        
        const paymentTotalRow = ws2.getRow(19);
        paymentTotalRow.values = ["", "", "", "المجموع:", `${paymentTotal.toFixed(2)} ر.س`];
        paymentTotalRow.getCell(4).style = totalRowStyle;
        paymentTotalRow.getCell(5).style = totalRowStyle;

        const differenceRow = ws2.getRow(20);
        const diffStyle = differenceStyle(difference);
        differenceRow.values = ["", "", "", "الفرق:", `${difference.toFixed(2)} ر.س`];
        differenceRow.getCell(4).style = diffStyle;
        differenceRow.getCell(5).style = diffStyle;

        if (difference !== 0 && revenueData.differenceReason) {
            ws2.mergeCells('A22:E22');
            const reasonHeader = ws2.getCell('A22');
            reasonHeader.value = "سبب الفرق";
            reasonHeader.style = subHeaderStyle;
            ws2.mergeCells('A23:E24');
            const reasonCell = ws2.getCell('A23');
            reasonCell.value = revenueData.differenceReason;
            reasonCell.style = { alignment: { wrapText: true, vertical: 'top' } };
        }

        ws2.columns = [{ width: 25 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 20 }];

        // --- Save File ---
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير-${reportData.date}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center print-hidden">
                <div>
                    <h2 className="text-2xl font-bold">معاينة التقرير</h2>
                    <p className="text-muted-foreground">تحقق من بيانات التقرير قبل التصدير.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}><Printer className="ml-2 h-4 w-4" /> طباعة</Button>
                    <Button onClick={handleExport}><Download className="ml-2 h-4 w-4" /> تصدير Excel</Button>
                </div>
            </div>

            <Card className="w-full max-w-4xl mx-auto p-8 print:shadow-none print:border-none" id="report-preview">
                <style>{`
                    @media print {
                        body { 
                            -webkit-print-color-adjust: exact; 
                            font-size: 10px;
                        }
                        .print-hidden { display: none; }
                        @page { 
                            size: A4;
                            margin: 1cm; 
                        }
                        #report-preview {
                            padding: 0 !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                            width: 100%;
                            max-width: 100%;
                        }
                        header, section, main {
                            margin-bottom: 10px !important;
                        }
                        .p-8 { padding: 0 !important; }
                        .my-8 { margin: 10px 0 !important; }
                        .mb-8 { margin-bottom: 10px !important; }
                        
                        .md\:grid-cols-2 {
                            grid-template-columns: 1fr;
                        }
                        .gap-8 {
                            gap: 10px;
                        }

                        h1 { font-size: 24px !important; }
                        h3 { font-size: 16px !important; }
                        th, td { padding: 4px 8px !important; }
                        .text-3xl { font-size: 24px !important; }
                        .text-2xl { font-size: 18px !important; }
                        .text-xl { font-size: 16px !important; }
                        .text-sm { font-size: 10px !important; }

                        .card-content,
                        .card-header {
                            padding: 8px !important;
                        }
                        section {
                            page-break-inside: avoid;
                        }
                    }
                `}</style>
                <header className="mb-8">
                    <div className="flex justify-between items-start">
                         <div>
                            <h1 className="text-3xl font-bold text-foreground">تقرير صف السيارات اليومي</h1>
                            <p className="text-muted-foreground">مشروع: {reportData.projectName}</p>
                        </div>
                        <div className="text-left">
                            <p><strong>التاريخ:</strong> {new Date(reportData.date).toLocaleDateString('ar-EG')}</p>
                            <p><strong>المشرف:</strong> {reportData.supervisorName}</p>
                        </div>
                    </div>
                </header>

                <Separator className="my-8" />
                
                <main>
                    <section className="mb-8">
                        <Card>
                             <CardHeader>
                                <CardTitle>ملخص الحضور</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">عدد الحضور</p>
                                    <p className="text-2xl font-bold">{reportData.attendanceCount}</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">عدد الغياب</p>
                                    <p className="text-2xl font-bold">{reportData.absenceCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                    
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">جدول إيرادات المواقع</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="bg-secondary font-semibold text-secondary-foreground">الموقع</TableHead>
                                    <TableHead className="bg-secondary font-semibold text-secondary-foreground">عدد السيارات</TableHead>
                                    <TableHead className="bg-secondary font-semibold text-secondary-foreground">مبالغ المواقف (ر.س)</TableHead>
                                    <TableHead className="bg-secondary font-semibold text-secondary-foreground">مبالغ الفاليه (ر.س)</TableHead>
                                    <TableHead className="text-right bg-secondary font-semibold text-secondary-foreground">المجموع (ر.س)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotels.map(hotel => {
                                    const revenue = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0 };
                                    const total = (revenue.parking || 0) + (revenue.valet || 0);
                                    if (!total && !revenue.cars) return null;
                                    return (
                                        <TableRow key={hotel}>
                                            <TableCell className="font-medium">{hotel}</TableCell>
                                            <TableCell>{revenue.cars}</TableCell>
                                            <TableCell className="font-mono">{revenue.parking.toFixed(2)}</TableCell>
                                            <TableCell className="font-mono">{revenue.valet.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono">{total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableRow className="bg-muted/80 font-bold">
                                <TableCell>الإجمالي</TableCell>
                                <TableCell>{totals.cars}</TableCell>
                                <TableCell className="font-mono">{totals.parking.toFixed(2)}</TableCell>
                                <TableCell className="font-mono">{totals.valet.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">{totals.total.toFixed(2)}</TableCell>
                            </TableRow>
                        </Table>
                    </section>
                    
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardHeader><CardTitle>تفاصيل إضافية</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between"><span>السيارات المعفاة:</span> <strong>{revenueData.exemptedCars}</strong></div>
                                {revenueData.exemptionReason && <div className="flex justify-between"><span>سبب الإعفاء:</span> <strong className="text-sm">{revenueData.exemptionReason}</strong></div>}
                                <div className="flex justify-between"><span>السيارات المطلوبة بالخطأ:</span> <strong>{revenueData.mistakeCars}</strong></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>ملخص الدفع</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between"><span>إجمالي الكاش:</span> <strong className="font-mono">{revenueData.totalCash.toFixed(2)} ر.س</strong></div>
                                <div className="flex justify-between"><span>إجمالي الشبكة:</span> <strong className="font-mono">{revenueData.totalNetwork.toFixed(2)} ر.س</strong></div>
                                <Separator/>
                                <div className="flex justify-between font-bold"><span>المجموع:</span> <span className="font-mono">{paymentTotal.toFixed(2)} ر.س</span></div>
                                <Separator/>
                                 <div className={`flex justify-between font-bold ${difference !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    <span>الفرق:</span>
                                    <span className="font-mono">{difference.toFixed(2)} ر.س</span>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {difference !== 0 && revenueData.differenceReason && (
                        <section>
                             <Card>
                                <CardHeader>
                                    <CardTitle>سبب الفرق</CardTitle>
                                    <CardDescription>التوضيح المسجل للفرق بين الإيرادات والدفع.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground bg-slate-50 p-4 rounded-md border">{revenueData.differenceReason}</p>
                                </CardContent>
                            </Card>
                        </section>
                    )}

                     {reportData.notes && (
                        <section>
                            <h3 className="text-xl font-semibold mb-4">الملاحظات</h3>
                            <p className="text-sm text-muted-foreground bg-slate-50 p-4 rounded-md border">{reportData.notes}</p>
                        </section>
                     )}
                </main>
            </Card>
        </div>
    );
}