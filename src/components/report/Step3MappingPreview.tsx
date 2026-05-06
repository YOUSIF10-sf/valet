'use client';

import Image from "next/image";
import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer, Activity, DollarSign, Car, Database } from "lucide-react";

const hotels = ["ماريوت | Marriott", "دبل تري | DoubleTree", "هيلتون مؤتمرات | Hilton Conventions", "هيلتون أجنحة | Hilton Suites", "حياة ريجنسي | Hyatt Regency", "كونراد | Conrad", "جميرا | Jumeirah"];
const shiftMap: { [key: string]: string } = { morning: 'صباحية | Morning', evening: 'مسائية | Evening' };

interface Step3Props {
    reportData: ReportData;
    revenueData: RevenueData;
    reportId: string;
}

export function Step3MappingPreview({ reportData, revenueData, reportId }: Step3Props) {

    const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { total }) => acc + (total || 0), 0);
    const cashNetworkTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
    const difference = tableTotal - cashNetworkTotal;

    const handlePrint = () => window.print();

    return (
        <div id="report-preview" 
             style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}
             className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-10 max-w-5xl mx-auto font-sans print:p-0 print:shadow-none print:border-none print:w-full print:max-w-none relative overflow-hidden">
            
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
                @page {
                    size: A4;
                    margin: 15mm;
                }
                @media print {
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #report-preview {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                    }
                    /* Ensure headers and totals keep their dark backgrounds */
                    .bg-slate-900 { 
                        background-color: #0f172a !important; 
                        color: white !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    .text-white { color: white !important; }
                    .bg-indigo-50\\/20 { background-color: rgba(238, 242, 255, 0.4) !important; -webkit-print-color-adjust: exact !important; }
                    .bg-emerald-50\\/20 { background-color: rgba(236, 253, 245, 0.4) !important; -webkit-print-color-adjust: exact !important; }
                    
                    /* Hide browser headers/footers */
                    header, footer { break-inside: avoid; }
                }
            `}} />

            {/* Elegant Background Pattern for UI (Hidden in Print) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 print:hidden" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -ml-32 -mb-32 print:hidden" />

            <div className="relative z-10 space-y-8 print:space-y-4">
                {/* Action Buttons - Hidden in Print */}
                <div className="print:hidden flex justify-between items-center bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 mb-6">
                    <div className="flex gap-2">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      <span className="font-bold text-slate-700 text-sm">وضع المعاينة النشط | Preview Mode</span>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handlePrint} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 gap-2">
                            <Printer className="h-4 w-4" />
                            طباعة التقرير
                        </Button>
                    </div>
                </div>

                {/* Formal Header */}
                <header className="flex justify-between items-start pb-8 border-b-2 border-slate-100 print:border-black">
                    <div className="text-right space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest print:hidden">
                          Report Finalized
                        </div>
                        <h1 className="text-4xl print:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            تقرير الإيرادات اليومي
                        </h1>
                        <h2 className="text-xl print:text-sm font-medium text-slate-400 tracking-wide uppercase">
                            Daily Revenue Report
                        </h2>
                        <div className="mt-4 pt-2">
                            <p className="text-2xl print:text-lg font-black text-indigo-600">{reportData.projectName}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-mono">
                              <span>Ref: {reportId || 'N/A'}</span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span>Date: {formatDate(reportData.date)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-end">
                        <div className="flex flex-col items-end" dir="ltr">
                            <div className="text-3xl font-black tracking-tighter text-indigo-600 flex items-center gap-1">
                                EASY<span className="text-slate-900">VALET</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] text-right w-full">
                                Professional Services
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Financial Table */}
                <section className="space-y-4 print:space-y-2">
                    <div className="flex justify-between items-end print:hidden">
                        <div>
                          <h3 className="text-lg font-black text-slate-800">تفاصيل الإيرادات</h3>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Revenue Breakdown by Location</p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-[20px] overflow-hidden shadow-sm print:border-slate-800 print:rounded-none">
                        <Table className="w-full">
                            <TableHeader className="bg-slate-900 print:bg-slate-900">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-white font-bold h-12 px-4 text-xs whitespace-nowrap print:text-white">
                                        <div>الموقع</div>
                                    </TableHead>
                                    <TableHead className="text-white text-center font-bold h-12 text-xs print:text-white">
                                        <div>الكاشير</div>
                                    </TableHead>
                                    <TableHead className="text-white text-center font-bold h-12 text-xs print:text-white">
                                        <div>السيارات</div>
                                    </TableHead>
                                    <TableHead className="text-white text-center font-bold h-12 text-xs print:text-white">
                                        <div>المواقف</div>
                                    </TableHead>
                                    <TableHead className="text-white text-center font-bold h-12 text-xs print:text-white">
                                        <div>الفاليه</div>
                                    </TableHead>
                                    <TableHead className="text-white text-center font-bold h-12 text-xs print:text-white">
                                        <div>المجموع</div>
                                    </TableHead>
                                    <TableHead className="text-white text-right font-bold h-12 px-4 text-xs print:text-white">
                                        <div>ملاحظات</div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotels.map(hotelName => {
                                    const hotelKey = hotelName.split(' | ')[0];
                                    const revenue = revenueData.revenueByHotel[hotelKey] || { cars: 0, parking: 0, valet: 0, total: 0, cashierName: '', notes: '' };
                                    const total = revenue.total || (revenue.parking || 0) + (revenue.valet || 0);

                                    return (
                                        <TableRow key={hotelKey} className="border-slate-100 hover:bg-slate-50 transition-colors print:border-slate-300">
                                            <TableCell className="font-bold text-slate-700 py-4 px-4 whitespace-nowrap">
                                                {hotelKey}
                                            </TableCell>
                                            <TableCell className="text-center text-[10px] text-slate-500 font-medium">
                                                {revenue.cashierName || '-'}
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-slate-600">{revenue.cars || 0}</TableCell>
                                            <TableCell className="text-center font-mono font-bold text-indigo-600 bg-indigo-50/20 print:bg-indigo-50/20">
                                                {(revenue.parking || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-emerald-600 bg-emerald-50/20 print:bg-emerald-50/20">
                                                {(revenue.valet || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-black text-slate-900 bg-slate-50/50 print:bg-slate-50/50 border-x border-slate-100">
                                                {total.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right text-[10px] text-slate-400 italic max-w-[140px] truncate px-4">
                                                {revenue.notes || '-'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {/* Totals Row */}
                                <TableRow className="bg-slate-900 print:bg-slate-900 border-none">
                                    <TableCell colSpan={2} className="font-black text-white text-right py-4 px-4 print:text-white">
                                        <div className="text-sm">الإجمالي الكلي | TOTAL</div>
                                    </TableCell>
                                    <TableCell className="text-center font-black font-mono text-white print:text-white">
                                        {Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0)}
                                    </TableCell>
                                    <TableCell className="text-center font-black font-mono text-indigo-400 print:text-indigo-400">
                                        {Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center font-black font-mono text-emerald-400 print:text-emerald-400">
                                        {Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center font-black font-mono text-white text-xl print:text-white underline decoration-indigo-500 underline-offset-4">
                                        {Object.values(revenueData.revenueByHotel).reduce((acc, { total }) => acc + (total || 0), 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {/* Summaries & Discrepancies */}
                <section className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 print:gap-4 break-avoid pt-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-black text-slate-800 text-sm tracking-tight">التحليل المالي النهائي</h4>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 print:bg-transparent print:border-slate-300 print:p-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">إجمالي إيراد الجدول</span>
                                <span className="font-mono font-black text-slate-900 text-lg">{tableTotal.toLocaleString()} ر.س</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">إجمالي الكاش والشبكة</span>
                                <span className="font-mono font-black text-indigo-600 text-lg">{cashNetworkTotal.toLocaleString()} ر.س</span>
                            </div>
                            <div className="h-px bg-slate-200 my-2" />
                            <div className={`p-4 rounded-2xl flex justify-between items-center ${difference === 0 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-rose-600 text-white shadow-lg shadow-rose-100'}`}>
                                <span className="font-bold">الفرق النهائي | FINAL DIFF</span>
                                <span className="font-mono text-2xl font-black">{difference.toLocaleString()} ر.س</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-black text-slate-800 text-sm tracking-tight">تفاصيل استلام المبالغ</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-5 print:border-slate-300">
                                <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">CASH | نقدي</p>
                                <p className="text-2xl font-black text-indigo-700 font-mono">{(revenueData.totalCash || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-[24px] p-5 print:border-slate-300">
                                <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">NETWORK | شبكة</p>
                                <p className="text-2xl font-black text-emerald-700 font-mono">{(revenueData.totalNetwork || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        {revenueData.differenceReason && (
                          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 border border-slate-100 italic">
                            <span className="font-bold text-slate-700 not-italic ml-2">سبب الفرق:</span>
                            {revenueData.differenceReason}
                          </div>
                        )}
                    </div>
                </section>

                {/* Footer Signatures - Page 1 */}
                <footer className="mt-12 pt-12 border-t border-slate-100 flex justify-between items-end print:mt-8">
                    <div className="text-right space-y-4">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-right">Prepared By</p>
                        <div className="h-px w-48 bg-slate-200" />
                        <p className="text-sm font-black text-slate-800">توقيع الموظف المسؤول</p>
                    </div>
                    
                    <div className="text-center print:hidden flex flex-col items-center opacity-40">
                        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 mb-1">Authenticity Guaranteed</div>
                        <div className="h-1 w-24 bg-slate-100 rounded-full" />
                    </div>

                    <div className="text-left space-y-2 flex flex-col items-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest w-full text-left mb-2">Approved By Management</p>
                        <div className="relative flex flex-col items-center">
                            <div 
                                style={{ 
                                    fontFamily: "'Caveat', cursive",
                                    transform: "rotate(-3deg)",
                                    textShadow: "1px 1px 0px rgba(79, 70, 229, 0.1)"
                                }} 
                                className="text-indigo-600 font-bold text-5xl tracking-tighter mt-1 mb-2 select-none"
                            >
                                Yousif Tariq
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Managing Director
                            </div>
                        </div>
                        <div className="h-px w-56 bg-slate-100 mt-4" />
                        <p className="text-xs font-black text-slate-400 w-full text-center uppercase tracking-tighter">Official Signature</p>
                    </div>
                </footer>
            </div>

            {/* PAGE 2: Operational Annex */}
            <div 
                style={{ breakBefore: 'page' } as any}
                className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-10 max-w-5xl mx-auto font-sans print:p-0 print:shadow-none print:border-none print:w-full print:max-w-none relative overflow-hidden mt-10 print:mt-0"
            >
                {/* Header (Same as Page 1) */}
                <header className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                الملحق التشغيلي والملاحظات
                            </h1>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
                                Operational Annex & Notes | Page 02
                            </p>
                        </div>
                        
                        <div className="flex gap-6 items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Project</span>
                                <span className="text-sm font-black text-indigo-600">{reportData.projectName}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Date</span>
                                <span className="text-sm font-black text-slate-700">{reportData.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-end" dir="ltr">
                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-black tracking-tighter text-indigo-600 flex items-center gap-1">
                                EASY<span className="text-slate-900">VALET</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] text-right w-full">
                                Professional Services
                            </div>
                        </div>
                    </div>
                </header>

                <main className="space-y-10 relative z-10">
                    {/* Operational Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                                    <Car className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800">تفاصيل الإعفاءات</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                                    <span className="text-sm font-bold text-slate-500 uppercase">Count | العدد</span>
                                    <span className="text-3xl font-black text-slate-900">{revenueData.exemptedCars}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase text-right">Reason | السبب</span>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 min-h-[60px]">
                                        {revenueData.exemptionReason || "لا يوجد سبب محدد"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-600">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800">الأخطاء التشغيلية</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                                    <span className="text-sm font-bold text-slate-500 uppercase">Mistakes | مطلوبة بالخطأ</span>
                                    <span className="text-3xl font-black text-rose-600">{revenueData.mistakeCars}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 leading-tight">
                                    * تم رصد هذه السيارات كأخطاء في الطلب أو تم إلغاؤها بعد التأكيد.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes Box */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800">ملاحظات إضافية وتوصيات</h3>
                        </div>
                        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm relative overflow-hidden min-h-[300px]">
                            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600/10" />
                            <p className="text-lg font-bold text-slate-700 leading-relaxed whitespace-pre-wrap text-right">
                                {reportData.notes || "لا توجد ملاحظات إضافية لهذا اليوم."}
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer Signature - Page 2 */}
                <footer className="mt-12 pt-12 border-t border-slate-100 flex justify-between items-end">
                    <div className="text-right space-y-4">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-right">Annex Verified By</p>
                        <div className="h-px w-48 bg-slate-200" />
                        <p className="text-sm font-black text-slate-800 text-right">توقيع الموظف المسؤول</p>
                    </div>
                    
                    <div className="text-left space-y-2 flex flex-col items-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest w-full text-left mb-2">Approved By Management</p>
                        <div className="relative flex flex-col items-center">
                            <div 
                                style={{ 
                                    fontFamily: "'Caveat', cursive",
                                    transform: "rotate(-3deg)",
                                    textShadow: "1px 1px 0px rgba(79, 70, 229, 0.1)"
                                }} 
                                className="text-indigo-600 font-bold text-5xl tracking-tighter mt-1 mb-2 select-none"
                            >
                                Yousif Tariq
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Managing Director
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Developer Credit - Outside the card */}
            <div className="mt-12 mb-6 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity print:hidden">
                <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                  Designed & Developed By
                </p>
                <div className="flex flex-col items-center">
                  <span className="text-slate-600 font-black text-sm tracking-tight uppercase">
                    ❤️ YOUSIF TARIQ
                  </span>
                  <div className="h-16 w-48 -mt-2">
                    <img 
                      src="/signature.png" 
                      alt="Yousif Tariq Signature" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
            </div>
        </div>
    );
}

const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
};
