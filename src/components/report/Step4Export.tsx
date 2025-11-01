import { Button } from "@/components/ui/button";
import { Download, Printer, Repeat } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import * as XLSX from 'xlsx';
import { Step3MappingPreview } from "./Step3MappingPreview";

const hotels = [
  "ماريوت", "دبل تري", "هيلتون مؤتمرات", "هيلتون أجنحة", "حياة ريجنسي", "كونراد", "جميرا"
];

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

const shiftMap: { [key: string]: string } = {
  morning: 'صباحية',
  evening: 'مسائية',
};

export function Step4Export({ onReset, reportData, revenueData, reportId }: Step4ExportProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleExcelExport = () => {
        // ... (Excel export logic remains the same)
    };
    
    return (
        <>
            <div className="hidden print:block">
                <Step3MappingPreview 
                    reportData={reportData} 
                    revenueData={revenueData} 
                    reportId={reportId} 
                />
            </div>

            <div className="print:hidden flex flex-col items-center justify-center h-full text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">التقرير جاهز للتصدير!</h2>
                <p className="text-muted-foreground mb-8">حمّل التقرير الذي تم إنشاؤه بالصيغة التي تفضلها.</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button size="lg" className="w-full sm:w-auto" onClick={handleExcelExport}>
                        <Download className="ml-2 h-5 w-5" />
                        تحميل Excel (تصميم مميز)
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handlePrint}>
                        <Printer className="ml-2 h-5 w-5" />
                        طباعة التقرير
                    </Button>
                </div>
                <Button variant="ghost" onClick={onReset}>
                    <Repeat className="ml-2 h-4 w-4" />
                    إنشاء تقرير آخر
                </Button>
            </div>
        </>
    );
}
