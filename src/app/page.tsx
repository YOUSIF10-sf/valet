"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, Users, Activity, Zap, 
  Car, ParkingCircle, DollarSign, BarChart3, 
  ArrowUpRight, ArrowDownRight, Sparkles, 
  Clock, ShieldCheck, Cpu, FilePlus2
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { DeveloperSignature } from "@/components/DeveloperSignature";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [stats, setStats] = useState<any>({
    totalReports: 0,
    totalRevenue: 0,
    totalCars: 0,
    totalParking: 0,
    totalZaps: 0,
    totalValet: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("is_logged_in");
    if (auth !== "true") {
      router.push("/auth/login");
    } else {
      setIsAuth(true);
      fetchStats();
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setChartData(data.chartData);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) return null;

  const performanceIndex = 92; // Mock performance index

  return (
    <div className="flex min-h-screen bg-[#f8fafc] selection:bg-primary/10 selection:text-primary" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 container mx-auto py-8 px-4 md:px-10 space-y-12">

          {/* Futuristic Intelligent Hero */}
          <section className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/10 to-indigo-500/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
            <div className="relative rounded-[40px] overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-10 md:p-14 transition-all duration-700 hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="space-y-6 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    تحليلات الذكاء التشغيلي نشطة
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                    مستقبل <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">إدارة الفالـيه</span>
                  </h1>
                  <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                    مرحباً بك في مركز القيادة المتطور. يقوم النظام حالياً بمعالجة بيانات الإيرادات والعمليات لتقديم رؤى استراتيجية دقيقة.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                    <Button asChild size="lg" className="rounded-2xl h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all active:scale-95 font-black">
                      <Link href="/report/create" className="flex items-center gap-3">
                        <FilePlus2 className="w-5 h-5" />
                        إنشاء تقرير جديد
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 border-2 border-slate-100 font-bold hover:bg-white transition-all">
                       عرض السجلات التاريخية
                    </Button>
                  </div>
                </div>

                {/* Performance Gauge Card */}
                <div className="w-full lg:w-auto">
                  <div className="relative p-8 rounded-[32px] bg-white border border-slate-100 shadow-2xl w-full md:w-80 space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-slate-400 uppercase">مؤشر الأداء</p>
                      <Cpu className="w-4 h-4 text-primary animate-spin-slow" />
                    </div>
                    <div className="relative flex items-center justify-center py-4">
                      <div className="text-6xl font-black text-slate-900">{performanceIndex}%</div>
                      <div className="absolute inset-0 rounded-full border-[10px] border-slate-50"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-[10px] border-primary border-t-transparent border-l-transparent -rotate-45"
                        style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-500"><ArrowUpRight className="w-3 h-3" /> مميز</span>
                      <span>معدل النمو اليومي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Futuristic Metric Command Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: "إجمالي الإيرادات", 
                value: stats.totalRevenue, 
                sub: "عائدات موحدة", 
                icon: DollarSign, 
                color: "from-blue-600 to-indigo-700",
                isCurrency: true 
              },
              { 
                label: "خدمة الصف (Valet)", 
                value: stats.totalValet, 
                sub: "أداء خدمة الصف", 
                icon: BarChart3, 
                color: "from-emerald-500 to-teal-600",
                isCurrency: true 
              },
              { 
                label: "إجمالي الزابس", 
                value: stats.totalZaps, 
                sub: "عمليات Zaps نشطة", 
                icon: Zap, 
                color: "from-orange-500 to-amber-600",
                isCurrency: false 
              },
              { 
                label: "السيارات المخدومة", 
                value: stats.totalCars, 
                sub: "حركة المركبات", 
                icon: Car, 
                color: "from-slate-800 to-slate-900",
                isCurrency: false 
              },
            ].map((metric, i) => (
              <div key={i} className="group relative">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500", metric.color)}></div>
                <div className="relative p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 -mr-8 -mt-8 rounded-full", metric.color)}></div>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", metric.color)}>
                        <metric.icon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                          <TrendingUp className="w-3 h-3" />
                          +12%
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900">
                        {metric.isCurrency && <span className="text-sm font-bold text-slate-400 mr-1">ر.س</span>}
                        {metric.value?.toLocaleString() || 0}
                      </div>
                      <p className="text-xs font-bold text-slate-400 mt-1">{metric.sub}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Deep Analytics Zone */}
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  مركز التحليل الاستراتيجي
                </h2>
                <p className="text-slate-500 font-medium">تتبع مباشر للأنماط التشغيلية والنمو المالي خلال الفترة الحالية</p>
              </div>
              <Button onClick={fetchStats} variant="outline" className="h-12 rounded-xl px-6 font-bold border-2 gap-2 hover:bg-white shadow-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                تحديث البيانات اللحظي
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Growth Chart */}
              <Card className="lg:col-span-2 border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] bg-white overflow-hidden p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-black text-slate-800">منحنى النمو التشغيلي</CardTitle>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><div className="w-3 h-3 rounded-full bg-primary" /> سيارات</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><div className="w-3 h-3 rounded-full bg-orange-500" /> زابس</div>
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="cars" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" name="النشاط التشغيلي" />
                      <Area type="monotone" dataKey="zaps" stroke="#f97316" strokeWidth={4} fill="none" strokeDasharray="5 5" name="عمليات الزابس" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Status Feed / Quick Insights */}
              <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] bg-white p-8 space-y-8">
                <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   حالة النظام
                </CardTitle>
                <div className="space-y-6">
                   {[
                     { label: "سلامة البيانات", status: "مكتمل", color: "bg-emerald-500" },
                     { label: "اتصال قاعدة البيانات", status: "نشط", color: "bg-emerald-500" },
                     { label: "تزامن التقارير", status: "محدث", color: "bg-blue-500" },
                     { label: "محرك التحليل", status: "يعمل", color: "bg-primary" },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:scale-[1.02]">
                       <span className="text-sm font-bold text-slate-600">{item.label}</span>
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase">{item.status}</span>
                         <div className={cn("w-2 h-2 rounded-full animate-pulse", item.color)} />
                       </div>
                     </div>
                   ))}
                </div>
                <div className="pt-4">
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-primary">
                    <p className="text-xs font-black uppercase mb-2">رؤية الذكاء الاصطناعي</p>
                    <p className="text-sm font-bold leading-relaxed text-primary/80">
                      يُلاحظ زيادة بنسبة 15% في عمليات خدمة الصف خلال الساعات الأخيرة. ينصح بتوزيع الكوادر بشكل أفضل.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Operational Radar Zone */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
            {[
              { label: "إجمالي السيارات", val: stats.totalCars, icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "إجمالي المواقف", val: stats.totalParking, icon: ParkingCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "إجمالي زابس", val: stats.totalZaps, icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "إجمالي الحركات", val: stats.totalCars + stats.totalZaps, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((zone, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", zone.bg, zone.color)}>
                  <zone.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{zone.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{zone.val?.toLocaleString() || 0}</h3>
                </div>
              </div>
            ))}
          </section>

        </main>
        <DeveloperSignature />
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
