import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

const mockCashierData = [
  { cashier: "أحمد علي", cars: 5, totalFees: "75.00 ر.س", visitors: 3, guests: 2 },
  { cashier: "فاطمة محمد", cars: 8, totalFees: "120.00 ر.س", visitors: 6, guests: 2 },
  { cashier: "خالد عبدالله", cars: 3, totalFees: "45.00 ر.س", visitors: 1, guests: 2 },
];

export function Step2TemplateSelection() {
    return (
        <div className="text-center">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-right">جدول إيرادات الكاشيرات</h2>
                    <p className="text-muted-foreground text-right">عرض تفاصيل الإيرادات لكل كاشير.</p>
                </div>
                <Button variant="outline">
                    <Download className="ml-2 h-4 w-4" />
                    تصدير Excel
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                   <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اسم الكاشير</TableHead>
                            <TableHead className="text-center">عدد السيارات</TableHead>
                            <TableHead className="text-center">النزلاء</TableHead>
                            <TableHead className="text-center">الزوار</TableHead>
                            <TableHead className="text-right">إجمالي الرسوم</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockCashierData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{row.cashier}</TableCell>
                              <TableCell className="text-center">{row.cars}</TableCell>
                              <TableCell className="text-center">{row.guests}</TableCell>
                              <TableCell className="text-center">{row.visitors}</TableCell>
                              <TableCell className="text-right font-mono">{row.totalFees}</TableCell>
                            </TableRow>
                          ))}
                           <TableRow className="bg-muted/50 font-bold">
                              <TableCell>الإجمالي</TableCell>
                              <TableCell className="text-center">16</TableCell>
                              <TableCell className="text-center">6</TableCell>
                              <TableCell className="text-center">10</TableCell>
                              <TableCell className="text-right font-mono">240.00 ر.س</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                </CardContent>
            </Card>
        </div>
    );
}
