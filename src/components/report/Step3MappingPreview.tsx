"use client";

import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { Download, Printer } from "lucide-react";
import { hotels } from "./Step1DataInput";
import * as XLSX from 'xlsx';

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

    const handleExport = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Report Details
        const ws1_data = [
            ["تقرير صف السيارات اليومي"],
            [],
            ["التاريخ:", reportData.date],
            ["الفندق الرئيسي:", reportData.hotel],
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
        <div className="space-y-6">
            <div className="flex justify-between items-center print:hidden">
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
                        body { -webkit-print-color-adjust: exact; }
                        .print-hidden { display: none; }
                        @page { margin: 0.5in; }
                    }
                `}</style>
                <header className="mb-8">
                    <div className="flex justify-between items-start">
                         <div>
                            <h1 className="text-3xl font-bold text-primary">تقرير صف السيارات اليومي</h1>
                            <p className="text-muted-foreground">للفندق: {reportData.hotel}</p>
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
                                    <TableHead>الموقع</TableHead>
                                    <TableHead>عدد السيارات</TableHead>
                                    <TableHead>مبالغ المواقف (ر.س)</TableHead>
                                    <TableHead>مبالغ الفاليه (ر.س)</TableHead>
                                    <TableHead className="text-right">المجموع (ر.س)</TableHead>
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