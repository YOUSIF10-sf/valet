"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Mail, Lock, User, ArrowRight, ShieldCheck, PieChart, Fingerprint, AlertCircle } from "lucide-react";
import { DeveloperSignature } from "@/components/DeveloperSignature";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("is_logged_in", "true");
        router.push("/");
      } else {
        setError(data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم. تأكد من تشغيل السيرفر.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/70 backdrop-blur-xl border border-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/5 to-transparent border-r border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-8">
                <div className="relative h-12 w-28 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="شعار الشركة"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              ارتقِ بتقاريرك إلى <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">مستوى جديد تماماً</span>
            </h1>
            
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-md">
              منصة التقارير الأكثر ابتكاراً لإدارة عمليات الفاليه. ابدأ بتسجيل الدخول للوصول إلى بياناتك وتحليلاتك الذكية.
            </p>

            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: "تشفير بيانات فائق الأمان" },
                { icon: PieChart, text: "تحليلات ذكية فورية" },
                { icon: User, text: "إدارة فريق العمل بدقة" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <item.icon size={14} />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">موثوق من قبل <span className="text-primary font-bold">500+</span> فندق ومنشأة</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white/40">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500">أهلاً بك مجدداً! يرجى إدخال بياناتك</p>
          </div>

          <form className="space-y-6" dir="rtl" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 mr-1">اسم المستخدم</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">كلمة المرور</label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" className="rounded-md border-slate-200 text-primary focus:ring-primary/20" />
              <span className="text-sm text-slate-500 font-medium">تذكرني على هذا الجهاز</span>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(96,165,250,0.3)] hover:shadow-[0_15px_30px_rgba(96,165,250,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>دخول النظام</span>
                  <LogIn className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">أو المتابعة بواسطة</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm text-slate-700 font-semibold">جوجل</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
                <Fingerprint className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-700 font-semibold">Biometric</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs scale-75 opacity-60">
        <DeveloperSignature />
      </div>
    </div>
  );
}
