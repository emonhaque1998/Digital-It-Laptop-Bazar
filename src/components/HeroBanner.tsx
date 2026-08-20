import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Zap,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { LaptopBrand } from '../types';

interface HeroBannerProps {
  onSelectBrand: (brand: LaptopBrand | 'ALL') => void;
  onSelectQuickCategory: (cat: string) => void;
  onOpenAIAdvisor: () => void;
  totalLaptopsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectBrand,
  onSelectQuickCategory,
  onOpenAIAdvisor,
  totalLaptopsCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#0B1120] text-[#F8FAFC] pt-8 pb-10 sm:pt-14 sm:pb-16 border-b border-slate-800">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Headline & Pitch */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-extrabold tracking-wider uppercase shadow-inner">
              <BadgeCheck className="w-4 h-4 text-blue-400" />
              <span>100% Tested Authentic Used & Refurbished Laptops</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.1] uppercase">
              Best Used Laptops in Bangladesh{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                with 15 Days Replacement
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              Find Grade-A+ business ultrabooks, MacBooks, and gaming laptops from top global brands (ThinkPad, HP EliteBook, Dell Latitude, Apple M1). Every single unit passes our strict <strong className="text-white font-bold">12-Point Hardware Stress Test</strong>.
            </p>

            {/* Quick Action Badges / Search Shortcuts */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">Popular Filters:</span>
              <button
                onClick={() => onSelectBrand('Lenovo')}
                className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
              >
                ThinkPad T Series
              </button>
              <button
                onClick={() => onSelectBrand('Apple')}
                className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
              >
                MacBook M1 / Pro
              </button>
              <button
                onClick={() => onSelectBrand('HP')}
                className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
              >
                HP EliteBook
              </button>
              <button
                onClick={() => onSelectBrand('Dell')}
                className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
              >
                Dell Latitude & XPS
              </button>
              <button
                onClick={() => onSelectQuickCategory('Gaming')}
                className="px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 text-xs font-bold uppercase tracking-wide transition-colors"
              >
                🎮 Gaming (RTX)
              </button>
            </div>
          </div>

          {/* AI Advisor Card Callout */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-blue-400" />
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#F8FAFC] uppercase tracking-wide">Confused about specs?</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Ask our AI Laptop Consultant</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed font-normal">
                Tell us your budget and intended work (programming, freelancing, office, video editing) and get instant personalized used laptop recommendations.
              </p>
              <button
                onClick={onOpenAIAdvisor}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                <span>Find My Ideal Laptop</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Buyer Trust */}
        <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase text-[#F8FAFC] tracking-wide">12-Point QC Tested</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">Screen, thermal & battery check</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase text-[#F8FAFC] tracking-wide">15 Days Replacement</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">+ 2 Years Service Warranty</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase text-[#F8FAFC] tracking-wide">Nationwide Delivery</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">Cash on Delivery with check</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase text-[#F8FAFC] tracking-wide">Original Accessories</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">Free original charger & bag</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
