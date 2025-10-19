"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const hotels = [
  "ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"
];

const reportSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  hotel: z.string().min(1, "الفندق مطلوب"),
  reportType: z.string(),
  attendanceCount: z.coerce.number(),
  absenceCount: z.coerce.number(),
  supervisorName: z.string().min(1, "اسم المشرف مطلوب"),
  notes: z.string().optional(),
});


type ReportFormValues = z.infer<typeof reportSchema>;

export function Step1DataInput() {
  const methods = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      hotel: "",
      reportType: "daily",
      attendanceCount: 0,
      absenceCount: 0,
      supervisorName: "",
      notes: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">إدخال تفاصيل التقرير اليومي</h2>
        <p className="text-muted-foreground text-center mb-8">
          الرجاء تعبئة الحقول التالية لإنشاء التقرير.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">التاريخ</Label>
            <Controller name="date" control={methods.control} render={({ field }) => <Input id="date" type="date" {...field} />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel">الفندق</Label>
            <Controller
              name="hotel"
              control={methods.control}
              render={({ field }) => (
                <Select dir="rtl" onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hotel">
                    <SelectValue placeholder="اختر الفندق" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(hotel => <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportType">نوع التقرير</Label>
            <Controller
              name="reportType"
              control={methods.control}
              render={({ field }) => (
                <Select dir="rtl" onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="اختر نوع التقرير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendance-count">عدد الحضور</Label>
            <Controller name="attendanceCount" control={methods.control} render={({ field }) => <Input id="attendance-count" type="number" placeholder="0" {...field} />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="absence-count">عدد الغيابات</Label>
            <Controller name="absenceCount" control={methods.control} render={({ field }) => <Input id="absence-count" type="number" placeholder="0" {...field} />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supervisor-name">اسم المشرف</Label>
            <Controller name="supervisorName" control={methods.control} render={({ field }) => <Input id="supervisor-name" placeholder="مثال: عبدالله سالم" {...field} />} />
          </div>
          <div className="lg:col-span-3 space-y-2">
             <div className="flex justify-between items-center">
                <Label htmlFor="notes">الملاحظات</Label>
            </div>
            <Controller name="notes" control={methods.control} render={({ field }) => <Textarea id="notes" placeholder="أضف أي ملاحظات هنا..." {...field} />} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
