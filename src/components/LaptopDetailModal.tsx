import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  BatteryMedium,
  CheckCircle2,
  Cpu,
  HardDrive,
  Monitor,
  Sparkles,
  Zap,
  ShoppingCart,
  MessageSquare,
  Share2,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  PackageCheck
} from 'lucide-react';
import { Laptop, ShopSettings } from '../types';
import { calculateDiscountPercentage, formatPrice } from '../utils/currency';

interface LaptopDetailModalProps {
  laptop: Laptop | null;
  onClose: () => void;
  onAddToCart: (laptop: Laptop) => void;
  onDirectBuy: (laptop: Laptop) => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
  isCompared: boolean;
  onToggleCompare: (laptopId: string) => void;
}

export const LaptopDetailModal: React.FC<LaptopDetailModalProps> = ({
  laptop,
  onClose,
  onAddToCart,
  onDirectBuy,
  currency,
  settings,
  isCompared,
  onToggleCompare,
}) => {
  if (!laptop) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const discount = calculateDiscountPercentage(laptop.price, laptop.originalPrice);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${settings.shopName}! I want to buy/know more about this used laptop: ${laptop.title} (Price: ৳${laptop.price}). Is it available?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 relative flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-[#1E293B]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-600 text-white">
              {laptop.brand}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {laptop.series}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => onToggleCompare(laptop.id)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 font-black uppercase tracking-wide transition-colors ${
                isCompared
                  ? 'bg-blue-950 text-blue-300 border border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Photos Showcase */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src={laptop.images[activeImageIndex] || laptop.images[0]}
                alt={laptop.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  Grade {laptop.conditionGrade} Condition
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-between text-xs border border-slate-800">
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-cyan-400">
                  <BatteryMedium className="w-4 h-4" />
                  <span>{laptop.batteryHealth}% Battery Health</span>
                </div>
                <span className="text-slate-300 text-[11px] font-medium">{laptop.batteryBackup}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {laptop.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {laptop.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Checklist Card */}
            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-[#F8FAFC] font-black text-xs uppercase tracking-wide">
                <PackageCheck className="w-4 h-4 text-blue-400" />
                <span>12-Point Hardware Stress Test Results</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Display (No dead pixels)</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Keyboard & Trackpad OK</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Original Charger Tested</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Thermal & Fan Stressed</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>All USB / Type-C Ports OK</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>HD Camera & Mic Tested</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Specs Information */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Category */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] leading-snug">
                  {laptop.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Category: <strong className="text-slate-200">{laptop.category}</strong> • Stock Status:{' '}
                  {laptop.stock > 0 ? (
                    <strong className="text-emerald-400 font-bold">{laptop.stock} Units Available</strong>
                  ) : (
                    <strong className="text-rose-400 font-bold">Out of Stock</strong>
                  )}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black text-blue-300 uppercase tracking-wider">Cash & Delivery Offer Price</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#F8FAFC]">
                      {formatPrice(laptop.price, currency, settings.bdtToUsdRate)}
                    </span>
                    {laptop.originalPrice > laptop.price && (
                      <span className="text-sm text-slate-500 line-through font-bold">
                        {formatPrice(laptop.originalPrice, currency, settings.bdtToUsdRate)}
                      </span>
                    )}
                  </div>
                </div>
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black uppercase tracking-wider text-xs">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Detailed Specs Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 p-2.5 bg-[#1E293B]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Processor</span>
                    <span className="col-span-2 font-bold text-[#F8FAFC]">{laptop.processor}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#0F172A]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Generation</span>
                    <span className="col-span-2 text-slate-200">{laptop.generation}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#1E293B]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Memory (RAM)</span>
                    <span className="col-span-2 font-bold text-[#F8FAFC]">{laptop.ram}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#0F172A]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Storage (SSD)</span>
                    <span className="col-span-2 font-bold text-[#F8FAFC]">{laptop.storage}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#1E293B]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Display</span>
                    <span className="col-span-2 text-slate-200">{laptop.display}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#0F172A]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Graphics</span>
                    <span className="col-span-2 text-slate-200">{laptop.graphics}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#1E293B]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Physical Condition</span>
                    <span className="col-span-2 text-slate-200">{laptop.bodyNotes}</span>
                  </div>
                  {laptop.ports && (
                    <div className="grid grid-cols-3 p-2.5 bg-[#0F172A]">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">I/O Ports</span>
                      <span className="col-span-2 text-slate-200">{laptop.ports}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 p-2.5 bg-[#1E293B]">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Warranty</span>
                    <span className="col-span-2 font-black text-cyan-400">{laptop.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Description summary */}
              <p className="text-xs text-slate-300 leading-relaxed bg-[#1E293B] p-3.5 rounded-xl border border-slate-800">
                {laptop.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-2.5 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(laptop);
                    onClose();
                  }}
                  disabled={laptop.stock <= 0}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 border border-slate-700"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onDirectBuy(laptop);
                    onClose();
                  }}
                  disabled={laptop.stock <= 0}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-blue-950/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>অর্ডার করুন (Buy Now)</span>
                </button>
              </div>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp - Ask Showroom Manager about this unit</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
