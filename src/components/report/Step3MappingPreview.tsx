'use client';
import Image from 'next/image';
import { RevenueData } from './Step2TemplateSelection';
import { ReportData } from './Step1DataInput';
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Calendar, User, Users, ClipboardList, Clock, Landmark, HandCoins, 
    FileText, AlertTriangle, CheckCircle2, TrendingUp
} from 'lucide-react';

// Props interface
interface Step3Props {
  reportData: ReportData;
  revenueData: RevenueData;
  reportId: string;
}

// Helper Functions
const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};
const shiftMap: { [key: string]: string } = { morning: 'صباحية', evening: 'مسائية' };
const monthMap: { [key: string]: string } = {
  '1': 'يناير', '2': 'فبراير', '3': 'مارس', '4': 'أبريل', '5': 'مايو', '6': 'يونيو',
  '7': 'يوليو', '8': 'أغسطس', '9': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
};

// --- Main Component --- //
export function Step3MappingPreview({ reportData, revenueData, reportId }: Step3Props) {

    if (!revenueData || !revenueData.revenueByHotel) {
        return <div className="p-8 text-center text-gray-500">لا توجد بيانات لعرضها.</div>;
    }

    // Calculations
    const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
    const difference = tableTotal - ((revenueData.totalCash || 0) + (revenueData.totalNetwork || 0));
    const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0);
    const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0);
    const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0);
    const isMonthlyReport = reportData.reportType === 'monthly';

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
                body {
                    font-family: 'Tajawal', sans-serif;
                }
                @media print {
                    /* This is a browser requirement to ensure backgrounds and colors are printed. */
                    body {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `}</style>

            <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-gray-50">
                 <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border-2 border-gray-100">
                    <header className="bg-slate-800 text-white rounded-t-xl p-6 flex justify-between items-center">
                        <div>
                           <h1 className="font-bold text-3xl">{reportData.projectName}</h1>
                           <p className="text-lg text-slate-300 mt-1">{isMonthlyReport ? "تقرير الإيرادات الشهري" : "تقرير الإيرادات اليومي"}</p>
                        </div>
                        <div className="w-40 h-auto">
                             <Image src="/logo.png" alt="شعار سهل" width={2048} height={654} layout="responsive" className="filter brightness-0 invert"/>
                        </div>
                    </header>

                    <main className="p-2 sm:p-4 space-y-6">
                        <section>
                            <SectionTitle icon={ClipboardList} title="تفاصيل التقرير" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {isMonthlyReport ? (
                                    <>
                                        <InfoRow label="الشهر" value={monthMap[reportData.month || ''] || 'N/A'} icon={Calendar} />
                                        <InfoRow label="السنة" value={reportData.year || 'N/A'} icon={Calendar} />
                                    </>
                                ) : (
                                    <>
                                        <InfoRow label="تاريخ التقرير" value={formatDate(reportData.date)} icon={Calendar} />
                                        <InfoRow label="الوردية" value={shiftMap[reportData.shift || ''] || 'N/A'} icon={Clock} />
                                    </>
                                )}
                                <InfoRow label="اسم المشرف" value={reportData.supervisorName} icon={User} />
                                {!isMonthlyReport && <InfoRow label="عدد الحضور" value={reportData.attendanceCount} icon={Users} />}
                                {!isMonthlyReport && <InfoRow label="عدد الغياب" value={reportData.absenceCount} icon={Users} />}
                            </div>
                        </section>
                        
                        <Separator />

                        <section>
                            <SectionTitle icon={Landmark} title="ملخص إيرادات المواقع" />
                            <div className="mt-4 border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-100/70">
                                        <TableRow>
                                            <TableHead className="font-bold text-slate-600">الموقع</TableHead>
                                            {!isMonthlyReport && <TableHead className="font-bold text-slate-600">الكاشير</TableHead>}
                                            <TableHead className="text-center font-bold text-slate-600">السيارات</TableHead>
                                            <TableHead className="text-center font-bold text-slate-600">إيراد المواقف</TableHead>
                                            <TableHead className="text-center font-bold text-slate-600">إيراد الفاليه</TableHead>
                                            <TableHead className="text-right font-bold text-slate-600">الإجمالي</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(revenueData.revenueByHotel).map(([hotel, revenue]) => (
                                            <TableRow key={hotel} className="border-slate-100">
                                                <TableCell className="font-medium">{hotel}</TableCell>
                                                {!isMonthlyReport && <TableCell>{revenue.cashierName || '-'}</TableCell>}
                                                <TableCell className="text-center font-mono">{revenue.cars || 0}</TableCell>
                                                <TableCell className="text-center font-mono">{`ر.س ${(revenue.parking || 0).toFixed(2)}`}</TableCell>
                                                <TableCell className="text-center font-mono">{`ر.س ${(revenue.valet || 0).toFixed(2)}`}</TableCell>
                                                <TableCell className="text-right font-mono font-bold">{`ر.س ${((revenue.parking || 0) + (revenue.valet || 0)).toFixed(2)}`}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TotalRow isMonthly={isMonthlyReport} cars={totalCars} parking={totalParking} valet={totalValet} total={tableTotal} />
                                </Table>
                            </div>
                        </section>

                        <Separator />

                        <section>
                             <SectionTitle icon={HandCoins} title="الملخص المالي والملاحظات" />
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FinancialSummaryItem label="إجمالي الكاش" value={revenueData.totalCash} icon={TrendingUp} color="blue" />
                                        <FinancialSummaryItem label="إجمالي الشبكة" value={revenueData.totalNetwork} icon={TrendingUp} color="purple" />
                                    </div>
                                    <DifferenceCard difference={difference} reason={revenueData.differenceReason} />
                                </div>
                                
                                <div className="space-y-4">
                                    <NotesCard title="تفاصيل إضافية" items={[
                                        `سيارات معفاة: ${revenueData.exemptedCars || 0}`,
                                        `سيارات بالخطأ: ${revenueData.mistakeCars || 0}`,
                                        revenueData.exemptionReason ? `سبب الإعفاء: ${revenueData.exemptionReason}` : null
                                    ]} icon={FileText} />
                                </div>

                                {reportData.notes && (
                                    <div className="lg:col-span-3">
                                        <NotesCard title="ملاحظات المشرف" content={reportData.notes} icon={FileText} />
                                    </div>
                                )}
                             </div>
                        </section>
                    </main>
                    
                    <div className="hidden print:block pt-4 mt-4 border-t text-center text-xs text-slate-500">
                        <p>تقرير رقم: {reportId} | تم إنشاؤه بتاريخ: {formatDate(new Date())} | © {new Date().getFullYear()} {reportData.projectName}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

// --- Reusable Sub-components --- //

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-slate-500" />
        <h2 className="font-bold text-2xl text-slate-700">{title}</h2>
    </div>
);

const InfoRow = ({ label, value, icon: Icon }: { label: string, value: any, icon: React.ElementType }) => (
    <div className="bg-slate-50/70 border rounded-lg p-3 flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="text-md text-slate-800 font-bold">{value}</strong>
        </div>
    </div>
);

const TotalRow = ({ isMonthly, cars, parking, valet, total }: any) => (
    <TableRow className="bg-slate-100 font-bold text-slate-800 text-md">
        <TableCell colSpan={isMonthly ? 1 : 2} className="py-3">الإجمالي النهائي</TableCell>
        <TableCell className="text-center font-mono py-3">{cars}</TableCell>
        <TableCell className="text-center font-mono py-3">{`ر.س ${parking.toFixed(2)}`}</TableCell>
        <TableCell className="text-center font-mono py-3">{`ر.س ${valet.toFixed(2)}`}</TableCell>
        <TableCell className="text-right font-mono py-3">{`ر.س ${total.toFixed(2)}`}</TableCell>
    </TableRow>
);

const FinancialSummaryItem = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: React.ElementType, color: 'blue' | 'purple' }) => {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' }
    };
    return (
        <div className={`border rounded-lg p-4 ${colors[color].bg} ${colors[color].border}`}>
            <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${colors[color].text}`} />
                <p className={`text-sm font-semibold ${colors[color].text}`}>{label}</p>
            </div>
            <p className={`font-extrabold text-2xl mt-2 ${colors[color].text}`}>{`ر.س ${value.toFixed(2)}`}</p>
        </div>
    );
};

