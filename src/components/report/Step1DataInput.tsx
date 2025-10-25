"use client";

import { useFormContext, Controller } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormMessage } from "@/components/ui/form";

export const hotels = [
  "ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"
];

export const reportSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  projectName: z.string().min(1, "اسم المشروع مطلوب"),
  reportType: z.string().min(1, "الرجاء اختيار نوع التقرير"),
  shift: z.string().optional(), // Shift is optional initially
  attendanceCount: z.coerce.number().min(0, "العدد يجب أن يكون صفراً أو أكثر"),
  absenceCount: z.coerce.number().min(0, "العدد يجب أن يكون صفراً أو أكثر"),
  supervisorName: z.string().min(1, "اسم المشرف مطلوب"),
  notes: z.string().optional(),
}).refine(data => {
  // If reportType is daily, shift must be selected
  if (data.reportType === 'daily') {
    return !!data.shift;
  }
  return true;
}, {
  message: "الرجاء اختيار الوردية للتقرير اليومي",
  path: ["shift"],
});


export type ReportData = z.infer<typeof reportSchema>;

export function Step1DataInput() {
  const { control, watch, formState: { errors } } = useFormContext<ReportData>();
  const reportType = watch("reportType");

  return (
    <form className="w-full max-w-4xl mx-auto" onSubmit={e => e.preventDefault()}>
      <h2 className="text-2xl font-bold text-center mb-2">إدخال تفاصيل التقرير</h2>
      <p className="text-muted-foreground text-center mb-8">
        الرجاء تعبئة الحقول التالية لإنشاء التقرير.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormItem>
          <Label htmlFor="date">التاريخ</Label>
          <Controller name="date" control={control} render={({ field }) => <Input id="date" type="date" {...field} />} />
          {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
        </FormItem>
        <FormItem>
          <Label htmlFor="projectName">اسم المشروع</Label>
          <Controller name="projectName" control={control} render={({ field }) => <Input id="projectName" placeholder="مثال: مشروع تطوير واجهة الرياض" {...field} />} />
          {errors.projectName && <FormMessage>{errors.projectName.message}</FormMessage>}
        </FormItem>
        <FormItem>
          <Label htmlFor="reportType">نوع التقرير</Label>
          <Controller
            name="reportType"
            control={control}
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
           {errors.reportType && <FormMessage>{errors.reportType.message}</FormMessage>}
        </FormItem>

        {/* Conditional Shift Field */}
        {reportType === 'daily' && (
          <FormItem>
            <Label htmlFor="shift">الوردية</Label>
            <Controller
              name="shift"
              control={control}
              render={({ field }) => (
                <Select dir="rtl" onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="اختر الوردية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">صباحية</SelectItem>
                    <SelectItem value="evening">مسائية</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.shift && <FormMessage>{errors.shift.message}</FormMessage>}
          </FormItem>
        )}

        <FormItem>
          <Label htmlFor="attendance-count">عدد الحضور</Label>
          <Controller name="attendanceCount" control={control} render={({ field }) => <Input id="attendance-count" type="number" placeholder="0" {...field} />} />
          {errors.attendanceCount && <FormMessage>{errors.attendanceCount.message}</FormMessage>}
        </FormItem>
        <FormItem>
          <Label htmlFor="absence-count">عدد الغيابات</Label>
          <Controller name="absenceCount" control={control} render={({ field }) => <Input id="absence-count" type="number" placeholder="0" {...field} />} />
          {errors.absenceCount && <FormMessage>{errors.absenceCount.message}</FormMessage>}
        </FormItem>
        <FormItem>
          <Label htmlFor="supervisor-name">اسم المشرف</Label>
          <Controller name="supervisorName" control={control} render={({ field }) => <Input id="supervisor-name" placeholder="مثال: عبدالله سالم" {...field} />} />
          {errors.supervisorName && <FormMessage>{errors.supervisorName.message}</FormMessage>}
        </FormItem>
        <FormItem className="lg:col-span-3">
           <Label htmlFor="notes">الملاحظات</Label>
          <Controller name="notes" control={control} render={({ field }) => <Textarea id="notes" placeholder="أضف أي ملاحظات هنا..." {...field} />} />
        </FormItem>
      </div>
    </form>
  );
}
