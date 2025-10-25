'use client';
import { RevenueData } from './Step2TemplateSelection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ReportData } from './Step1DataInput';
import { Calendar, User, Users, ClipboardList, Clock } from 'lucide-react';

interface Step3Props {
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
  return `${year}/${month}/${day}`;
};

const shiftMap: { [key: string]: string } = {
  morning: 'صباحية',
  evening: 'مسائية',
};

export function Step3MappingPreview({ reportData, revenueData, reportId }: Step3Props) {

    if (!revenueData || !revenueData.revenueByHotel) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">لا توجد بيانات لعرضها. يرجى الرجوع وإدخال تفاصيل الإيرادات.</p>
            </div>
        );
    }

    const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
    const cashNetworkTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
    const difference = tableTotal - cashNetworkTotal;
    
    const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0);
    const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0);
    const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-slate-50" id="report-preview">
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    #report-preview, #report-preview * { visibility: visible; }
                    #report-preview { 
                        position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 10px; 
                        font-size: 10px;
                        background-color: #ffffff !important;
                    }
                    .no-print { display: none; }
                    .printable-card { page-break-inside: avoid; box-shadow: none; border: 1px solid #e2e8f0; }
                    @page { size: A4; margin: 0.5cm; }
                }
            `}</style>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <header className="bg-slate-800 text-white rounded-lg p-4 mb-6 text-center">
                    <h1 className="text-2xl font-bold">تقرير الإيرادات اليومي</h1>
                    <p className="text-md text-slate-300 mt-1">{reportData.projectName}</p>
                </header>

                <main className="space-y-6">
                    {/* General Info Card */}
                    <Card className="printable-card">
                        <CardHeader className="bg-slate-50 rounded-t-lg p-3">
                            <CardTitle className="text-lg flex items-center gap-2"><ClipboardList className="h-5 w-5"/> معلومات التقرير</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500"/><strong>التاريخ:</strong> <span>{formatDate(reportData.date)}</span></div>
                            {reportData.reportType === 'daily' && reportData.shift && (
                                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500"/><strong>الوردية:</strong> <span>{shiftMap[reportData.shift] || reportData.shift}</span></div>
                            )}
                            <div className="flex items-center gap-2"><User className="h-4 w-4 text-slate-500"/><strong>المشرف:</strong> <span>{reportData.supervisorName}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500"/><strong>الحضور:</strong> <span className="font-mono">{reportData.attendanceCount}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500"/><strong>الغياب:</strong> <span className="font-mono">{reportData.absenceCount}</span></div>
                            {reportData.notes && <div className="col-span-full pt-2 border-t mt-2"><p><strong>ملاحظات:</strong> {reportData.notes}</p></div>}
                        </CardContent>
                    </Card>

                    {/* Revenue Table Card */}
                    <Card className="printable-card">
                        <CardHeader className="bg-slate-50 rounded-t-lg p-3">
                           <CardTitle className="text-lg">ملخص الإيرادات</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100">
                                        <TableHead className="font-bold">الموقع</TableHead>
                                        <TableHead className="font-bold">اسم الكاشير</TableHead>
                                        <TableHead className="text-center font-bold">السيارات</TableHead>
                                        <TableHead className="text-center font-bold">المواقف (ر.س)</TableHead>
                                        <TableHead className="text-center font-bold">الفاليه (ر.س)</TableHead>
                                        <TableHead className="text-right font-bold">المجموع (ر.س)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(revenueData.revenueByHotel).map(([hotel, revenue]) => (
                                        <TableRow key={hotel} className="hover:bg-slate-50">
                                            <TableCell className="font-medium">{hotel}</TableCell>
                                            <TableCell>{revenue.cashierName || '-'}</TableCell>
                                            <TableCell className="text-center font-mono">{revenue.cars || 0}</TableCell>
                                            <TableCell className="text-center font-mono">{(revenue.parking || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-center font-mono">{(revenue.valet || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono font-semibold">{((revenue.parking || 0) + (revenue.valet || 0)).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableRow className="bg-slate-200 font-bold text-black">
                                    <TableCell colSpan={2}>الإجمالي</TableCell>
                                    <TableCell className="text-center font-mono">{totalCars}</TableCell>
                                    <TableCell className="text-center font-mono">{totalParking.toFixed(2)}</TableCell>
                                    <TableCell className="text-center font-mono">{totalValet.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono">{tableTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Payment & Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="printable-card lg:col-span-2">
                            <CardHeader className="bg-slate-50 rounded-t-lg p-3"><CardTitle className="text-lg">ملخص الدفع والتفاصيل</CardTitle></CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2 p-3 bg-blue-50 rounded-lg"><strong>إجمالي الكاش:</strong> <span className="font-mono block text-lg">{revenueData.totalCash.toFixed(2)} ر.س</span></div>
                                <div className="space-y-2 p-3 bg-blue-50 rounded-lg"><strong>إجمالي الشبكة:</strong> <span className="font-mono block text-lg">{revenueData.totalNetwork.toFixed(2)} ر.س</span></div>
                                <div className="col-span-2"><Separator/></div>
                                <div className="flex justify-between items-center"><span>سيارات معفاة:</span> <span className="font-mono font-bold">{revenueData.exemptedCars || 0}</span></div>
                                <div className="flex justify-between items-center"><span>سيارات بالخطأ:</span> <span className="font-mono font-bold">{revenueData.mistakeCars || 0}</span></div>
                                {revenueData.exemptionReason && <p className="col-span-2 text-xs p-2 bg-gray-50 rounded"><strong>سبب الإعفاء:</strong> {revenueData.exemptionReason}</p>}
                            </CardContent>
                        </Card>

                        <div className={`printable-card rounded-lg flex flex-col justify-center text-center p-4 ${difference !== 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                           <h3 className={`font-bold ${difference !== 0 ? 'text-red-800' : 'text-green-800'}`}>الفرق المالي</h3>
                           <p className={`text-3xl font-bold font-mono my-2 ${difference !== 0 ? 'text-red-700' : 'text-green-700'}`}>
                             {difference.toFixed(2)} <span className="text-lg">ر.س</span>
                           </p>
                           {difference !== 0 && revenueData.differenceReason && <p className="text-xs mt-1 p-1 rounded bg-red-200/50"><strong>السبب:</strong> {revenueData.differenceReason}</p>}
                           {difference === 0 && <p className="text-sm text-green-600">لا يوجد فرق</p>}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
