"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DeveloperSignature } from "@/components/DeveloperSignature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, BarChart3, ArrowLeftRight, TrendingUp, Users, DollarSign, Loader2, Zap, Activity, Share2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ExcelJS from "exceljs";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function MonthlyReportPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [revenueReports, setRevenueReports] = useState<any[]>([]);
  const [zapsReports, setZapsReports] = useState<any[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchMonthlyData = async () => {
    if (!fromDate || !toDate) {
      alert("يرجى تحديد التاريخ من وإلى");
      return;
    }

    setLoading(true);
    setRevenueReports([]);
    setZapsReports([]);
    try {
      const [revRes, zapsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/zaps")
      ]);
      
      const revData = await revRes.json();
      const zapsData = await zapsRes.json();
      
      if (revData.success && zapsData.success) {
        const filteredRev = revData.reports.filter((r: any) => r.date >= fromDate && r.date <= toDate);
        const filteredZaps = zapsData.zaps.filter((z: any) => {
          const zDate = z.created_at?.split('T')[0];
          return zDate >= fromDate && zDate <= toDate;
        });

        setRevenueReports(filteredRev);
        setZapsReports(filteredZaps);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error("Failed to fetch unified data", err);
      alert("حدث خطأ أثناء جلب البيانات الموحدة");
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const revTotal = revenueReports.reduce((acc, r) => acc + (r.total_revenue || 0), 0);
    const valetTotal = revenueReports.reduce((acc, r) => acc + (r.valet_revenue || 0), 0);
    const carsTotal = revenueReports.reduce((acc, r) => acc + (r.cars_handled || 0), 0);
    const zapsCount = zapsReports.length;
    const zapsRev = zapsReports.reduce((acc, z) => acc + (parseFloat(z.amount) || 0), 0);
    return { revTotal, valetTotal, carsTotal, zapsCount, zapsRev, combinedRevenue: revTotal + zapsRev };
  }, [revenueReports, zapsReports]);

  const hotelStats = useMemo(() => {
    const stats: Record<string, { hotel: string; cars: number; parking: number; valet: number; total: number }> = {};

    revenueReports.forEach(report => {
      let detailedData;
      try {
        detailedData = typeof report.detailed_data === 'string' ? JSON.parse(report.detailed_data) : report.detailed_data;
      } catch (e) {
        return;
      }

      if (detailedData && detailedData.revenueByHotel) {
        Object.entries(detailedData.revenueByHotel).forEach(([hotelName, data]: [string, any]) => {
          if (!stats[hotelName]) {
            stats[hotelName] = { hotel: hotelName, cars: 0, parking: 0, valet: 0, total: 0 };
          }
          const cars = Number(data.cars) || 0;
          const parking = Number(data.parking) || 0;
          const valet = Number(data.valet) || 0;
          
          stats[hotelName].cars += cars;
          stats[hotelName].parking += parking;
          stats[hotelName].valet += valet;
          stats[hotelName].total += (parking + valet);
        });
      }
    });

    return Object.values(stats);
  }, [revenueReports]);

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    
    const revSheet = workbook.addWorksheet("الإيرادات اليومية");
    revSheet.columns = [
      { header: "التاريخ", key: "date", width: 15 },
      { header: "السيارات", key: "cars", width: 15 },
      { header: "إيراد المواقف", key: "parking", width: 15 },
      { header: "إيراد الفاليه", key: "valet", width: 15 },
      { header: "الإجمالي", key: "total", width: 15 },
    ];
    revenueReports.forEach(r => revSheet.addRow({ 
      date: r.date, 
      cars: r.cars_handled, 
      parking: (r.total_revenue - (r.valet_revenue || 0)),
      valet: r.valet_revenue,
      total: r.total_revenue 
    }));
    revSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    revSheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'0EA5E9' } };

    const hotelSheet = workbook.addWorksheet("تحليل الفنادق");
    hotelSheet.columns = [
        { header: "الفندق", key: "hotel", width: 25 },
        { header: "عدد السيارات", key: "cars", width: 15 },
        { header: "إيراد المواقف", key: "parking", width: 15 },
        { header: "إيراد الفاليه", key: "valet", width: 15 },
        { header: "الإجمالي", key: "total", width: 15 },
    ];
    hotelStats.forEach(h => hotelSheet.addRow(h));
    hotelSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    hotelSheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'10B981' } };

    const zapsSheet = workbook.addWorksheet("عمليات ZAPS");
    zapsSheet.columns = [
      { header: "رقم اللوحة", key: "plate", width: 15 },
      { header: "المبلغ", key: "amount", width: 15 },
      { header: "الوقت", key: "time", width: 25 },
    ];
    zapsReports.forEach(z => zapsSheet.addRow({ 
      plate: z.car_number, 
      amount: z.amount, 
      time: new Date(z.created_at).toLocaleString('ar-SA') 
    }));
    zapsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    zapsSheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'F97316' } };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Unified_Report_${fromDate}_to_${toDate}.xlsx`;
    anchor.click();
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "monthly",
          config: { from: fromDate, to: toDate }, 
          title: `تقرير شهري: ${fromDate} - ${toDate}`
        })
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.origin}/share/${data.id}`;
        setShareLink(url);
      }
    } catch (err) {
      console.error(err);
      alert("فشل إنشاء رابط المشاركة");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 container mx-auto py-8 px-4 md:px-8 space-y-8">
          
          {/* Light Futuristic Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Activity className="w-6 h-6" />
                </div>
                مركز التحكم والتحليل الموحد
              </h1>
              <p className="text-slate-500 font-bold mr-14">تحليل شامل يجمع بين الإيرادات اليومية وعمليات ZAPS</p>
            </div>
            
            {hasGenerated && (
              <div className="flex gap-3">
                <Button 
                  onClick={handleShare}
                  disabled={sharing}
                  className="h-14 px-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-slate-900 font-black transition-all flex items-center gap-3 shadow-sm"
                >
                  {sharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5 text-indigo-500" />}
                  مشاركة الرابط التفاعلي
                </Button>
                <Button 
                  onClick={handleExport}
                  className="h-14 px-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-slate-900 font-black transition-all flex items-center gap-3 shadow-sm"
                >
                  <Download className="w-5 h-5 text-primary" />
                  تصدير التقرير الموحد (Excel)
                </Button>
              </div>
            )}
          </div>

          {/* Light Date Selector */}
          <Card className="border-none bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[40px] overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">من تاريخ البدء</label>
                  <Input type="date" className="h-16 rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-xl focus:ring-2 focus:ring-primary/20 transition-all" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">إلى تاريخ الانتهاء</label>
                  <Input type="date" className="h-16 rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-xl focus:ring-2 focus:ring-primary/20 transition-all" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <Button onClick={fetchMonthlyData} disabled={loading} className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 group">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><TrendingUp className="w-6 h-6 group-hover:scale-125 transition-transform text-primary" />توليد التحليل الموحد</>}
                </Button>
              </div>

              {shareLink && (
                <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-indigo-900">تم إنشاء رابط المشاركة التفاعلي!</p>
                      <p className="text-xs text-indigo-400 font-bold">يمكن لأي شخص لديه الرابط عرض التقرير</p>
                    </div>
                  </div>
                  <div className="flex w-full md:w-auto bg-white p-2 rounded-2xl border border-indigo-100 shadow-sm items-center gap-3">
                    <code className="px-4 text-xs font-black text-indigo-600 truncate max-w-[200px]">{shareLink}</code>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={cn("h-10 rounded-xl px-4 font-black transition-all", copied ? "bg-emerald-500 hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700")}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "تم النسخ" : "نسخ الرابط"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {hasGenerated && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              
              {/* Stats Grid - Vibrant against Light Background */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">إجمالي الإيرادات</p>
                   <p className="text-4xl font-black text-slate-900">{totals.revTotal.toLocaleString()} <span className="text-xs text-slate-300">ر.س</span></p>
                   <div className="mt-4 flex items-center gap-2 text-blue-500 text-xs font-black"><TrendingUp className="w-4 h-4" />{revenueReports.length} يوم سجل</div>
                </div>

                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">مجموع الفاليه</p>
                   <p className="text-4xl font-black text-indigo-600">{totals.valetTotal.toLocaleString()} <span className="text-xs text-slate-300">ر.س</span></p>
                   <div className="mt-4 flex items-center gap-2 text-indigo-500 text-xs font-black"><DollarSign className="w-4 h-4" />إيرادات خدمات الصف</div>
                </div>

                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">إيراد ZAPS</p>
                   <p className="text-4xl font-black text-slate-900">{totals.zapsRev.toLocaleString()} <span className="text-xs text-slate-300">ر.س</span></p>
                   <div className="mt-4 flex items-center gap-2 text-orange-500 text-xs font-black"><Zap className="w-4 h-4" />{totals.zapsCount} عملية</div>
                </div>

                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">إجمالي الحركات</p>
                   <p className="text-4xl font-black text-slate-900">{(totals.carsTotal + totals.zapsCount).toLocaleString()}</p>
                   <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-black"><Users className="w-4 h-4" />سيارات وعمليات</div>
                </div>

                <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">الإيراد الموحد الكلي</p>
                   <p className="text-4xl font-black text-primary">{totals.combinedRevenue.toLocaleString()} <span className="text-xs opacity-50">ر.س</span></p>
                   <div className="mt-4 flex items-center gap-2 text-primary/60 text-xs font-black"><DollarSign className="w-4 h-4" />شامل جميع المصادر</div>
                </div>
              </div>

              {/* Light Analytics Chart */}
              <Card className="border-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-[40px] p-8 overflow-hidden">
                <CardHeader className="p-0 mb-12">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">التحليل البياني المزدوج</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-primary" /> إيرادات
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-orange-500" /> Zaps
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={
                      Array.from(new Set([
                        ...revenueReports.map(r => r.date),
                        ...zapsReports.map(z => z.created_at?.split('T')[0])
                      ])).sort().map(date => ({
                        date,
                        revenue: revenueReports.find(r => r.date === date)?.total_revenue || 0,
                        zaps: zapsReports.filter(z => z.created_at?.split('T')[0] === date).reduce((a,b) => a + (parseFloat(b.amount) || 0), 0)
                      }))
                    }>
                      <defs>
                        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gradZap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <RechartsTooltip contentStyle={{backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)'}} />
                      <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} fill="url(#gradRev)" stackId="1" />
                      <Area type="monotone" dataKey="zaps" stroke="#f97316" strokeWidth={4} fill="url(#gradZap)" stackId="1" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Hotel Analytics - Pie & Bar Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none bg-white shadow-sm rounded-[40px] p-8 overflow-hidden">
                  <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-black text-slate-800">توزيع الإيرادات حسب الفندق</CardTitle></CardHeader>
                  <CardContent className="p-0 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hotelStats}
                          dataKey="total"
                          nameKey="hotel"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          label={({ hotel, percent }) => `${hotel} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {hotelStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={[
                              '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'
                            ][index % 7]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-sm rounded-[40px] p-8 overflow-hidden">
                  <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-black text-slate-800">عدد السيارات حسب الفندق</CardTitle></CardHeader>
                  <CardContent className="p-0 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hotelStats} layout="vertical" margin={{ left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="hotel" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="cars" fill="#0ea5e9" radius={[0, 10, 10, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Hotel Breakdown Table */}
              <Card className="border-none bg-white shadow-sm rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-black text-slate-900">تحليل الإيرادات حسب الفندق</CardTitle>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-4 py-2 rounded-xl">إحصائيات تفصيلية</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="text-right px-8 font-black text-slate-500">اسم الفندق</TableHead>
                        <TableHead className="text-center font-black text-slate-500">عدد السيارات</TableHead>
                        <TableHead className="text-center font-black text-slate-500">إيرادات المواقف</TableHead>
                        <TableHead className="text-center font-black text-slate-500">إيرادات الصف (Valet)</TableHead>
                        <TableHead className="text-left px-8 font-black text-slate-500">الإجمالي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotelStats.map((h, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-8 text-slate-900 font-black">{h.hotel}</TableCell>
                          <TableCell className="text-center text-slate-600 font-bold">{h.cars.toLocaleString()}</TableCell>
                          <TableCell className="text-center text-slate-600 font-bold">{h.parking.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-center text-indigo-600 font-black">{h.valet.toLocaleString()} ر.س</TableCell>
                          <TableCell className="px-8 text-left text-emerald-600 font-black text-lg">{h.total.toLocaleString()} ر.س</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Data Grid Split - Light Theme */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                <Card className="border-none bg-white shadow-sm rounded-[40px] overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-50"><CardTitle className="text-xl font-black text-slate-900">سجل الإيرادات اليومية</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50"><TableRow className="border-slate-50"><TableHead className="text-right px-8">التاريخ</TableHead><TableHead className="text-center">السيارات</TableHead><TableHead className="text-left px-8">الإيراد</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {revenueReports.map(r => (
                          <TableRow key={r.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="px-8 text-slate-700 font-bold">{r.date}</TableCell>
                            <TableCell className="text-center text-slate-400 font-black">{r.cars_handled}</TableCell>
                            <TableCell className="px-8 text-emerald-600 font-black">{r.total_revenue.toLocaleString()} ر.س</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-sm rounded-[40px] overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-50"><CardTitle className="text-xl font-black text-slate-900">عمليات ZAPS المباشرة</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50"><TableRow className="border-slate-50"><TableHead className="text-right px-8">رقم اللوحة</TableHead><TableHead className="text-center">المبلغ</TableHead><TableHead className="text-left px-8">التاريخ</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {zapsReports.map(z => (
                          <TableRow key={z.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="px-8 text-slate-700 font-black uppercase tracking-wider">{z.car_number}</TableCell>
                            <TableCell className="text-center text-orange-500 font-black">{z.amount} ر.س</TableCell>
                            <TableCell className="px-8 text-slate-400 text-xs font-bold">{new Date(z.created_at).toLocaleDateString('ar-SA')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!hasGenerated && !loading && (
            <div className="py-40 text-center space-y-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-50"><BarChart3 className="w-16 h-16 text-slate-200" /></div>
              <p className="text-slate-400 font-black text-2xl tracking-tighter">جاهز للتحليل الموحد</p>
            </div>
          )}
        </main>
        <DeveloperSignature />
      </div>
    </div>
  );
}
