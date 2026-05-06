"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DeveloperSignature } from "@/components/DeveloperSignature";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, User, Lock, Save, Loader2, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setUsername(data.username);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("تم تحديث بيانات الدخول بنجاح. يرجى استخدام البيانات الجديدة في المرة القادمة.");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 container mx-auto py-10 px-4 md:px-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <KeyRound className="w-6 h-6" />
              </div>
              إعدادات الأمان والدخول
            </h1>
            <p className="text-slate-500 font-bold mr-14">تحكم في بيانات الوصول إلى النظام لضمان أعلى مستويات الأمان</p>
          </div>

          <div className="max-w-2xl">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-6 border-b border-slate-50">
                <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  تعديل بيانات المشرف
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">قم بتحديث اسم المستخدم أو كلمة المرور الخاصة بك</CardDescription>
              </CardHeader>
              
              <CardContent className="p-10 space-y-8">
                {fetching ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">اسم المستخدم الحالي</label>
                      <div className="relative group">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <Input 
                          type="text" 
                          className="h-16 rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-xl pr-14 focus:ring-4 focus:ring-primary/10 transition-all" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">كلمة المرور الجديدة</label>
                        <div className="relative group">
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            className="h-16 rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-xl pr-14 focus:ring-4 focus:ring-primary/10 transition-all" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">تأكيد كلمة المرور</label>
                        <div className="relative group">
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            className="h-16 rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-xl pr-14 focus:ring-4 focus:ring-primary/10 transition-all" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                         <ShieldCheck className="w-5 h-5" />
                       </div>
                       <p className="text-sm font-bold text-amber-800 leading-relaxed">
                         تنبيه: تأكد من حفظ بيانات الدخول الجديدة في مكان آمن. في حال فقدانها ستحتاج إلى التواصل مع المطور لاستعادتها.
                       </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-18 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 py-8"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6 text-primary" /> حفظ التغييرات الأمنية</>}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <DeveloperSignature />
        </main>
      </div>
    </div>
  );
}
