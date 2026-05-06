"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DeveloperSignature } from "@/components/DeveloperSignature";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Car, DollarSign, Zap, Search, Download, Trash2, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ZapsHistoryPage() {
  const [zaps, setZaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchZaps();
  }, []);

  const fetchZaps = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/zaps");
      const data = await res.json();
      if (data.success) {
        setZaps(data.zaps);
      }
    } catch (err) {
      console.error("Failed to fetch zaps", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه العملية؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    try {
      const res = await fetch(`/api/zaps?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setZaps(zaps.filter((z: any) => z.id !== id));
      } else {
        alert("فشل حذف العملية: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const filteredZaps = zaps.filter((z: any) => 
    z.car_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    z.created_at?.includes(searchTerm)
  );

  const totalRevenue = zaps.reduce((acc, z: any) => acc + (z.amount || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 container mx-auto py-8 px-4 md:px-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                سجل عمليات Zaps
              </h1>
              <p className="text-slate-500 font-bold mr-14">عرض وتحليل جميع العمليات السريعة التي تم تسجيلها</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase">إجمالي مبالغ ZAPS</p>
                  <p className="text-xl font-black text-orange-600">{totalRevenue.toLocaleString()} <span className="text-xs">ر.س</span></p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="بحث برقم اللوحة أو التاريخ..." 
                className="pr-12 h-12 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="h-12 rounded-2xl gap-2 flex-1 md:flex-none font-bold border-slate-200" onClick={fetchZaps}>
                <Loader2 className={cn("w-4 h-4", loading && "animate-spin")} />
                تحديث
              </Button>
              <Button className="h-12 rounded-2xl gap-2 flex-1 md:flex-none font-bold bg-slate-900 shadow-lg shadow-slate-200">
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>
            </div>
          </div>

          {/* History Card */}
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 px-8 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black text-slate-800">العمليات الأخيرة</CardTitle>
                <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-4 py-1 rounded-lg font-black uppercase text-[10px] tracking-widest">
                  {filteredZaps.length} عملية
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading && zaps.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-orange-500 opacity-20" />
                  <p className="text-slate-400 font-bold">جاري تحميل سجل العمليات...</p>
                </div>
              ) : filteredZaps.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold">لا توجد عمليات تطابق بحثك حالياً</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50 hover:bg-transparent">
                        <TableHead className="font-black text-slate-900 py-6 px-8 text-right">رقم اللوحة</TableHead>
                        <TableHead className="font-black text-slate-900 text-center">الفندق</TableHead>
                        <TableHead className="font-black text-slate-900 text-center">المبلغ</TableHead>
                        <TableHead className="font-black text-slate-900 text-center">التاريخ والوقت</TableHead>
                        <TableHead className="font-black text-slate-900 text-center">الحالة</TableHead>
                        <TableHead className="font-black text-slate-900 text-left px-8">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredZaps.map((zap: any, index) => (
                        <TableRow key={zap.id} className={cn("group transition-colors border-slate-50", index % 2 === 0 ? "bg-white" : "bg-slate-50/30", "hover:bg-orange-50/30")}>
                          <TableCell className="font-black py-5 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <Car className="w-5 h-5" />
                              </div>
                              <span className="text-lg tracking-wider uppercase">
                                {zap.car_number?.includes(":") ? zap.car_number.split(":").slice(1).join(":").trim() : zap.car_number}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-slate-500">
                            {zap.hotel_name || (zap.car_number?.includes(":") ? zap.car_number.split(":")[0].trim() : "غير محدد")}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-black text-xl text-slate-900 flex items-center justify-center gap-1">
                              {zap.amount?.toLocaleString()}
                              <span className="text-[10px] font-bold text-slate-400">ر.س</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-slate-700 text-sm">
                                {new Date(zap.created_at).toLocaleDateString('ar-SA')}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {new Date(zap.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 px-3 py-1 rounded-lg font-black text-[10px]">
                              مكتمل
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left px-8">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(zap.id)}
                              className="rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

        </main>
        <DeveloperSignature />
      </div>
    </div>
  );
}
