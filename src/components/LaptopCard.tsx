import React from 'react';
import {
  BatteryMedium,
  CheckCircle,
  Eye,
  Plus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Cpu,
  HardDrive,
  Layers,
  Sparkles
} from 'lucide-react';
import { Laptop } from '../types';
import { calculateDiscountPercentage, formatPrice } from '../utils/currency';

interface LaptopCardProps {
  laptop: Laptop;
  currency: 'BDT' | 'USD';
  bdtToUsdRate: number;
  onViewDetails: (laptop: Laptop) => void;
  onAddToCart: (laptop: Laptop) => void;
  onDirectBuy: (laptop: Laptop) => void;
  isCompared: boolean;
  onToggleCompare: (laptopId: string) => void;
}

export const LaptopCard: React.FC<LaptopCardProps> = ({
  laptop,
  currency,
  bdtToUsdRate,
  onViewDetails,
  onAddToCart,
  onDirectBuy,
  isCompared,
  onToggleCompare,
}) => {
  const discountPercent = calculateDiscountPercentage(laptop.price, laptop.originalPrice);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-600 text-white shadow-xs">
            <Sparkles className="w-3 h-3" />
            Grade A+ (Like New)
          </span>
        );
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-blue-600 text-white shadow-xs">
            Grade A (Pristine)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-600 text-white shadow-xs">
            Grade B (Good)
          </span>
        );
    }
  };

  return (
    <div
      id={`laptop-card-${laptop.id}`}
      className="group bg-[#1E293B] rounded-2xl border border-slate-800 hover:border-blue-500/50 shadow-md hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top Media Container */}
      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onViewDetails(laptop)}>
        <img
          src={laptop.images[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'}
          alt={laptop.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Condition Grade Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {getGradeBadge(laptop.conditionGrade)}
          {laptop.isBestSeller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-amber-300 backdrop-blur-xs border border-amber-500/30">
              ★ Best Seller
            </span>
          )}
        </div>

        {/* Battery Health Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-cyan-300 border border-slate-700/60 shadow-md">
            <BatteryMedium className="w-3.5 h-3.5 text-cyan-400" />
            <span>{laptop.batteryHealth}% Battery</span>
          </div>
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wide shadow-xl flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Quick Specs
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Brand & Category & Compare */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-slate-400 uppercase tracking-wider text-[11px]">
              {laptop.brand} • {laptop.category}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(laptop.id);
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-colors ${
                isCompared
                  ? 'bg-blue-950 text-blue-300 border border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
              title="Compare side-by-side"
            >
              <Layers className="w-3 h-3" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(laptop)}
            className="font-extrabold text-[#F8FAFC] text-sm sm:text-base leading-snug line-clamp-2 hover:text-blue-400 cursor-pointer transition-colors"
          >
            {laptop.title}
          </h3>

          {/* Key Specs Pills Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800 truncate">
              <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate font-semibold text-[11px]">{laptop.processor.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800 truncate">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate font-semibold text-[11px]">{laptop.ram} • {laptop.storage.split(' ')[0]}</span>
            </div>
          </div>

          {/* Warranty & Test badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 font-medium">
            <span className="flex items-center gap-1 text-cyan-400 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">15d Replacement + 2yr Warranty</span>
            </span>
            <span className="shrink-0">
              {laptop.stock > 0 ? (
                <span className="text-emerald-400 font-bold">{laptop.stock} in stock</span>
              ) : (
                <span className="text-rose-400 font-bold">Sold Out</span>
              )}
            </span>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-3.5 border-t border-slate-800 space-y-3">
          {/* Price Container */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                {formatPrice(laptop.price, currency, bdtToUsdRate)}
              </span>
              {laptop.originalPrice > laptop.price && (
                <span className="text-xs text-slate-500 line-through font-bold">
                  {formatPrice(laptop.originalPrice, currency, bdtToUsdRate)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-700/60 text-rose-300 font-black uppercase tracking-wider text-xs">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(laptop)}
              disabled={laptop.stock <= 0}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-[#F8FAFC] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-slate-700"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onDirectBuy(laptop)}
              disabled={laptop.stock <= 0}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>অর্ডার করুন (Buy)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
