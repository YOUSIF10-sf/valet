import { Header } from "@/components/Header";
import { ReportCreationWizard } from "@/components/report/ReportCreationWizard";

export default function CreateReportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center print:hidden">إنشاء تقرير جديد</h1>
        <ReportCreationWizard />
      </main>
    </div>
  );
}
