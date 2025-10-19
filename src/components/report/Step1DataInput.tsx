import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const hotels = [
  "ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"
];

export function Step1DataInput() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">إدخال تفاصيل التقرير اليومي</h2>
      <p className="text-muted-foreground text-center mb-8">
        الرجاء تعبئة الحقول التالية لإنشاء التقرير.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <Input id="date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hotel">الفندق</Label>
          <Select dir="rtl">
            <SelectTrigger id="hotel">
              <SelectValue placeholder="اختر الفندق" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map(hotel => <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employee-name">اسم الموظف</Label>
          <Input id="employee-name" placeholder="مثال: محمد أحمد" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-count">عدد السيارات</Label>
          <Input id="car-count" type="number" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-type">نوع السيارة</Label>
          <Select dir="rtl">
            <SelectTrigger id="car-type">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitor">زائر</SelectItem>
              <SelectItem value="guest">نزيل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="parking-duration">مدة وقوف السيارة</Label>
          <Input id="parking-duration" placeholder="مثال: 3 ساعات" />
        </div>
        <div className="lg:col-span-3 space-y-2">
          <Label htmlFor="notes">الملاحظات</Label>
          <Textarea id="notes" placeholder="أضف أي ملاحظات هنا..." />
        </div>
        <div className="lg:col-span-3 space-y-2">
          <Label htmlFor="cashier-name">اسم الكاشير (في حال وجود عجز)</Label>
          <Input id="cashier-name" placeholder="اكتب اسم الكاشير فقط عند وجود عجز" />
        </div>
      </div>
    </div>
  );
}