const DifferenceCard = ({ difference, reason }: { difference: number, reason?: string }) => {
    const isZero = difference === 0;
    const color = isZero ? 'green' : 'red';
    const Icon = isZero ? CheckCircle2 : AlertTriangle;
    const title = isZero ? 'لا يوجد فرق مالي' : (difference > 0 ? 'يوجد فائض' : 'يوجد عجز');
     const colors = {
        green: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
        red: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
    };

    return (
        <div className={`border rounded-lg p-4 text-center ${colors[color].bg} ${colors[color].border}`}>
            <Icon className={`w-10 h-10 mx-auto ${colors[color].text}`} />
            <h3 className={`font-bold text-xl mt-2 ${colors[color].text}`}>{title}</h3>
            <p className={`font-mono font-extrabold text-3xl my-1 ${colors[color].text}`}>{`${difference.toFixed(2)}`}<span className="text-xl"> ر.س</span></p>
            {reason && !isZero && <p className="text-xs text-slate-600 mt-2 whitespace-pre-wrap break-words"><strong>السبب:</strong> {reason}</p>}
        </div>
    );
};

const NotesCard = ({ title, content, items, icon: Icon }: { title: string, content?: string, items?: (string|null)[], icon: React.ElementType }) => (
    <div className="bg-slate-50/70 border rounded-lg p-4 h-full">
        <div className="flex items-center gap-2">
             <Icon className="w-5 h-5 text-slate-500" />
             <h3 className="font-bold text-slate-700 text-md">{title}</h3>
        </div>
        <div className="text-sm text-slate-600 mt-3 pl-1 space-y-2">
            {content && <p className="whitespace-pre-wrap break-words">{content}</p>}
            {items && <ul className="list-disc list-inside space-y-1">{items.filter(i => i).map((item, i) => <li key={i} className="whitespace-pre-wrap break-words">{item}</li>)}</ul>}
        </div>
    </div>
);
