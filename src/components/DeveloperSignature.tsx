import React from 'react';
import Image from 'next/image';

export function DeveloperSignature() {
  return (
    <div className="py-12 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-all duration-500 group">
      <p className="text-slate-400 text-[9px] font-black tracking-[0.3em] uppercase mb-1">
        Designed & Developed By
      </p>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">
          YOUSIF TARIQ
        </span>
        <span className="text-xl text-rose-500">❤️</span>
      </div>

      <div className="relative w-32 h-16 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
        <Image 
          src="/signature.png" 
          alt="Yousif Tariq Signature" 
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
