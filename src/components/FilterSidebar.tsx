import React from 'react';
import { Filter, X, RefreshCw, Check, Star, Zap, Cpu, HardDrive } from 'lucide-react';
import { ConditionGrade, LaptopBrand, LaptopCategory } from '../types';

export interface FilterState {
  brand: LaptopBrand | 'ALL';
  category: LaptopCategory | 'ALL';
  conditionGrade: ConditionGrade | 'ALL';
  minPrice: number;
  maxPrice: number;
  minRamGB: number;
  processorFamily: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'battery-desc' | 'newest';
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  availableBrands: LaptopBrand[];
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableBrands,
  totalResults,
}) => {
  const brands: (LaptopBrand | 'ALL')[] = ['ALL', 'Lenovo', 'HP', 'Dell', 'Apple', 'Asus', 'Acer'];
  const categories: (LaptopCategory | 'ALL')[] = [
    'ALL',
    'Business',
    'Ultrabook',
    'Gaming',
    'Budget Student',
    'MacBook'
  ];

  return (
    <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <h3 className="font-black text-[#F8FAFC] text-sm uppercase tracking-wide">Filter Inventory</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
          title="Reset all filters"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Brand Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Brand ({brands.length - 1})
        </label>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((b) => {
            const isSelected = filters.brand === b;
            return (
              <button
                key={b}
                onClick={() => onFilterChange({ ...filters, brand: b })}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {b === 'ALL' ? 'All Brands' : b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Grade */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Physical Condition
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'ALL', label: 'All Grades', sub: 'Any' },
            { id: 'A+', label: 'Grade A+', sub: 'Like New (99%)' },
            { id: 'A', label: 'Grade A', sub: 'Clean (95%)' },
          ].map((grade) => {
            const isSelected = filters.conditionGrade === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => onFilterChange({ ...filters, conditionGrade: grade.id as any })}
                className={`p-2 rounded-xl text-center text-xs transition-all border ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300 font-black ring-1 ring-blue-500'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 font-bold'
                }`}
              >
                <div className="truncate uppercase font-black">{grade.label}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate">{grade.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Laptop Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const isSelected = filters.category === c;
            return (
              <button
                key={c}
                onClick={() => onFilterChange({ ...filters, category: c })}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {c === 'ALL' ? 'All Types' : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Price Budget (BDT)
          </label>
          <span className="text-xs font-black text-blue-400">
            ৳{filters.minPrice.toLocaleString()} - ৳{filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="15000"
          max="90000"
          step="2500"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex flex-wrap gap-1 pt-1">
          {[
            { label: 'Under 30k', max: 30000 },
            { label: 'Under 45k', max: 45000 },
            { label: 'Under 65k', max: 65000 },
            { label: 'All Range', max: 90000 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onFilterChange({ ...filters, minPrice: 15000, maxPrice: preset.max })}
              className={`px-2 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors ${
                filters.maxPrice === preset.max
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* RAM Requirement */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Minimum RAM
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 8, 16].map((ram) => {
            const isSelected = filters.minRamGB === ram;
            return (
              <button
                key={ram}
                onClick={() => onFilterChange({ ...filters, minRamGB: ram })}
                className={`py-1.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider text-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {ram === 0 ? 'Any RAM' : `${ram}GB+`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="pt-2 text-center text-xs font-bold text-slate-400 border-t border-slate-800 uppercase tracking-wide">
        Found <strong className="text-white font-black">{totalResults}</strong> matching used laptops
      </div>
    </div>
  );
};
