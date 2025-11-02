'use client';

import Image from "next/image";
import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";

const hotels = ["ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"];
const shiftMap: { [key: string]: string } = { morning: 'صباحية', evening: 'مسائية' };

interface Step3Props {
    reportData: ReportData;
    revenueData: RevenueData;
    reportId: string;
}

const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function Step3MappingPreview({ reportData, revenueData, reportId }: Step3Props) {
    
    const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
    const cashNetworkTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
    const difference = tableTotal - cashNetworkTotal;
    const isMonthlyReport = reportData.reportType === 'monthly';

    const handlePrint = () => window.print();
    const handleExport = () => exportToExcel(reportData, revenueData, reportId);

    return (
        <div id="report-preview" className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto font-sans print:shadow-none print:p-0 print:max-w-none print:rounded-none">
            {/* Action Buttons - Hidden in Print View */}
            <div className="print:hidden flex justify-end items-center gap-2 mb-6">
                 <Button onClick={handleExport} variant="outline">
                    <FileSpreadsheet className="ml-2 h-5 w-5" />
                    تصدير Excel
                </Button>
                <Button onClick={handlePrint} variant="outline">
                    <Printer className="ml-2 h-5 w-5" />
                    طباعة التقرير
                </Button>
            </div>

            {/* Report Header */}
            <header className="flex justify-between items-start pb-4 border-b-2 border-gray-100 print:border-b-black">
                <div className="text-right">
                    <h1 className="text-3xl print:text-2xl font-bold text-gray-800">{`تقرير الإيرادات - ${isMonthlyReport ? 'شهري' : 'يومي'}`}</h1>
                    <p className="text-md text-gray-500">{reportData.projectName}</p>
                </div>
                <div className="text-left flex flex-col items-end">
                    <Image src="/logo.png" alt="شعار الشركة" width={120} height={40} priority />
                    <p className="text-sm text-gray-500 mt-2">{formatDate(reportData.date)}</p>
                </div>
            </header>

            {/* Report Metadata */}
            <section className="grid grid-cols-4 gap-4 my-4">
                 <InfoCard label="المشرف" value={reportData.supervisorName} />
                 {!isMonthlyReport && <InfoCard label="الوردية" value={shiftMap[reportData.shift || 'morning']} />}
                 {!isMonthlyReport && <InfoCard label="الحضور" value={reportData.attendanceCount} />}
                 {!isMonthlyReport && <InfoCard label="الغياب" value={reportData.absenceCount} />}
                 {isMonthlyReport && <InfoCard label="الشهر" value={reportData.month} />}
                 {isMonthlyReport && <InfoCard label="السنة" value={reportData.year} />}
            </section>

            {/* Financial Tables and Summaries */}
            <section className="space-y-4">
                <Card className="print:border-gray-400">
                    <CardHeader className="p-3"><CardTitle className="text-lg">تفاصيل الإيرادات</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الموقع</TableHead>
                                    {!isMonthlyReport && <TableHead>الكاشير</TableHead>}
                                    <TableHead>عدد السيارات</TableHead>
                                    <TableHead>مبالغ المواقف</TableHead>
                                    <TableHead>مبالغ الفاليه</TableHead>
                                    <TableHead className="text-right">المجموع</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotels.map(hotel => {
                                    const revenue = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0, cashierName: '' };
                                    const total = (revenue.parking || 0) + (revenue.valet || 0);
                                    return (
                                        <TableRow key={hotel} className="text-xs">
                                            <TableCell className="font-medium p-2">{hotel}</TableCell>
                                            {!isMonthlyReport && <TableCell className="p-2">{revenue.cashierName || '-'}</TableCell>}
                                            <TableCell className="p-2">{revenue.cars || 0}</TableCell>
                                            <TableCell className="p-2">{(revenue.parking || 0).toFixed(2)}</TableCell>
                                            <TableCell className="p-2">{(revenue.valet || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono p-2">{total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow className="bg-gray-50 font-bold text-gray-700 text-sm">
                                    <TableCell className="p-2" colSpan={isMonthlyReport ? 1 : 2}>الإجمالي</TableCell>
                                    <TableCell className="p-2">{Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0)}</TableCell>
                                    <TableCell className="font-mono p-2">{Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0).toFixed(2)}</TableCell>
                                    <TableCell className="font-mono p-2">{Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0).toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono p-2">{tableTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                   <SummaryCard title="ملخص الإيرادات">
                        <SummaryRow label="إجمالي إيراد الجدول" value={tableTotal.toFixed(2)} />
                        <SummaryRow label="إجمالي المدفوعات (كاش + شبكة)" value={cashNetworkTotal.toFixed(2)} />
                        <Separator className="my-2"/>
                        <SummaryRow 
                            label="الفرق" 
                            value={difference.toFixed(2)} 
                            valueClass={difference !== 0 ? 'text-destructive' : 'text-green-500'} 
                        />
                        {difference !== 0 && <p className="text-xs text-gray-500 pt-1"><strong>السبب:</strong> {revenueData.differenceReason || 'غير محدد'}</p>}
                    </SummaryCard>
                    
                    <SummaryCard title="تفاصيل الدفع">
                        <SummaryRow label="إجمالي الكاش" value={(revenueData.totalCash || 0).toFixed(2)} />
                        <SummaryRow label="إجمالي الشبكة" value={(revenueData.totalNetwork || 0).toFixed(2)} />
                    </SummaryCard>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="print:border-gray-400"><CardHeader className="p-3"><CardTitle className="text-base">معلومات إضافية</CardTitle></CardHeader><CardContent className="p-3 space-y-2 text-sm"><p>السيارات المعفاة: {revenueData.exemptedCars || 0}</p><p>السيارات المطلوبة بالخطأ: {revenueData.mistakeCars || 0}</p></CardContent></Card>
                    {reportData.notes && <Card className="print:border-gray-400"><CardHeader className="p-3"><CardTitle className="text-base">ملاحظات</CardTitle></CardHeader><CardContent className="p-3"><p className="text-sm whitespace-pre-wrap">{reportData.notes}</p></CardContent></Card>}
                </div>
            </section>
        </div>
    );
}

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-gray-50 print:border print:border-gray-400 p-2 rounded-lg text-center">
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
);

const SummaryCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="print:border-gray-400"><CardHeader className="p-3"><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent className="p-3 space-y-1">{children}</CardContent></Card>
);

const SummaryRow = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600">{label}:</p>
        <p className={`font-mono font-semibold ${valueClass || 'text-gray-800'}`}>{value} ر.س</p>
    </div>
);
