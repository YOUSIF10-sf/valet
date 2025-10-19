"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { File, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockUserData = [
  { hotel: "ماريوت", employee: "محمد أحمد", cars: 15, date: "2024-08-01" },
  { hotel: "هيلتون", employee: "علي حسن", cars: 22, date: "2024-08-01" },
  { hotel: "حياة ريجنسي", employee: "سارة خالد", cars: 18, date: "2024-08-01" },
];
const mockTemplateFields = ["الفندق", "الموظف", "عدد السيارات", "التاريخ"];

export function Step3MappingPreview() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      setIsPreviewing(false);
      setIsGenerated(true);
    }, 1500);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">معاينة التقرير</h2>
      <p className="text-muted-foreground mb-6">أنشئ معاينة للتحقق من بيانات التقرير قبل التصدير.</p>
      
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        {!isGenerated ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 w-full max-w-lg">
            <File className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">ستظهر المعاينة هنا</h3>
            <p className="mt-1 text-sm text-muted-foreground">اضغط على الزر لإنشاء معاينة لتقريرك.</p>
            <Button onClick={handleGenerate} disabled={isPreviewing} className="mt-4">
              {isPreviewing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {isPreviewing ? "جاري الإنشاء..." : "إنشاء معاينة"}
            </Button>
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">معاينة التقرير المجمع</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="excel" dir="rtl">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="excel">معاينة Excel</TabsTrigger>
                  <TabsTrigger value="pdf">معاينة PDF</TabsTrigger>
                </TabsList>
                <TabsContent value="excel">
                  <ScrollArea className="h-72 w-full rounded-md border mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {mockTemplateFields.map(field => <TableHead key={field}>{field}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUserData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.hotel}</TableCell>
                            <TableCell>{row.employee}</TableCell>
                            <TableCell>{row.cars}</TableCell>
                            <TableCell className="text-right">{row.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="pdf">
                  <ScrollArea className="h-72 w-full rounded-md border mt-4 p-4 text-right">
                     <h2 className="text-xl font-bold mb-4">تقرير صف السيارات اليومي</h2>
                     <p className="text-sm text-muted-foreground mb-4">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                     <p>هذا المستند يلخص نشاط خدمة صف السيارات لليوم المحدد. تجدون أدناه جدولاً مفصلاً بالبيانات.</p>
                     <div className="my-4 border-b"></div>
                      <Table>
                          <TableHeader><TableRow><TableHead>الفندق</TableHead><TableHead>الموظف المسؤول</TableHead><TableHead className="text-left">عدد السيارات</TableHead></TableRow></TableHeader>
                          <TableBody>
                              {mockUserData.map((row, i) => <TableRow key={i}><TableCell>{row.hotel}</TableCell><TableCell>{row.employee}</TableCell><TableCell className="text-left">{row.cars}</TableCell></TableRow>)}
                          </TableBody>
                      </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
