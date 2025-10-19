import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Label htmlFor="shift">الفترة</Label>
          <Select dir="rtl">
            <SelectTrigger id="shift">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">صباحية</SelectItem>
              <SelectItem value="evening">مسائية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="attendance-count">عدد الحضور</Label>
          <Input id="attendance-count" type="number" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="absence-count">عدد الغيابات</Label>
          <Input id="absence-count" type="number" placeholder="0" />
        </div>
         <div className="space-y-2">
          <Label htmlFor="supervisor-name">اسم المشرف</Label>
          <Input id="supervisor-name" placeholder="مثال: عبدالله سالم" />
        </div>
        <div className="lg:col-span-3 space-y-2">
          <Label htmlFor="notes">الملاحظات</Label>
          <Textarea id="notes" placeholder="أضف أي ملاحظات هنا..." />
        </div>
      </div>
    </div>
  );
}
