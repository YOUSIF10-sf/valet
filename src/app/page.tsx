'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { PlusCircle, Car } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">أهلاً بك في نظام تقارير المشاريع</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            يمكنك بسهولة إنشاء وإدارة التقارير اليومية للمشاريع.
          </p>
        </div>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link href="/report/create">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>إنشاء تقرير جديد</CardTitle>
                <PlusCircle className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  بدء معالج إنشاء تقرير جديد للمشاريع اليومية.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="cursor-pointer h-full transition-shadow hover:shadow-lg bg-secondary/30">
             <CardHeader className="flex-row items-center justify-between">
                <CardTitle>إدارة المشاريع</CardTitle>
                <Car className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  (قريباً) تصفح وتنظيم قائمة المشاريع.
                </p>
              </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
