import { Header } from "@/components/Header";
import { ReportCreationWizard } from "@/components/report/ReportCreationWizard";

export default function CreateReportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-8 text-center">Create Your Report</h1>
        <ReportCreationWizard />
      </main>
    </div>
  );
}
