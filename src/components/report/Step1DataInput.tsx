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
  hotel: z.string().min(1, "الفندق مطلوب"),
  reportType: z.string(),
  attendanceCount: z.coerce.number().min(0, "العدد يجب أن يكون صفراً أو أكثر"),
  absenceCount: z.coerce.number().min(0, "العدد يجب أن يكون صفراً أو أكثر"),
  supervisorName: z.string().min(1, "اسم المشرف مطلوب"),
  notes: z.string().optional(),
});


export type ReportData = z.infer<typeof reportSchema>;

export function Step1DataInput() {
  const { control, formState: { errors } } = useFormContext<ReportData>();

  return (
    <form className="w-full max-w-4xl mx-auto" onSubmit={e => e.preventDefault()}>
      <h2 className="text-2xl font-bold text-center mb-2">إدخال تفاصيل التقرير اليومي</h2>
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
          <Label htmlFor="hotel">الفندق</Label>
          <Controller
            name="hotel"
            control={control}
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
          {errors.hotel && <FormMessage>{errors.hotel.message}</FormMessage>}
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
        </FormItem>
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
