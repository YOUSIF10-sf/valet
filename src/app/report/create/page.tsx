import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { UnifiedReportForm } from "@/components/report/UnifiedReportForm";
import { DeveloperSignature } from "@/components/DeveloperSignature";

export default function CreateReportPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <Header />
        </div>
        <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
          <div className="mb-8 text-center lg:text-right print:hidden">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">إنشاء تقرير مالي</h1>
            <p className="text-slate-500">أدخل جميع بيانات الإيرادات في نموذج واحد سهل وسريع</p>
          </div>
          <UnifiedReportForm />
          <DeveloperSignature />
        </main>
      </div>
    </div>
  );
}
