import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card for creating a new report */}
          <Link href="/report/create" className="h-full">
            <Card className="h-full hover:bg-slate-50/70 transition-colors shadow-sm hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">تقرير جديد</CardTitle>
                <FilePlus2 className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  البدء في إنشاء تقرير إيرادات يومي أو شهري جديد.
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </main>
    </div>
  );
}
