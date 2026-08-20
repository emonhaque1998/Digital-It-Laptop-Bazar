import React from 'react';
import { X, Layers, Trash2, ShoppingCart, Zap, Check, BatteryMedium } from 'lucide-react';
import { Laptop, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface LaptopComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedLaptops: Laptop[];
  onRemoveFromCompare: (laptopId: string) => void;
  onAddToCart: (laptop: Laptop) => void;
  onDirectBuy: (laptop: Laptop) => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const LaptopComparisonModal: React.FC<LaptopComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedLaptops,
  onRemoveFromCompare,
  onAddToCart,
  onDirectBuy,
  currency,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#1E293B]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h3 className="font-black text-[#F8FAFC] text-lg uppercase tracking-wide">
              Compare Used Laptops Side-by-Side ({comparedLaptops.length}/3)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto">
          {comparedLaptops.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-black uppercase text-slate-300">No laptops selected for comparison</p>
              <p className="text-xs text-slate-400">
                Click &ldquo;Compare&rdquo; on any laptop card to see their specifications side-by-side.
              </p>
            </div>
          ) : (
            <div className="min-w-[600px] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
              {/* Product Header Row */}
              <div className="grid grid-cols-4 bg-[#1E293B] p-4 gap-4 items-start">
                <div className="font-black text-xs uppercase tracking-wider text-slate-400 self-center">
                  Product Overview
                </div>
                {comparedLaptops.map((laptop) => (
                  <div key={laptop.id} className="space-y-2 relative">
                    <button
                      onClick={() => onRemoveFromCompare(laptop.id)}
                      className="absolute -top-1 -right-1 p-1 bg-[#0F172A] border border-slate-700 text-slate-400 hover:text-rose-400 rounded-full shadow-xs cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={laptop.images[0]}
                      alt={laptop.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover rounded-xl border border-slate-700"
                    />
                    <h4 className="text-xs font-bold text-[#F8FAFC] line-clamp-2">
                      {laptop.title}
                    </h4>
                    <div className="text-sm font-black text-blue-400">
                      {formatPrice(laptop.price, currency, settings.bdtToUsdRate)}
                    </div>
                  </div>
                ))}
                {/* Empty slots placeholders */}
                {Array.from({ length: 3 - comparedLaptops.length }).map((_, i) => (
                  <div key={i} className="border-2 border-dashed border-slate-700 rounded-xl h-44 flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs font-medium">
                    <span>+ Add another laptop to compare</span>
                  </div>
                ))}
              </div>

              {/* Specs Rows */}
              {[
                { label: 'Condition Grade', render: (l: Laptop) => <span className="font-black text-cyan-400 uppercase">Grade {l.conditionGrade}</span> },
                { label: 'Processor', render: (l: Laptop) => <span className="text-slate-300 font-medium">{l.processor}</span> },
                { label: 'RAM Memory', render: (l: Laptop) => <strong className="text-white font-black">{l.ram}</strong> },
                { label: 'Storage (SSD)', render: (l: Laptop) => <strong className="text-white font-black">{l.storage}</strong> },
                { label: 'Display Screen', render: (l: Laptop) => <span className="text-slate-300 font-medium">{l.display}</span> },
                { label: 'Graphics', render: (l: Laptop) => <span className="text-slate-300 font-medium">{l.graphics}</span> },
                {
                  label: 'Battery Health & Backup',
                  render: (l: Laptop) => (
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <BatteryMedium className="w-4 h-4" />
                      <span>{l.batteryHealth}% ({l.batteryBackup})</span>
                    </div>
                  )
                },
                { label: 'Physical Condition', render: (l: Laptop) => <span className="text-slate-300">{l.bodyNotes}</span> },
                { label: 'Warranty Terms', render: (l: Laptop) => <span className="text-blue-400 font-semibold">{l.warranty}</span> },
              ].map((row, idx) => (
                <div key={row.label} className={`grid grid-cols-4 p-3.5 text-xs gap-4 ${idx % 2 === 0 ? 'bg-[#0F172A]' : 'bg-[#1E293B]'}`}>
                  <div className="font-black uppercase tracking-wider text-slate-400">{row.label}</div>
                  {comparedLaptops.map((laptop) => (
                    <div key={laptop.id} className="text-slate-200">
                      {row.render(laptop)}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedLaptops.length }).map((_, i) => (
                    <div key={i} className="text-slate-500 font-mono">-</div>
                  ))}
                </div>
              ))}

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 p-4 bg-[#1E293B] gap-4">
                <div className="font-black text-xs uppercase tracking-wider text-slate-400 self-center">
                  Direct Buy / Cart
                </div>
                {comparedLaptops.map((laptop) => (
                  <div key={laptop.id} className="space-y-1.5">
                    <button
                      onClick={() => {
                        onDirectBuy(laptop);
                        onClose();
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-wide text-xs flex items-center justify-center gap-1 shadow-lg shadow-blue-950/50 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(laptop)}
                      className="w-full py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-black uppercase tracking-wide text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
