'use client';

import { useState, useTransition, useEffect } from "react";
import { StepIndicator } from "@/components/report/StepIndicator";
import { Step1DataInput, ReportData } from "@/components/report/Step1DataInput";
import { Step2TemplateSelection, RevenueData } from "@/components/report/Step2TemplateSelection";
import { Step3MappingPreview } from "@/components/report/Step3MappingPreview";
import { Step4Export } from "@/components/report/Step4Export";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema } from "@/components/report/Step1DataInput";

const steps = [
  { id: 1, name: "إدخال البيانات" },
  { id: 2, name: "جدول الإيرادات" },
  { id: 3, name: "معاينة" },
  { id: 4, name: "تصدير" },
];

const initialRevenueData: RevenueData = {
  revenueByHotel: {},
  exemptedCars: 0,
  exemptionReason: "",
  mistakeCars: 0,
  totalCash: 0,
  totalNetwork: 0,
  differenceReason: "",
};

export function ReportCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [reportId] = useState(`VAL-${Date.now()}`); // Unique ID for the report

  // State for Step 2 data
  const [revenueData, setRevenueData] = useState<RevenueData>(initialRevenueData);

  const methods = useForm<ReportData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      projectName: "",
      reportType: "daily",
      attendanceCount: 0,
      absenceCount: 0,
      supervisorName: "",
      notes: "",
    },
  });

  const reportData = methods.watch();
  const reportType = methods.watch("reportType");

  // FIX: Reset revenue data when the report type changes to prevent data mismatch.
  useEffect(() => {
    setRevenueData(initialRevenueData);
  }, [reportType]);

  const changeStep = (step: number) => {
    startTransition(() => {
        setCurrentStep(step);
    });
  };

  const goToNext = () => {
     if (currentStep === 1) {
      methods.trigger().then(isValid => {
        if (isValid) {
          changeStep(2);
        }
      });
    } else {
      changeStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const goToPrev = () => changeStep(Math.max(currentStep - 1, 1));
  const reset = () => {
    methods.reset();
    setRevenueData(initialRevenueData);
    changeStep(1);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1DataInput />;
      case 2:
        return <Step2TemplateSelection data={revenueData} onDataChange={setRevenueData} reportType={reportData.reportType} />;
      case 3:
        // Pass the collected data to the preview component
        return <Step3MappingPreview reportData={reportData} revenueData={revenueData} reportId={reportId} />;
      case 4:
        return <Step4Export onReset={reset} reportData={reportData} revenueData={revenueData} reportId={reportId} />;
      default:
        return null;
    }
  };

  return (
     <FormProvider {...methods}>
      <div className="space-y-8">
        <div className="print:hidden">
            <StepIndicator steps={steps} currentStep={currentStep} />
        </div>
        <Card className="p-6 rounded-lg shadow-sm min-h-[450px] flex flex-col transition-opacity duration-300" style={{opacity: isPending ? 0.7 : 1}}>
          <div className="flex-1">
            {renderStep()}
          </div>
        </Card>
        <div className="flex justify-between items-center print:hidden">
          {currentStep > 1 && currentStep < steps.length ? (
            <Button variant="outline" onClick={goToPrev}>
              رجوع
            </Button>
          ) : <div />}
          {currentStep < steps.length ? (
            <Button onClick={goToNext} disabled={isPending}>
              {isPending ? "جاري التحميل..." : "التالي"}
            </Button>
          ) : <div />}
        </div>
      </div>
    </FormProvider>
  );
}
