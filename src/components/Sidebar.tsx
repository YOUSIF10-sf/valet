"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FilePlus2, 
  Zap, 
  Car,
  FileText,
  Settings, 
  LogOut, 
  BarChart3,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DeveloperSignature } from "./DeveloperSignature";

const menuItems = [
  { name: "لوحة التحكم", icon: LayoutDashboard, href: "/" },
  { name: "إنشاء تقرير", icon: FilePlus2, href: "/report/create" },
  { name: "عمليات Zaps", icon: Zap, href: "/zaps/create" },
  { name: "سجل Zaps", icon: FileText, href: "/zaps/history" },
  { name: "سجل التقارير", icon: Car, href: "/cars" },
  { name: "التقرير الشهري", icon: BarChart3, href: "/reports/monthly" },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("is_logged_in");
    window.location.href = "/auth/login";
  };

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-l border-slate-200 bg-white/70 backdrop-blur-xl z-40">
      {/* Logo Section */}
      <div className="p-8 border-b border-slate-100/50">
        <Link href="/" className="flex items-center justify-center gap-3">
          <div className="relative h-12 w-full flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Valet Reports Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-[0_10px_20px_rgba(96,165,250,0.3)]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                <span className="font-bold text-[15px]">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100">
        <Link 
          href="/settings" 
          className={cn(
            "flex items-center gap-3 p-3.5 rounded-2xl transition-all mb-2",
            pathname === "/settings" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-bold text-[15px]">الإعدادات</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-[15px]">تسجيل الخروج</span>
        </button>

        <div className="mt-2 scale-75 origin-bottom">
           <DeveloperSignature />
        </div>
      </div>
    </aside>
  );
}
