"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle } from 'lucide-react';

export function Header() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("is_logged_in");
        router.push("/auth/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b/50 bg-white/70 backdrop-blur-md px-4 sm:px-6 shadow-sm transition-all duration-300">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <UserCircle className="h-5 w-5" />
                        <span className="sr-only">فتح قائمة المستخدم</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 shadow-lg">
                    <DropdownMenuLabel className="font-semibold text-primary">حسابي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">الإعدادات</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">الدعم</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        تسجيل الخروج
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex-1" />

            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="relative h-10 w-24 sm:w-32 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="شعار الشركة"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </Link>
        </header>
    );
}
