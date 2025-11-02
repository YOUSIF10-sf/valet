'use client';

import { Button } from "@/components/ui/button";
import { Download, Repeat, CheckCircle2 } from "lucide-react";
import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import * as XLSX from 'xlsx';

// Local data to ensure component is self-contained
const hotels = ["ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"];
const shiftMap: { [key: string]: string } = { morning: 'صباحية', evening: 'مسائية' };

interface Step4ExportProps {
    onReset: () => void;
    reportData: ReportData;
    revenueData: RevenueData;
    reportId: string;
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function Step4Export({ onReset, reportData, revenueData, reportId }: Step4ExportProps) {

    const handleExcelExport = () => {
        // ... (Excel export logic - can be implemented here)
        alert("Excel export functionality is not yet implemented.");
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">اكتمل إنشاء التقرير!</h2>
            <p className="text-muted-foreground mb-8">يمكنك الآن تصدير تقريرك أو البدء من جديد.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleExcelExport} disabled>
                    <Download className="ml-2 h-5 w-5" />
                    تحميل Excel (قريبًا)
                </Button>
            </div>
            <Button variant="ghost" onClick={onReset}>
                <Repeat className="ml-2 h-4 w-4" />
                إنشاء تقرير آخر
            </Button>
        </div>
    );
}
