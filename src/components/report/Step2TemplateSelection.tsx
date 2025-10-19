'use client';
import { hotels } from './Step1DataInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HotelRevenue = {
  cars: number;
  parking: number;
  valet: number;
};

export type RevenueData = {
    revenueByHotel: Record<string, HotelRevenue>;
    exemptedCars: number;
    exemptionReason: string;
    mistakeCars: number;
    totalCash: number;
    totalNetwork: number;
    differenceReason: string;
};

interface Step2Props {
  data: RevenueData;
  onDataChange: (data: RevenueData) => void;
}

export function Step2TemplateSelection({ data, onDataChange }: Step2Props) {

    const handleRevenueChange = (hotel: string, field: keyof HotelRevenue, value: string) => {
        const numericValue = parseInt(value, 10) || 0;
        const hotelData = data.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0 };
        onDataChange({
            ...data,
            revenueByHotel: {
                ...data.revenueByHotel,
                [hotel]: { ...hotelData, [field]: numericValue }
            }
        });
    };
    
    const handleFieldChange = (field: keyof RevenueData, value: string | number) => {
        onDataChange({ ...data, [field]: value });
    };

    const tableTotal = Object.values(data.revenueByHotel).reduce((acc, { parking, valet }) => acc + (parking || 0) + (valet || 0), 0);
    const cashNetworkTotal = (data.totalCash || 0) + (data.totalNetwork || 0);
    const difference = tableTotal - cashNetworkTotal;

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center mb-2">جدول إيرادات المواقع</h2>
            <p className="text-muted-foreground text-center mb-8">
              أدخل تفاصيل الإيرادات اليومية لكل موقع.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>إيرادات الفنادق</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]">الموقع</TableHead>
                                        <TableHead>عدد السيارات</TableHead>
                                        <TableHead>مبالغ المواقف (ر.س)</TableHead>
                                        <TableHead>مبالغ الفاليه (ر.س)</TableHead>
                                        <TableHead className="text-right">المجموع (ر.س)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hotels.map(hotel => {
                                        const revenue = data.revenueByHotel[hotel] || { cars: 0, parking: 0, valet: 0 };
                                        const total = (revenue.parking || 0) + (revenue.valet || 0);
                                        return (
                                            <TableRow key={hotel}>
                                                <TableCell className="font-medium">{hotel}</TableCell>
                                                <TableCell><Input type="number" className="min-w-[80px]" value={revenue.cars || ''} onChange={e => handleRevenueChange(hotel, 'cars', e.target.value)} /></TableCell>
                                                <TableCell><Input type="number" className="min-w-[100px]" value={revenue.parking || ''} onChange={e => handleRevenueChange(hotel, 'parking', e.target.value)} /></TableCell>
                                                <TableCell><Input type="number" className="min-w-[100px]" value={revenue.valet || ''} onChange={e => handleRevenueChange(hotel, 'valet', e.target.value)} /></TableCell>
                                                <TableCell className="text-right font-mono">{total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                     <TableRow className="bg-muted/50 font-bold">
                                        <TableCell>الإجمالي</TableCell>
                                        <TableCell>{Object.values(data.revenueByHotel).reduce((acc, { cars }) => acc + (cars || 0), 0)}</TableCell>
                                        <TableCell className="font-mono">{Object.values(data.revenueByHotel).reduce((acc, { parking }) => acc + (parking || 0), 0).toFixed(2)}</TableCell>
                                        <TableCell className="font-mono">{Object.values(data.revenueByHotel).reduce((acc, { valet }) => acc + (valet || 0), 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-mono">{tableTotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>تفاصيل إضافية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="exempted-cars">عدد السيارات المعفاة</Label>
                                <Input id="exempted-cars" type="number" value={data.exemptedCars || ''} onChange={e => handleFieldChange('exemptedCars', parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exemption-reason">سبب الإعفاء</Label>
                                <Textarea id="exemption-reason" value={data.exemptionReason || ''} onChange={e => handleFieldChange('exemptionReason', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="mistake-cars">عدد السيارات المطلوبة بالخطأ</Label>
                                <Input id="mistake-cars" type="number" value={data.mistakeCars || ''} onChange={e => handleFieldChange('mistakeCars', parseInt(e.target.value) || 0)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>ملخص الدفع</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="total-cash">إجمالي الكاش</Label>
                                <Input id="total-cash" type="number" value={data.totalCash || ''} onChange={e => handleFieldChange('totalCash', parseFloat(e.target.value) || 0)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="total-network">إجمالي الشبكة</Label>
                                <Input id="total-network" type="number" value={data.totalNetwork || ''} onChange={e => handleFieldChange('totalNetwork', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="flex justify-between items-center font-bold p-2 bg-muted rounded-md">
                                <span>المجموع:</span>
                                <span className="font-mono">{cashNetworkTotal.toFixed(2)} ر.س</span>
                            </div>
                        </CardContent>
                    </Card>

                     <Card className={difference !== 0 ? 'border-destructive' : 'border-green-500'}>
                        <CardHeader className="p-4">
                           <CardTitle className="text-base">الفرق</CardTitle>
                           <CardDescription>الفرق بين إجمالي الإيرادات وإجمالي الدفع</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                           <p className={`text-2xl font-bold font-mono text-center ${difference !== 0 ? 'text-destructive' : 'text-green-500'}`}>
                             {difference.toFixed(2)} ر.س
                           </p>
                           <div className="space-y-2">
                                <Label htmlFor="difference-reason">سبب الفرق</Label>
                                <Textarea 
                                    id="difference-reason"
                                    value={data.differenceReason || ''} 
                                    onChange={e => handleFieldChange('differenceReason', e.target.value)}
                                    placeholder="لا يوجد فرق..."
                                    disabled={difference === 0}
                                 />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
