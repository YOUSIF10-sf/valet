'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    Zap, 
    Building2, 
    Hotel, 
    ChevronLeft,
    CheckCircle2,
    Save,
    PlusCircle,
    LayoutGrid,
    Loader2,
    Trophy,
    DollarSign,
    Download,
    Printer,
    ArrowLeftRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeveloperSignature } from "@/components/DeveloperSignature";

const hotels = [
    { id: 'marriott', name: "ماريوت", icon: <Building2 className="w-5 h-5" /> },
    { id: 'doubletree', name: "دبل تري", icon: <Hotel className="w-5 h-5" /> },
    { id: 'hilton_conv', name: "هيلتون مؤتمرات", icon: <Building2 className="w-5 h-5" /> },
    { id: 'hilton_suites', name: "هيلتون أجنحة", icon: <Hotel className="w-5 h-5" /> },
    { id: 'hyatt', name: "حياة ريجنسي", icon: <Building2 className="w-5 h-5" /> },
    { id: 'conrad', name: "كونراد", icon: <Hotel className="w-5 h-5" /> },
    { id: 'jumeirah', name: "جميرا", icon: <Building2 className="w-5 h-5" /> }
];

interface RowData {
    id: number;
    plate: string;
    parking: string;
    valet: string;
}

export default function CreateZapPage() {
    const [step, setStep] = useState(0); // 0: Start, 1: Selection, 2: Table, 3: Review, 4: Success
    const [selectedHotels, setSelectedHotels] = useState<Record<string, number>>({});
    const [rows, setRows] = useState<(RowData & { hotelId: string })[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleHotel = (hotelId: string) => {
        setSelectedHotels(prev => {
            const next = { ...prev };
            if (next[hotelId] !== undefined) {
                delete next[hotelId];
            } else {
                next[hotelId] = 1; // Default to 1 op
            }
            return next;
        });
    };

    const updateHotelCount = (hotelId: string, count: number) => {
        setSelectedHotels(prev => ({
            ...prev,
            [hotelId]: Math.min(Math.max(count, 1), 20) // Limit per hotel
        }));
    };

    const isSelectionValid = Object.keys(selectedHotels).length > 0 && 
                            Object.values(selectedHotels).every(count => count > 0);

    const handlePrepareTable = () => {
        if (!isSelectionValid) return;
        
        let newRows: (RowData & { hotelId: string })[] = [];
        let globalId = 1;

        Object.entries(selectedHotels).forEach(([hotelId, count]) => {
            for (let i = 0; i < count; i++) {
                newRows.push({
                    id: globalId++,
                    hotelId,
                    plate: '',
                    parking: '',
                    valet: ''
                });
            }
        });

        setRows(newRows);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGoToReview = () => {
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Save to Database
            const response = await fetch('/api/zaps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows })
            });
            const data = await response.json();
            
            if (data.success) {
                // 2. Capture Preview HTML for Email
                const previewElement = document.getElementById('zaps-review-preview');
                if (previewElement) {
                    const cloned = previewElement.cloneNode(true) as HTMLElement;
                    // Remove print-hidden elements
                    cloned.querySelectorAll('.print\\:hidden, .print-hidden').forEach(el => el.remove());
                    const htmlContent = cloned.innerHTML;

                    // 3. Send Email
                    await fetch('/api/zaps/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            rows,
                            htmlContent,
                            date: new Date().toLocaleDateString('ar-SA')
                        })
                    }).catch(err => console.error("Email send failed:", err));
                }

                setStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert("حدث خطأ أثناء الحفظ: " + data.message);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("فشل الاتصال بالسيرفر");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setStep(0);
        setSelectedHotels({});
        setRows([]);
    };

    const updateRow = (id: number, field: keyof RowData, value: string) => {
        setRows(rows.map(row => {
            if (row.id === id) {
                let updatedRow = { ...row, [field]: value };
                
                // Auto-fill prices when plate is first entered
                if (field === 'plate' && value.trim() !== "" && row.plate === "") {
                    // ماريوت، دبل تري، مؤتمرات -> 114 (84 + 30)
                    if (row.hotelId === 'marriott' || row.hotelId === 'doubletree' || row.hotelId === 'hilton_conv') {
                        updatedRow.parking = "84";
                        updatedRow.valet = "30";
                    } else {
                        // باقي الفنادق -> 134 (104 + 30)
                        updatedRow.parking = "104";
                        updatedRow.valet = "30";
                    }
                }
                return updatedRow;
            }
            return row;
        }));
    };

    const totalParking = useMemo(() => rows.reduce((acc, row) => acc + (parseFloat(row.parking) || 0), 0), [rows]);
    const totalValet = useMemo(() => rows.reduce((acc, row) => acc + (parseFloat(row.valet) || 0), 0), [rows]);

    return (
        <div className="flex min-h-screen bg-slate-50" dir="rtl">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                            <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <span className="font-black text-slate-800 tracking-tight">إضافة عمليات ZAPS متعددة</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <div className="relative h-10 w-24 flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="شعار الشركة"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        <Link href="/">
                            <Button variant="ghost" className="rounded-xl text-slate-500 font-bold hover:bg-slate-100">
                                إلغاء والعودة
                                <ArrowRight className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </header>
                
                <main className="flex-1 container mx-auto p-4 sm:p-6 flex flex-col items-center">
                
                {/* STEP 0: Start Button */}
                {step === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 py-20">
                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-2xl shadow-orange-100">
                            <PlusCircle className="w-12 h-12 stroke-[2.5px]" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">إضافة عمليات فنادق متعددة</h2>
                            <p className="text-slate-500 font-bold">يمكنك الآن اختيار عدة فنادق وتحديد عدد العمليات لكل منها في وقت واحد.</p>
                        </div>
                        <Button 
                            onClick={() => setStep(1)}
                            className="h-20 px-12 text-2xl font-black rounded-[28px] bg-slate-900 hover:bg-slate-800 shadow-2xl transition-all active:scale-95 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <PlusCircle className="ml-3 h-8 w-8 text-orange-500 transition-transform group-hover:rotate-90 duration-500" />
                            بدء التحديد
                        </Button>
                    </div>
                )}

                {/* STEP 1: Multiple Hotel Selection & Counts */}
                {step === 1 && (
                    <div className="w-full space-y-10 py-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">1</div>
                                <span className="text-xs font-black text-slate-900">تحديد الفنادق</span>
                            </div>
                            <div className="w-10 h-px bg-slate-200" />
                            <div className="flex items-center gap-2 opacity-30">
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black">2</div>
                                <span className="text-xs font-black text-slate-500">إدخال البيانات</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="text-center space-y-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">اختر الفنادق المستهدفة</h1>
                                <p className="text-slate-400 font-bold text-sm">اضغط على الفندق لاختياره ثم حدد عدد العمليات له</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hotels.map((hotel) => {
                                    const isSelected = selectedHotels[hotel.id] !== undefined;
                                    return (
                                        <div 
                                            key={hotel.id}
                                            className={cn(
                                                "p-4 rounded-[28px] border-2 transition-all duration-300 flex items-center justify-between gap-4",
                                                isSelected 
                                                    ? "bg-white border-orange-500 shadow-xl shadow-orange-100" 
                                                    : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <button
                                                onClick={() => toggleHotel(hotel.id)}
                                                className="flex items-center gap-4 flex-1 text-right"
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                                    isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    {hotel.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-black text-lg", isSelected ? "text-slate-900" : "text-slate-400")}>{hotel.name}</span>
                                                    {isSelected && <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">مختار</span>}
                                                </div>
                                            </button>

                                            {isSelected && (
                                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                                                    <span className="text-xs font-black text-slate-400 mr-2">العمليات:</span>
                                                    <input 
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={selectedHotels[hotel.id]}
                                                        onChange={(e) => updateHotelCount(hotel.id, parseInt(e.target.value))}
                                                        className="w-16 h-10 rounded-xl border-2 border-orange-200 bg-white text-center font-black text-orange-600 outline-none focus:border-orange-500 transition-all"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={cn(
                                "flex justify-center pt-6 transition-all duration-500",
                                isSelectionValid ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                            )}>
                                <Button 
                                    onClick={handlePrepareTable}
                                    className="w-full sm:w-96 h-16 text-xl font-black rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all group"
                                >
                                    تجهيز الجداول الذكية
                                    <ChevronLeft className="mr-3 h-6 w-6 group-hover:-translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Data Entry Tables (Grouped by Hotel) */}
                {step === 2 && (
                    <div className="w-full space-y-8 py-4 animate-in slide-in-from-left duration-500">
                        {/* Summary Header */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            
                            <div className="flex items-center gap-6 relative">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                    <LayoutGrid className="w-8 h-8 text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">إدخل بيانات الفنادق المختارة</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                            تم تحديد {Object.keys(selectedHotels).length} فنادق | إجمالي {rows.length} عمليات
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 relative">
                                <div className="bg-emerald-50 px-8 py-4 rounded-[24px] text-center border border-emerald-100/50 shadow-sm">
                                    <p className="text-[11px] text-emerald-600 font-black uppercase tracking-tighter mb-1">إجمالي المبالغ</p>
                                    <p className="text-3xl font-black text-emerald-700 tabular-nums">
                                        {(totalParking + totalValet).toLocaleString()} 
                                        <span className="text-sm mr-1 font-bold opacity-70">ر.س</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Separate Tables for Each Hotel */}
                        {Object.entries(selectedHotels).map(([hotelId, count], hIndex) => {
                            const hotelName = hotels.find(h => h.id === hotelId)?.name;
                            const hotelRows = rows.filter(r => r.hotelId === hotelId);
                            
                            return (
                                <div 
                                    key={hotelId} 
                                    className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
                                    style={{ animationDelay: `${hIndex * 150}ms` }}
                                >
                                    <div className="bg-slate-900 px-8 py-5 flex justify-between items-center border-b border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                                {hotels.find(h => h.id === hotelId)?.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-black text-xl tracking-tight">جدول {hotelName}</span>
                                                <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">{count} عمليات مسجلة</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50/80">
                                                <TableRow className="hover:bg-transparent border-slate-100">
                                                    <TableHead className="w-16 text-slate-900 text-center font-black py-5 text-sm">#</TableHead>
                                                    <TableHead className="text-slate-900 text-right font-black py-5 text-sm">بيانات اللوحة</TableHead>
                                                    <TableHead className="text-slate-900 text-center font-black text-sm">إجمالي المواقف</TableHead>
                                                    <TableHead className="text-slate-900 text-center font-black text-sm">إجمالي الصف</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {hotelRows.map((row, index) => (
                                                    <TableRow 
                                                        key={row.id} 
                                                        className={cn(
                                                            "group transition-colors border-slate-50",
                                                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                                                            "hover:bg-orange-50/40"
                                                        )}
                                                    >
                                                        <TableCell className="text-center">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-black group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                                {index + 1}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Input 
                                                                value={row.plate}
                                                                onChange={(e) => updateRow(row.id, 'plate', e.target.value)}
                                                                placeholder="رقم اللوحة..."
                                                                className="border-slate-100 bg-transparent font-black text-center h-12 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all uppercase tracking-widest text-base shadow-sm"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input 
                                                                type="number"
                                                                value={row.parking}
                                                                onChange={(e) => updateRow(row.id, 'parking', e.target.value)}
                                                                placeholder="0.00"
                                                                className="border-slate-100 bg-transparent font-black text-center h-12 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base tabular-nums shadow-sm"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input 
                                                                type="number"
                                                                value={row.valet}
                                                                onChange={(e) => updateRow(row.id, 'valet', e.target.value)}
                                                                placeholder="0.00"
                                                                className="border-slate-100 bg-transparent font-black text-center h-12 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base tabular-nums shadow-sm"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    
                                    {/* Hotel Footer Total */}
                                    <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-end px-12">
                                        <div className="flex gap-8">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">إجمالي الموقع</span>
                                                <span className="text-lg font-black text-slate-700">
                                                    {hotelRows.reduce((a, b) => a + (parseFloat(b.parking) || 0) + (parseFloat(b.valet) || 0), 0).toLocaleString()} <span className="text-xs font-bold opacity-50">ر.س</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Action Buttons */}
                        <div className="pt-10 pb-20 flex flex-col sm:flex-row gap-5">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-20 text-xl font-black rounded-3xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                                onClick={() => setStep(1)}
                                disabled={isSubmitting}
                            >
                                <ChevronLeft className="ml-3 h-6 w-6" />
                                تعديل الفنادق أو الأعداد
                            </Button>
                            <Button 
                                onClick={handleGoToReview}
                                disabled={isSubmitting}
                                className="flex-[2] h-20 text-2xl font-black rounded-3xl bg-slate-900 hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 group transition-all active:scale-95 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        جاري المعالجة والمراجعة...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        العرض والمراجعة ( {rows.length} عملية )
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}


                {/* STEP 3: Review Dashboard Before Saving */}
                {step === 3 && (
                    <div id="zaps-review-preview" className="w-full space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto print:p-0 print:shadow-none print:border-none">
                        
                        <style dangerouslySetInnerHTML={{ __html: `
                            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
                            @page { size: A4; margin: 15mm; }
                            @media print {
                                body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                                .print-hidden { display: none !important; }
                                #zaps-review-preview { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
                                .official-header { border-bottom: 2px solid black !important; }
                            }
                        `}} />

                        {/* Top Action Bar (Hidden in Print) */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-slate-200 shadow-sm">
                            <div className="space-y-1 text-center md:text-right">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                        <LayoutGrid className="w-5 h-5" />
                                    </div>
                                    مراجعة عمليات ZAPS
                                </h1>
                                <p className="text-slate-500 font-bold mr-12 text-sm uppercase tracking-wider opacity-60">Final Review Before Submission</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" size="lg" className="rounded-2xl px-8 h-14 font-bold border-2 border-slate-200" onClick={() => setStep(2)}>
                                    تعديل البيانات
                                </Button>
                                <Button 
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting}
                                    size="lg" 
                                    className="rounded-2xl px-12 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 font-black text-lg gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    اعتماد وحفظ العمليات
                                </Button>
                            </div>
                        </div>

                        {/* Official Document Card */}
                        <Card className="bg-white rounded-[40px] shadow-2xl border border-slate-200 p-12 relative overflow-hidden print:shadow-none print:border-none print:p-0">
                            
                            {/* Decorative Background (Hidden in Print) */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32 print:hidden" />
                            
                            <div className="relative z-10 space-y-12">
                                {/* Formal Header */}
                                <header className="official-header flex justify-between items-start pb-10 border-b-2 border-slate-100">
                                    <div className="text-right space-y-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest print:hidden">
                                          Review Stage
                                        </div>
                                        <h1 className="text-4xl print:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                            كشف عمليات ZAPS
                                        </h1>
                                        <h2 className="text-xl print:text-sm font-medium text-slate-400 tracking-wide uppercase">
                                            Quick Operations Report
                                        </h2>
                                        <div className="mt-4 pt-2">
                                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-mono">
                                              <span>Count: {rows.length} operations</span>
                                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                              <span>Date: {new Date().toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left flex flex-col items-end">
                                        <div className="flex flex-col items-end" dir="ltr">
                                            <div className="text-3xl font-black tracking-tighter text-orange-600 flex items-center gap-1">
                                                EASY<span className="text-slate-900">VALET</span>
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] text-right w-full">
                                                Professional Services
                                            </div>
                                        </div>
                                        <Button variant="outline" className="mt-8 rounded-xl gap-2 font-bold border-slate-200 print:hidden" onClick={() => window.print()}>
                                            <Printer className="w-4 h-4" />
                                            طباعة المستند
                                        </Button>
                                    </div>
                                </header>

                                {/* Stats Summary Grid */}
                                <div className="grid grid-cols-2 gap-6 print:grid-cols-2">
                                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                            <LayoutGrid className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">العدد الإجمالي</p>
                                            <p className="text-2xl font-black text-slate-900">{rows.length} عملية</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">إجمالي المبالغ</p>
                                            <p className="text-2xl font-black text-emerald-700">{(totalParking + totalValet).toLocaleString()} ر.س</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Data */}
                                <div className="border border-slate-200 rounded-[28px] overflow-hidden shadow-sm print:border-black print:rounded-none">
                                    <Table>
                                        <TableHeader className="bg-slate-900">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="py-5 px-8 text-right font-black text-white">الموقع (الفندق)</TableHead>
                                                <TableHead className="text-center font-black text-white">رقم اللوحة</TableHead>
                                                <TableHead className="text-center font-black text-white">المواقف</TableHead>
                                                <TableHead className="text-center font-black text-white">الفاليه</TableHead>
                                                <TableHead className="text-center font-black text-white">المجموع</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rows.map((row) => {
                                                const hotelName = hotels.find(h => h.id === row.hotelId)?.name;
                                                const amount = (parseFloat(row.parking) || 0) + (parseFloat(row.valet) || 0);
                                                return (
                                                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 print:border-black">
                                                        <TableCell className="py-5 px-8 font-bold text-slate-700">{hotelName}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-black px-4 tracking-widest">
                                                                {row.plate || "N/A"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold text-slate-600">{(parseFloat(row.parking) || 0).toLocaleString()}</TableCell>
                                                        <TableCell className="text-center font-bold text-slate-600">{(parseFloat(row.valet) || 0).toLocaleString()}</TableCell>
                                                        <TableCell className="text-center font-black text-slate-900 text-lg">{amount.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Official Footer & Signatures */}
                                <footer className="mt-16 pt-12 border-t border-slate-100 flex justify-between items-end print:mt-8">
                                    <div className="text-right space-y-4">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Operations Verified By</p>
                                        <div className="h-px w-48 bg-slate-200 print:bg-black" />
                                        <p className="text-sm font-black text-slate-800">توقيع المسؤول الميداني</p>
                                    </div>
                                    
                                    <div className="text-left space-y-2 flex flex-col items-center">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest w-full text-left mb-2">Approved By Management</p>
                                        <div className="relative flex flex-col items-center">
                                            <div 
                                                style={{ 
                                                    fontFamily: "'Caveat', cursive",
                                                    transform: "rotate(-3deg)",
                                                    textShadow: "1px 1px 0px rgba(249, 115, 22, 0.1)"
                                                }} 
                                                className="text-orange-600 font-bold text-5xl tracking-tighter mt-1 mb-2 select-none"
                                            >
                                                Yousif Tariq
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Managing Director
                                            </div>
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </Card>

                        {/* Developer Credit (Hidden in Print) */}
                        <div className="pt-6 pb-12 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity print:hidden">
                            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1">Developed By</p>
                            <span className="text-slate-600 font-black text-sm tracking-tight uppercase">❤️ YOUSIF TARIQ</span>
                        </div>
                    </div>
                )}


                {/* STEP 4: Success Screen */}
                {step === 4 && (
                    <div className="w-full space-y-10 py-6 animate-in fade-in zoom-in duration-700">
                        {/* Success Header */}
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-100">
                                    <Trophy className="w-12 h-12 stroke-[2px]" />
                                </div>
                                <div className="absolute -top-1 -right-1">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">تم حفظ العمليات بنجاح!</h2>
                                <p className="text-slate-500 font-bold text-lg">لقد تم تسجيل {rows.length} عملية ZAPS بنجاح في النظام</p>
                            </div>
                        </div>

                        {/* Summary Table (Simplified) */}
                        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white max-w-2xl mx-auto">
                            <CardHeader className="border-b border-slate-50 px-8 py-6 flex flex-row items-center justify-between bg-white">
                                <CardTitle className="text-xl font-black text-slate-800">ملخص الحفظ</CardTitle>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black">مكتمل ✅</Badge>
                            </CardHeader>
                            <CardContent className="p-8 text-center space-y-4">
                                <p className="text-slate-500 font-bold">تم نقل جميع العمليات إلى سجل النظام الدائم.</p>
                                <div className="flex justify-center gap-1 text-3xl font-black text-emerald-600">
                                    {(totalParking + totalValet).toLocaleString()}
                                    <span className="text-sm self-end mb-1 mr-1">ر.س</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                            <Button 
                                onClick={handleReset}
                                className="h-16 px-10 text-xl font-black rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl flex items-center gap-3"
                            >
                                <PlusCircle className="h-6 w-6 text-orange-500" />
                                إضافة عمليات جديدة
                            </Button>
                            <Link href="/zaps/history">
                                <Button 
                                    variant="outline"
                                    className="h-16 px-10 text-xl font-black rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-600"
                                >
                                    عرض السجل الكامل
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
                </main>

                <DeveloperSignature />
            </div>
        </div>
    );
}
