"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DeveloperSignature } from "@/components/DeveloperSignature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Car, DollarSign, FileText, Search, Download, Pencil, Trash2, MoreVertical, Loader2, Eye, LayoutDashboard, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExcelJS from "exceljs";

export default function InputsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التقرير؟")) return;
    
    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReports(reports.filter((r: any) => r.id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleExportToExcel = async (report: any) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("تقرير اليوم");

    worksheet.columns = [
      { header: "التفاصيل", key: "key", width: 25 },
      { header: "القيمة", key: "value", width: 25 },
    ];

    worksheet.addRows([
      { key: "التاريخ", value: report.date },
      { key: "إجمالي السيارات", value: report.cars_handled },
      { key: "عدد المواقف", value: report.parking_count },
      { key: "الإيراد الكلي", value: `${report.total_revenue} ر.س` },
      { key: "الملاحظات", value: report.notes || "-" },
    ]);

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'0EA5E9' } };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Report_${report.date}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter((r: any) => 
    r.date.includes(searchTerm) || 
    r.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 container mx-auto py-8 px-4 md:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">سجل التقارير</h1>
              <p className="text-slate-500 mt-1">عرض وإدارة جميع التقارير التي تم حفظها في النظام</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="بحث بالتاريخ..." 
                  className="pr-10 rounded-xl w-64 bg-white border-slate-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl gap-2 bg-white" onClick={fetchReports}>
                تحديث
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                قائمة التقارير اليومية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center text-slate-400">جاري تحميل البيانات...</div>
              ) : filteredReports.length === 0 ? (
                <div className="p-12 text-center text-slate-400">لا توجد تقارير حالياً</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900">التاريخ</TableHead>
                        <TableHead className="font-bold text-slate-900 text-center">إجمالي السيارات</TableHead>
                        <TableHead className="font-bold text-slate-900 text-center">المواقف</TableHead>
                        <TableHead className="font-bold text-slate-900 text-center">الإيراد الكلي</TableHead>
                        <TableHead className="font-bold text-slate-900">ملاحظات</TableHead>
                        <TableHead className="font-bold text-slate-900 text-left">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report: any) => (
                        <TableRow key={report.id} className="hover:bg-slate-50/30 transition-colors">
                          <TableCell className="font-bold">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {report.date}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            <Badge variant="outline" className="rounded-lg bg-blue-50 text-blue-700 border-blue-100">
                              {report.cars_handled} سيارة
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-mono">{report.parking_count}</TableCell>
                          <TableCell className="text-center">
                            <div className="font-black text-emerald-600 flex items-center justify-center gap-1">
                              {report.total_revenue.toLocaleString()}
                              <span className="text-[10px] font-normal text-slate-400">ر.س</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-slate-500 italic">
                            {report.notes || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-primary transition-all">
                                  <Pencil className="w-5 h-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                                <DropdownMenuLabel className="font-bold text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">الإجراءات</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-50" />
                                <DropdownMenuItem 
                                  onClick={() => setSelectedReport(report)}
                                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-700 font-bold group"
                                >
                                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                  <span>عرض التقرير</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-50" />
                                <DropdownMenuItem 
                                  onClick={() => handleExportToExcel(report)}
                                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-700 font-bold group"
                                >
                                  <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                                  <span>تنزيل (Excel)</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-50" />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(report.id)}
                                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-bold group"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                                  <span>حذف التقرير</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
        
        {/* Report View Modal */}
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none p-0 bg-[#f8fafc]">
            {selectedReport && (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black text-slate-900">تفاصيل التقرير اليومي</DialogTitle>
                      <p className="text-slate-500 font-bold text-sm">تاريخ التقرير: {selectedReport.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedReport(null)} className="rounded-xl h-12 w-12 p-0">
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي السيارات</p>
                      <p className="text-2xl font-black text-slate-900">{selectedReport.cars_handled} سيارة</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">عدد المواقف</p>
                      <p className="text-2xl font-black text-slate-900">{selectedReport.parking_count} سيارة</p>
                    </div>
                    <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-100">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">الإيراد الكلي</p>
                      <p className="text-2xl font-black text-white">{selectedReport.total_revenue.toLocaleString()} ر.س</p>
                    </div>
                  </div>

                  {/* Detailed Table (if detailed_data exists) */}
                  {selectedReport.detailed_data ? (() => {
                    try {
                      const data = JSON.parse(selectedReport.detailed_data);
                      const hotels = Object.keys(data.revenueByHotel || {});
                      return (
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                          <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                              <LayoutDashboard className="w-5 h-5 text-primary" />
                              تفاصيل المواقع
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                  <TableHead className="py-4 px-6 text-right font-black">الموقع</TableHead>
                                  <TableHead className="text-center font-black">السيارات</TableHead>
                                  <TableHead className="text-center font-black">المواقف</TableHead>
                                  <TableHead className="text-center font-black">الفاليه</TableHead>
                                  <TableHead className="text-center font-black">المجموع</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {hotels.map((hotel: string) => {
                                  const rev = data.revenueByHotel[hotel];
                                  if (!rev.cars && !rev.total) return null;
                                  return (
                                    <TableRow key={hotel} className="border-slate-50">
                                      <TableCell className="py-4 px-6 font-bold text-slate-700">{hotel}</TableCell>
                                      <TableCell className="text-center font-black text-slate-400">{rev.cars}</TableCell>
                                      <TableCell className="text-center font-bold text-slate-600">{rev.parking.toLocaleString()} ر.س</TableCell>
                                      <TableCell className="text-center font-bold text-slate-600">{rev.valet.toLocaleString()} ر.س</TableCell>
                                      <TableCell className="text-center font-black text-primary">{(rev.total || 0).toLocaleString()} ر.س</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      );
                    } catch (e) {
                      return <p className="text-center text-slate-400 py-10 font-bold">لا توجد بيانات تفصيلية متوفرة لهذا التقرير القديم</p>;
                    }
                  })() : (
                    <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Activity className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold">هذا التقرير لا يحتوي على بيانات تفصيلية للمواقع (تم حفظه قبل تحديث النظام)</p>
                    </div>
                  )}

                  {selectedReport.notes && (
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">ملاحظات إضافية</p>
                      <p className="text-slate-700 italic font-medium">{selectedReport.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-center pb-8">
                     <Button onClick={() => setSelectedReport(null)} className="h-14 px-12 rounded-2xl bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-200">
                       إغلاق النافذة
                     </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <DeveloperSignature />
      </div>
    </div>
  );
}
