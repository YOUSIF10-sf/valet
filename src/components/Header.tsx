import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Car, UserCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">تقارير صف السيارات</span>
            </Link>
            <div className="flex-1" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <UserCircle className="h-5 w-5" />
                        <span className="sr-only">فتح قائمة المستخدم</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                    <DropdownMenuItem>الدعم</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
