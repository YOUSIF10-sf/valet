import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Step = { id: number; name: string };

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.id < currentStep ? (
              <div className="group flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                <span className="text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : step.id === currentStep ? (
              <div className="flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0" aria-current="step">
                <span className="text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-border py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
