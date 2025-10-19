import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { FileText, PlusCircle, Settings, Car } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">أهلاً بك في نظام تقارير صف السيارات</h1>
            <p className="text-muted-foreground">
              يمكنك بسهولة إنشاء وإدارة التقارير اليومية.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/report/create">
              <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إنشاء تقرير جديد
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>التقارير الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">لا توجد تقارير حديثة</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ابدأ بإنشاء تقرير جديد لعرضه هنا.
                  </p>
                   <Link href="/report/create" className="mt-4 inline-block">
                    <Button>إنشاء تقرير</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/report/create" className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4 transition-colors hover:bg-accent/50">
                  <PlusCircle className="text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      تقرير جديد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      بدء معالج إنشاء تقرير جديد.
                    </p>
                  </div>
                </div>
              </Link>
               <div className="flex items-center space-x-4 rounded-md border p-4 transition-colors hover:bg-accent/50 cursor-pointer">
                <Car className="text-primary"/>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    إدارة الفنادق
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تصفح وتنظيم قائمة الفنادق.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
