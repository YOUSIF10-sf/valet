"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, DollarSign, Zap, Activity, BarChart3, Car } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { DeveloperSignature } from "@/components/DeveloperSignature";

export default function SharedReportPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() for Next.js 15 compatibility
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [reportInfo, setReportInfo] = useState<any>(null);
  const [revenueReports, setRevenueReports] = useState<any[]>([]);
  const [zapsReports, setZapsReports] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchSharedData();
  }, [id]);

  const fetchSharedData = async () => {
    try {
      const res = await fetch(`/api/share/${id}`);
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setReportInfo(data.report);
      const { from, to } = data.report.config;

      // Fetch actual data based on shared config
      const [revRes, zapsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/zaps")
      ]);
      
      const revData = await revRes.json();
      const zapsData = await zapsRes.json();
      
      if (revData.success && zapsData.success) {
        const filteredRev = revData.reports.filter((r: any) => r.date >= from && r.date <= to);
        const filteredZaps = zapsData.zaps.filter((z: any) => {
          const zDate = z.created_at?.split('T')[0];
          return zDate >= from && zDate <= to;
        });

        setRevenueReports(filteredRev);
        setZapsReports(filteredZaps);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات");
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
      try { detailedData = typeof report.detailed_data === 'string' ? JSON.parse(report.detailed_data) : report.detailed_data; } catch (e) { return; }
      if (detailedData && detailedData.revenueByHotel) {
        Object.entries(detailedData.revenueByHotel).forEach(([hotelName, data]: [string, any]) => {
          if (!stats[hotelName]) stats[hotelName] = { hotel: hotelName, cars: 0, parking: 0, valet: 0, total: 0 };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-slate-500 font-bold">جاري تحميل التقرير التفاعلي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full border-none shadow-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Activity className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">عذراً، التقرير غير متوفر</h2>
          <p className="text-slate-500">قد يكون الرابط منتهياً أو غير صحيح.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10" dir="rtl">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-10">
        
        {/* Public Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="space-y-2 text-center md:text-right">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <Badge className="bg-primary/10 text-primary border-none font-black">تقرير مشترك تفاعلي</Badge>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{reportInfo.title}</h1>
            <p className="text-slate-400 font-bold">الفترة: {reportInfo.config.from} إلى {reportInfo.config.to}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تاريخ الإنشاء</p>
            <p className="text-slate-900 font-black">{new Date(reportInfo.created_at).toLocaleDateString('ar-SA')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "إجمالي الإيرادات", value: totals.combinedRevenue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", isCurrency: true },
            { label: "إيرادات الفاليه", value: totals.valetTotal, icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50", isCurrency: true },
            { label: "إيراد ZAPS", value: totals.zapsRev, icon: Zap, color: "text-orange-600", bg: "bg-orange-50", isCurrency: true },
            { label: "السيارات المخدومة", value: totals.carsTotal, icon: Users, color: "text-blue-600", bg: "bg-blue-50", isCurrency: false },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] p-6 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className={`text-2xl font-black text-slate-900`}>
                    {stat.value.toLocaleString()}
                    {stat.isCurrency && <span className="text-xs font-bold text-slate-300 mr-1">ر.س</span>}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Chart */}
        <Card className="border-none shadow-sm rounded-[40px] p-8">
          <CardHeader className="p-0 mb-10"><CardTitle className="text-xl font-black text-slate-800">النمو المالي والتشغيلي</CardTitle></CardHeader>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={
                Array.from(new Set([...revenueReports.map(r => r.date), ...zapsReports.map(z => z.created_at?.split('T')[0])])).sort().map(date => ({
                  date,
                  revenue: revenueReports.find(r => r.date === date)?.total_revenue || 0,
                  zaps: zapsReports.filter(z => z.created_at?.split('T')[0] === date).reduce((a,b) => a + (parseFloat(b.amount) || 0), 0)
                }))
              }>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <RechartsTooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} fill="url(#pGrad)" />
                <Area type="monotone" dataKey="zaps" stroke="#f97316" strokeWidth={4} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hotel Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm rounded-[40px] p-8 overflow-hidden">
            <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-black text-slate-800">توزيع الإيرادات</CardTitle></CardHeader>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={hotelStats} dataKey="total" nameKey="hotel" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                    {hotelStats.map((entry, index) => (
                      <Cell key={index} fill={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[40px] p-8 overflow-hidden">
            <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-black text-slate-800">السيارات حسب الفندق</CardTitle></CardHeader>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hotelStats} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="hotel" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Bar dataKey="cars" fill="#0ea5e9" radius={[0, 10, 10, 0]} />
                  <RechartsTooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50"><CardTitle className="text-xl font-black text-slate-900">تحليل المواقع التفصيلي</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="text-right px-8 font-black">الموقع</TableHead>
                  <TableHead className="text-center font-black">السيارات</TableHead>
                  <TableHead className="text-center font-black">المواقف</TableHead>
                  <TableHead className="text-center font-black">الفاليه</TableHead>
                  <TableHead className="text-left px-8 font-black">المجموع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelStats.map((h, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 border-slate-50">
                    <TableCell className="px-8 font-black text-slate-800">{h.hotel}</TableCell>
                    <TableCell className="text-center font-bold text-slate-500">{h.cars.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-bold text-slate-500">{h.parking.toLocaleString()} ر.س</TableCell>
                    <TableCell className="text-center font-black text-indigo-600">{h.valet.toLocaleString()} ر.س</TableCell>
                    <TableCell className="px-8 text-left font-black text-emerald-600">{h.total.toLocaleString()} ر.س</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Zaps Table */}
        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900">سجل عمليات ZAPS المباشرة</CardTitle>
              <Badge className="bg-orange-50 text-orange-600 border-none font-black">{zapsReports.length} عملية</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="text-right px-8 font-black">رقم اللوحة</TableHead>
                  <TableHead className="text-center font-black">الفندق</TableHead>
                  <TableHead className="text-center font-black">المبلغ</TableHead>
                  <TableHead className="text-left px-8 font-black">التاريخ والوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zapsReports.map((z, i) => (
                  <TableRow key={i} className="hover:bg-orange-50/30 border-slate-50 group">
                    <TableCell className="px-8 font-black text-slate-700 uppercase">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                        {z.car_number?.includes(":") ? z.car_number.split(":").slice(1).join(":").trim() : z.car_number}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-500">
                      {z.hotel_name || (z.car_number?.includes(":") ? z.car_number.split(":")[0].trim() : "غير محدد")}
                    </TableCell>
                    <TableCell className="text-center font-black text-orange-600">{z.amount.toLocaleString()} ر.س</TableCell>
                    <TableCell className="px-8 text-left text-xs font-bold text-slate-400">
                      {new Date(z.created_at).toLocaleString('ar-SA')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="py-10 text-center">
          <p className="text-slate-400 font-bold mb-4">تم توليد هذا التقرير التفاعلي بواسطة نظام Easy Valet</p>
          <DeveloperSignature />
        </div>
      </div>
    </div>
  );
}
