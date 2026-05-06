'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Repeat, CheckCircle2, FileUp, Loader2, Edit } from "lucide-react";
import { ReportData } from "./Step1DataInput";
import { RevenueData } from "./Step2TemplateSelection";
import { saveToGoogleSheets } from "@/lib/saveToGoogleSheets";

interface Step4ExportProps {
    onReset: () => void;
    onEdit: () => void;
    reportData: ReportData;
    revenueData: RevenueData;
    reportId: string;
}

export function Step4Export({ onReset, onEdit, reportData, revenueData, reportId }: Step4ExportProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    const handleGoogleSheetsSave = async () => {
        setIsSaving(true);
        setSaveError('');
        try {
            await saveToGoogleSheets(reportData, revenueData, reportId);
            setSaveSuccess(true);
        } catch (error: any) {
            setSaveError(error.message || "حدث خطأ غير متوقع");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExcelExport = () => {
        alert("تصدير Excel قريباً");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">التقرير جاهز للإرسال!</h2>
            <p className="text-muted-foreground mb-8">يرجى مراجعة التقرير جيداً. يمكنك حفظه في قاعدة البيانات السحابية، تصديره، أو العودة لتعديله.</p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-4">
                <Button
                    size="lg"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleGoogleSheetsSave}
                    disabled={isSaving || saveSuccess}
                >
                    {isSaving ? (
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    ) : saveSuccess ? (
                        <CheckCircle2 className="ml-2 h-5 w-5" />
                    ) : (
                        <FileUp className="ml-2 h-5 w-5" />
                    )}
                    {saveSuccess ? 'تم الحفظ في قوقل شيت بنجاح' : 'حفظ التقرير (Google Sheets)'}
                </Button>

                <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={onEdit} disabled={isSaving || saveSuccess}>
                    <Edit className="ml-2 h-5 w-5" />
                    مراجعة وتعديل البيانات
                </Button>

                <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleExcelExport} disabled>
                    <Download className="ml-2 h-5 w-5" />
                    تحميل Excel (قريبًا)
                </Button>
            </div>

            {saveError && (
                <p className="text-red-500 text-sm mb-4 font-bold bg-red-50 border border-red-200 p-3 rounded-lg w-full max-w-md">
                    {saveError}
                </p>
            )}

            <Button variant="ghost" onClick={onReset} className="mt-4">
                <Repeat className="ml-2 h-4 w-4" />
                إنشاء تقرير آخر
            </Button>
        </div>
    );
}
