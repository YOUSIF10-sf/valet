"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, PieChart } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
      {/* Dynamic Background Elements - Softer for Light Mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/70 backdrop-blur-xl border border-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/5 to-transparent border-r border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_10px_20px_rgba(96,165,250,0.4)]">
                <PieChart className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Valet<span className="text-primary">Reports</span></span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              ارتقِ بتقاريرك إلى <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">مستوى جديد تماماً</span>
            </h1>
            
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-md">
              انضم إلى منصة التقارير الأكثر ابتكاراً في عام 2026. بياناتك، تحليلاتك، ورؤيتك المستقبلية في مكان واحد بتصميم ساحر.
            </p>

            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: "تشفير بيانات فائق الأمان" },
                { icon: PieChart, text: "تحليلات ذكية فورية" },
                { icon: User, text: "تجربة مستخدم مخصصة" }
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
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">انضم إلى أكثر من <span className="text-primary font-bold">10,000+</span> خبير تقارير</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white/40">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">إنشاء حساب جديد</h2>
            <p className="text-slate-500">ابدأ رحلتك الإبداعية معنا اليوم</p>
          </div>

          <form className="space-y-5" dir="rtl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 mr-1">الاسم الأول</label>
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="أحمد"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 mr-1">اسم العائلة</label>
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="العمري"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 mr-1">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 mr-1">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <button 
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(96,165,250,0.3)] hover:shadow-[0_15px_30px_rgba(96,165,250,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>إنشاء الحساب</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-primary font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>

          {/* Social Auth */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">أو التسجيل بواسطة</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm text-slate-700 font-semibold">جوجل</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" />
                <span className="text-sm text-slate-700 font-semibold">لينكد إن</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
