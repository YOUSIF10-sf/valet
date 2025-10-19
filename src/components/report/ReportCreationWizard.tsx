"use client";

import { useState, useTransition } from "react";
import { StepIndicator } from "@/components/report/StepIndicator";
import { Step1DataInput } from "@/components/report/Step1DataInput";
import { Step2TemplateSelection } from "@/components/report/Step2TemplateSelection";
import { Step3MappingPreview } from "@/components/report/Step3MappingPreview";
import { Step4Export } from "@/components/report/Step4Export";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  { id: 1, name: "إدخال البيانات" },
  { id: 2, name: "جدول الإيرادات" },
  { id: 3, name: "معاينة" },
  { id: 4, name: "تصدير" },
];

export function ReportCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('valet-report');
  const [isPending, startTransition] = useTransition();

  const changeStep = (step: number) => {
    startTransition(() => {
        setCurrentStep(step);
    });
  };

  const goToNext = () => changeStep(Math.min(currentStep + 1, steps.length));
  const goToPrev = () => changeStep(Math.max(currentStep - 1, 1));
  const reset = () => {
    changeStep(1);
    setSelectedTemplate('valet-report');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1DataInput />;
      case 2:
        return <Step2TemplateSelection />;
      case 3:
        return <Step3MappingPreview />;
      case 4:
        return <Step4Export onReset={reset} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <StepIndicator steps={steps} currentStep={currentStep} />
      <Card className="p-6 rounded-lg shadow-sm min-h-[450px] flex flex-col transition-opacity duration-300" style={{opacity: isPending ? 0.7 : 1}}>
        <div className="flex-1">
          {renderStep()}
        </div>
      </Card>
      <div className="flex justify-between items-center">
        {currentStep > 1 && currentStep < steps.length ? (
          <Button variant="outline" onClick={goToPrev}>
            رجوع
          </Button>
        ) : <div />}
        {currentStep < steps.length ? (
          <Button onClick={goToNext} disabled={isPending}>
            {isPending ? "..." : "التالي"}
          </Button>
        ) : <div />}
      </div>
    </div>
  );
}
