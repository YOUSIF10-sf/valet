"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Printer, 
  FileSpreadsheet, 
  Activity, 
  DollarSign, 
  Car, 
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { Step3MappingPreview } from "./Step3MappingPreview";
import { exportToExcel } from "@/lib/exportToExcel";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import ExcelJS from "exceljs";

const hotels = [
  "ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"
];

const months = [
  { value: "1", label: "يناير" }, { value: "2", label: "فبراير" }, { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" }, { value: "5", label: "مايو" }, { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" }, { value: "8", label: "أغسطس" }, { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" }, { value: "11", label: "نوفمبر" }, { value: "12", label: "ديسمبر" }
];

// Define Rates for all hotels
const rates: Record<string, { guestParking: number, guestValet: number, visitorParking: number, visitorValet: number }> = {
  "ماريوت": { guestParking: 185, guestValet: 20, visitorParking: 28, visitorValet: 50 },
  "هيلتون مؤتمرات": { guestParking: 185, guestValet: 50, visitorParking: 28, visitorValet: 50 },
  "دبل تري": { guestParking: 185, guestValet: 50, visitorParking: 28, visitorValet: 50 },
  "هيلتون أجنحة": { guestParking: 210, guestValet: 50, visitorParking: 35, visitorValet: 50 },
  "حياة ريجنسي": { guestParking: 210, guestValet: 50, visitorParking: 35, visitorValet: 50 },
  "كونراد": { guestParking: 210, guestValet: 50, visitorParking: 35, visitorValet: 50 },
  "جميرا": { guestParking: 210, guestValet: 0, visitorParking: 35, visitorValet: 50 },
};

const initialRevenueData: RevenueData = {
  revenueByHotel: {},
  exemptedCars: 0,
  exemptionReason: "",
  mistakeCars: 0,
  totalCash: 0,
  totalNetwork: 0,
  differenceReason: "",
};

export function UnifiedReportForm() {
  const [revenueData, setRevenueData] = useState<RevenueData>(initialRevenueData);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reportId] = useState(`VAL-${Date.now()}`);

  const methods = useForm<ReportData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      projectName: "صف السيارات - جبل عمر",
      reportType: "daily",
      attendanceCount: 0,
      absenceCount: 0,
      supervisorName: "",
      notes: "",
    },
  });

  const reportData = methods.watch();
  const reportType = methods.watch("reportType");

  // Handle revenue changes with simple manual logic
  const handleRevenueChange = (hotel: string, field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const hotelData = revenueData.revenueByHotel[hotel] || { 
      cars: 0, parking: 0, valet: 0, total: 0, cashierName: '', notes: '' 
    };
    
    let newData = { ...hotelData, [field]: (field === 'cashierName' || field === 'notes') ? value : numericValue };

    // Auto-calculate total from parking and valet
    if (field === 'parking' || field === 'valet') {
      newData.total = (field === 'parking' ? numericValue : hotelData.parking) + 
                      (field === 'valet' ? numericValue : hotelData.valet);
    } else if (field === 'total') {
      newData.total = numericValue;
    }

    setRevenueData({
      ...revenueData,
      revenueByHotel: {
        ...revenueData.revenueByHotel,
        [hotel]: newData
      }
    });
  };

  const handleCashierChange = (hotel: string, value: string) => {
    const hotelData = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0, total: 0, cashierName: '' };
    setRevenueData({
      ...revenueData,
      revenueByHotel: {
        ...revenueData.revenueByHotel,
        [hotel]: { ...hotelData, cashierName: value }
      }
    });
  };

  const tableTotal = Object.values(revenueData.revenueByHotel).reduce((acc, { total }) => acc + (total || 0), 0);
  const cashNetworkTotal = (revenueData.totalCash || 0) + (revenueData.totalNetwork || 0);
  const difference = tableTotal - cashNetworkTotal;
  const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // إعطاء مهلة بسيطة للمتصفح للتأكد من ظهور المعاينة بالكامل
      await new Promise(resolve => setTimeout(resolve, 800));

      const reportElement = document.getElementById('report-preview');
      if (!reportElement) {
        throw new Error("لم يتم العثور على شاشة المعاينة. يرجى المحاولة مرة أخرى.");
      }

      // 1. Save to Local Database (Turso)
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportData, revenueData, reportId }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        const errorText = await res.text();
        console.error("Server Error:", errorText);
        throw new Error(`خطأ في الخادم (${res.status}): يرجى التأكد من تشغيل السيرفر وقاعدة البيانات.`);
      }

      const data = await res.json();

      if (data.success) {
        const cloned = reportElement.cloneNode(true) as HTMLElement;
        const buttons = cloned.querySelector('.print\\:hidden');
        if (buttons) buttons.remove();
        
        const htmlContent = cloned.innerHTML;

        // 3. Send to Master Engine API
        const emailRes = await fetch("/api/reports/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            reportData, 
            revenueData, 
            reportId, 
            htmlContent 
          }),
        });
        
        const emailContentType = emailRes.headers.get("content-type");
        if (!emailRes.ok || !emailContentType || !emailContentType.includes("application/json")) {
           const emailErrorText = await emailRes.text();
           console.error("Email API Error:", emailErrorText);
           throw new Error("فشل إرسال الإيميل (خطأ في الخادم). تم حفظ البيانات في القاعدة بنجاح.");
        }

        const emailData = await emailRes.json();

        if (emailData.success) {
          alert("تم بنجاح! التقرير الفاخر (PDF حقيقي + Excel بالشعار) في طريقه لبريدك الآن ✅");
        } else {
          alert("تم حفظ التقرير، ولكن فشل الإرسال: " + emailData.message);
        }

        setShowPreview(false);
        setIsReviewing(false);
        methods.reset();
        setRevenueData(initialRevenueData);
      } else {
        alert("خطأ في الحفظ: " + data.message);
      }
    } catch (err: any) {
      console.error("Save process error:", err);
      alert(err.message || "حدث خطأ غير متوقع أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  // STEP 2: Review Dashboard
  if (isReviewing && !showPreview) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-right">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              مراجعة التقرير اليومي
            </h1>
            <p className="text-slate-500 font-bold mr-14">تأكد من صحة البيانات قبل الاعتماد النهائي والإرسال</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" size="lg" className="rounded-2xl px-8 h-14 font-bold border-2" onClick={() => setIsReviewing(false)}>
               تعديل البيانات
             </Button>
             <Button size="lg" className="rounded-2xl px-12 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 font-black text-lg gap-2" onClick={() => setShowPreview(true)}>
               الاعتماد والإرسال
               <Save className="w-5 h-5" />
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">إجمالي السيارات</p>
              <p className="text-3xl font-black text-slate-900">{totalCars.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-white p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">إجمالي الإيرادات</p>
              <p className="text-3xl font-black text-emerald-700">{tableTotal.toLocaleString()} <span className="text-sm">ر.س</span></p>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-white p-8 flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${difference === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">فارق التسوية</p>
              <p className={`text-3xl font-black ${difference === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{difference.toLocaleString()} <span className="text-sm">ر.س</span></p>
            </div>
          </Card>
        </div>

        {/* Detailed Table View */}
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-800">تفاصيل إيرادات المواقع</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="py-6 px-8 text-right font-black text-slate-900">الموقع</TableHead>
                    <TableHead className="text-center font-black text-slate-900">عدد السيارات</TableHead>
                    <TableHead className="text-center font-black text-slate-900">إجمالي المواقف</TableHead>
                    <TableHead className="text-center font-black text-slate-900">إجمالي الفاليه</TableHead>
                    <TableHead className="text-center font-black text-slate-900">المجموع الكلي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel) => {
                    const rev = revenueData.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0, total: 0 };
                    if (!rev.cars && !rev.total) return null;
                    return (
                      <TableRow key={hotel} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                        <TableCell className="py-6 px-8 font-bold text-slate-700">{hotel}</TableCell>
                        <TableCell className="text-center">
                           <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-black px-4">{rev.cars} سيارة</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-600">{rev.parking.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-center font-bold text-slate-600">{rev.valet.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-center font-black text-slate-900 text-lg">{(rev.total || 0).toLocaleString()} ر.س</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 3: Final Preview (PDF Style)
  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center print:hidden bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => setShowPreview(false)} className="rounded-xl">تعديل البيانات</Button>
             <Button 
               onClick={handleSave} 
               disabled={isSaving}
               className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2 min-w-[160px]"
             >
               {isSaving ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   جاري الحفظ والإرسال...
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4" />
                   حفظ في قاعدة البيانات
                 </>
               )}
             </Button>
           </div>
           <h2 className="text-xl font-bold">معاينة التقرير النهائي</h2>
        </div>
        <Step3MappingPreview reportData={reportData} revenueData={revenueData} reportId={reportId} />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Section 1: Basic Info */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              المعلومات الأساسية للتقرير
            </CardTitle>
            <CardDescription>أدخل تفاصيل المشروع والوردية</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormItem>
                <Label className="text-slate-700 font-bold mb-2 block">التاريخ</Label>
                <Controller name="date" control={methods.control} render={({ field }) => <Input type="date" className="rounded-xl h-12" {...field} />} />
                {methods.formState.errors.date && <FormMessage>{methods.formState.errors.date.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <Label className="text-slate-700 font-bold mb-2 block">اسم المشروع</Label>
                <Controller name="projectName" control={methods.control} render={({ field }) => (
                  <Input 
                    {...field} 
                    disabled 
                    className="rounded-xl h-12 bg-slate-100 border-slate-200 font-bold text-slate-600 cursor-not-allowed" 
                  />
                )} />
              </FormItem>

              <FormItem>
                <Label className="text-slate-700 font-bold mb-2 block">نوع التقرير</Label>
                <Controller name="reportType" control={methods.control} render={({ field }) => (
                  <Select dir="rtl" onValueChange={field.onChange} value={field.value} disabled>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-100 cursor-not-allowed">
                      <SelectValue placeholder="يومي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومي</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </FormItem>


            </div>
          </CardContent>
        </Card>

        {/* Section 2: Revenue Table */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100">
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              جدول الإيرادات التفصيلي
            </CardTitle>
            <CardDescription>أدخل إيرادات كل موقع على حدة</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900 w-[140px] text-sm py-3 px-2">
                          <div>الموقع</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Location</div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-center text-sm py-3 px-1">
                          <div>اسم الكاشير</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Cashier Name</div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-center text-sm py-3 px-1">
                          <div>عدد السيارات</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Cars</div>
                        </TableHead>
                        <TableHead className="font-bold text-primary text-center text-sm py-3 px-1 bg-primary/5">
                          <div>إجمالي المواقف</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Total Parking</div>
                        </TableHead>
                        <TableHead className="font-bold text-emerald-600 text-center text-sm py-3 px-1 bg-emerald-50/50">
                          <div>إجمالي الفاليه</div>
                          <div className="text-[10px] text-emerald-400 font-normal uppercase">Total Valet</div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-center text-sm py-3 px-1">
                          <div>المجموع</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Grand Total</div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-right text-sm py-3 px-2">
                          <div>ملاحظات</div>
                          <div className="text-[10px] text-slate-400 font-normal uppercase">Notes</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotels.map(hotel => {
                        const rev = revenueData.revenueByHotel[hotel] || { 
                          cars: 0, parking: 0, valet: 0, total: 0, cashierName: '', notes: ''
                        };
                        
                        return (
                          <TableRow key={hotel} className="hover:bg-slate-50/30 transition-colors">
                            <TableCell className="font-bold text-slate-700 text-sm py-3 px-2">{hotel}</TableCell>
                            <TableCell className="py-3 px-1">
                              <Input 
                                type="text" 
                                value={rev.cashierName || ''} 
                                onChange={e => handleCashierChange(hotel, e.target.value)}
                                placeholder="اسم الموظف"
                                className="w-full text-center border-slate-200 rounded-lg h-9 text-xs px-1 text-slate-700"
                              />
                            </TableCell>
                            <TableCell className="py-3 px-1 text-center">
                              <Input 
                                type="number" 
                                value={rev.cars || ''} 
                                onChange={e => handleRevenueChange(hotel, 'cars', e.target.value)}
                                className="w-16 mx-auto text-center border-slate-200 rounded-lg h-9 text-sm px-1 text-slate-900 font-medium"
                              />
                            </TableCell>
                            <TableCell className="py-3 px-1 bg-primary/5 text-center">
                              <Input 
                                type="number" 
                                value={rev.parking || ''} 
                                onChange={e => handleRevenueChange(hotel, 'parking', e.target.value)}
                                className="w-24 mx-auto text-center border-primary/30 bg-white rounded-lg h-9 text-sm font-bold px-1 text-primary shadow-sm"
                              />
                            </TableCell>
                            <TableCell className="py-3 px-1 bg-emerald-50/30 text-center">
                              <Input 
                                type="number" 
                                value={rev.valet || ''} 
                                onChange={e => handleRevenueChange(hotel, 'valet', e.target.value)}
                                className="w-24 mx-auto text-center border-emerald-300 bg-white rounded-lg h-9 text-sm font-bold px-1 text-emerald-700 shadow-sm"
                              />
                            </TableCell>
                            <TableCell className="py-3 px-1 text-center">
                              <div className="w-24 mx-auto h-9 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-sm font-black text-slate-900">
                                {(rev.total || 0).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-2">
                              <Input 
                                type="text" 
                                value={rev.notes || ''} 
                                onChange={e => handleRevenueChange(hotel, 'notes', e.target.value)}
                                placeholder="ملاحظة (اختياري)..."
                                className="w-full border-slate-200 rounded-lg h-9 text-xs px-2 text-slate-600 italic"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  <TableRow className="bg-slate-100/50 font-black">
                    <TableCell className="text-sm py-4 px-2">الإجمالي</TableCell>
                    <TableCell className="text-center text-slate-900">{Object.values(revenueData.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0)}</TableCell>
                    <TableCell className="text-center text-primary text-base py-4 px-2 bg-primary/10 border-x border-primary/20">{tableTotal.toFixed(2)}</TableCell>
                    <TableCell className="text-center text-slate-900">{Object.values(revenueData.revenueByHotel).reduce((acc, { guests }) => acc + (guests || 0), 0)}</TableCell>
                    <TableCell className="text-center text-slate-900">{Object.values(revenueData.revenueByHotel).reduce((acc, { visitors }) => acc + (visitors || 0), 0)}</TableCell>
                    <TableCell className="text-center text-slate-500">{Object.values(revenueData.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0).toFixed(2)}</TableCell>
                    <TableCell className="text-center text-slate-500">{Object.values(revenueData.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0).toFixed(2)}</TableCell>
                    <TableCell className="text-left text-rose-600 text-base py-4 px-2"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Financial Summary & Exceptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
            <CardHeader><CardTitle className="text-lg">ملخص وسائل الدفع</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">إجمالي الكاش</Label>
                    <Input type="number" value={revenueData.totalCash || ''} onChange={e => setRevenueData({...revenueData, totalCash: parseFloat(e.target.value) || 0})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">إجمالي الشبكة</Label>
                    <Input type="number" value={revenueData.totalNetwork || ''} onChange={e => setRevenueData({...revenueData, totalNetwork: parseFloat(e.target.value) || 0})} className="h-12 rounded-xl" />
                  </div>
               </div>
               <div className={`p-4 rounded-2xl flex justify-between items-center ${difference === 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <span className="font-bold text-lg">الفرق:</span>
                  <span className="font-mono text-2xl font-black">{difference.toFixed(2)} ر.س</span>
               </div>
               {difference !== 0 && (
                 <div className="space-y-2">
                   <Label className="font-bold">توضيح سبب الفرق</Label>
                   <Textarea value={revenueData.differenceReason} onChange={e => setRevenueData({...revenueData, differenceReason: e.target.value})} className="rounded-xl" />
                 </div>
               )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
            <CardHeader><CardTitle className="text-lg">استثناءات وملاحظات</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Car className="w-4 h-4 text-amber-500" />
                      سيارات معفاة
                    </Label>
                    <Input type="number" value={revenueData.exemptedCars || ''} onChange={e => setRevenueData({...revenueData, exemptedCars: parseInt(e.target.value) || 0})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-500" />
                      سيارات مطلوبة بالخطأ
                    </Label>
                    <Input type="number" value={revenueData.mistakeCars || ''} onChange={e => setRevenueData({...revenueData, mistakeCars: parseInt(e.target.value) || 0})} className="h-12 rounded-xl" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="font-bold">سبب الإعفاء</Label>
                  <Input value={revenueData.exemptionReason} onChange={e => setRevenueData({...revenueData, exemptionReason: e.target.value})} placeholder="مثال: ضيوف الإدارة، سيارات دبلوماسية..." className="h-12 rounded-xl" />
               </div>
               <div className="space-y-2">
                  <Label className="font-bold">ملاحظات إضافية</Label>
                  <Controller name="notes" control={methods.control} render={({ field }) => <Textarea {...field} placeholder="أضف أي ملاحظات هنا..." className="rounded-xl min-h-[100px]" />} />
               </div>
            </CardContent>
          </Card>
        </div>


        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 flex justify-center gap-4">
           <Button variant="outline" size="lg" className="rounded-2xl px-8" onClick={() => methods.reset()}>إعادة تعيين</Button>
           <Button size="lg" className="rounded-2xl px-12 bg-primary shadow-lg shadow-primary/20" onClick={async () => {
             const isValid = await methods.trigger();
            if (isValid) {
               setIsReviewing(true);
               window.scrollTo({ top: 0, behavior: 'smooth' });
             } else {
               alert("يرجى التأكد من إكمال جميع البيانات الأساسية (التاريخ، المشروع، والمبالغ المستلمة)");
               console.log("Validation Errors:", methods.formState.errors);
             }
           }}>
             <Save className="ml-2 h-5 w-5" />
             معاينة التقرير
           </Button>
        </div>

      </div>
    </FormProvider>
  );
}
