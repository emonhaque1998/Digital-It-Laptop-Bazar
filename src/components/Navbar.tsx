import React, { useState, useEffect, useRef } from 'react';
import {
  Laptop as LaptopIcon,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Phone,
  ShieldCheck,
  Sparkles,
  Package,
  Layers,
  Lock,
  Menu,
  X,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Laptop, OrderItem, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface NavbarProps {
  settings: ShopSettings;
  laptops: Laptop[];
  cart: OrderItem[];
  currency: 'BDT' | 'USD';
  onCurrencyToggle: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenTracking: () => void;
  onOpenComparison: () => void;
  comparedLaptopIds: string[];
  onOpenAIAdvisor: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectLaptop: (laptop: Laptop) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  laptops,
  cart,
  currency,
  onCurrencyToggle,
  onOpenCart,
  onOpenAdmin,
  isAdminLoggedIn,
  onOpenTracking,
  onOpenComparison,
  comparedLaptopIds,
  onOpenAIAdvisor,
  searchQuery,
  onSearchChange,
  onSelectLaptop,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Filtered live results for autocomplete dropdown
  const filteredSuggestions = searchQuery.trim()
    ? laptops.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.processor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <LaptopIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-[#F8FAFC] uppercase">
                    {settings.shopName.split(' ')[0]}
                  </span>
                  <span className="font-black text-lg sm:text-xl text-blue-400 uppercase">
                    {settings.shopName.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span className="text-blue-300 bg-blue-950/70 border border-blue-800/60 px-1.5 py-0.2 rounded font-extrabold text-[10px] uppercase tracking-wider">
                    100% Tested Used
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline font-semibold">{settings.shopNameBn}</span>
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                id="search-laptop-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search laptop by model (ThinkPad, EliteBook, MacBook, Core i5)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-[#F8FAFC] placeholder:text-slate-400 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#1E293B] rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                {filteredSuggestions.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-800">
                    <div className="px-3 py-1.5 text-xs font-black uppercase text-blue-400 tracking-wider">
                      Matching Laptops ({filteredSuggestions.length})
                    </div>
                    {filteredSuggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectLaptop(item);
                          setIsSearchOpen(false);
                        }}
                        className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-800 rounded-lg text-left transition-colors"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-md object-cover bg-slate-900 border border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#F8FAFC] truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium truncate">
                            {item.processor} • {item.ram} • {item.storage}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-blue-400">
                            {formatPrice(item.price, currency, settings.bdtToUsdRate)}
                          </div>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            Grade {item.conditionGrade}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">
                    No laptops found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions & Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Advisor Button */}
            <button
              id="ai-advisor-btn"
              onClick={onOpenAIAdvisor}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-700/60 font-bold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-xs group"
            >
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
              <span>AI Advisor</span>
            </button>

            {/* Compare Button */}
            <button
              id="compare-btn"
              onClick={onOpenComparison}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors"
              title="Compare Laptops"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Compare</span>
              {comparedLaptopIds.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black">
                  {comparedLaptopIds.length}
                </span>
              )}
            </button>

            {/* Order Tracking Button */}
            <button
              id="track-order-btn"
              onClick={onOpenTracking}
              className="hidden sm:inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors"
              title="Track Order Status"
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>Track Order</span>
            </button>

            {/* Currency Toggle */}
            <button
              id="currency-toggle-btn"
              onClick={onCurrencyToggle}
              className="px-2.5 py-1.5 rounded-lg text-xs font-black bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] transition-colors border border-slate-700 uppercase"
              title="Switch Currency (BDT / USD)"
            >
              {currency === 'BDT' ? '৳ BDT' : '$ USD'}
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-blue-500/25 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalItems > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-900 text-[11px] font-black">
                  {cartTotalItems}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden xl:inline text-blue-100 font-bold pl-1 border-l border-blue-400/50">
                  {formatPrice(cartSubtotal, currency, settings.bdtToUsdRate)}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              id="admin-dashboard-btn"
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all ${
                isAdminLoggedIn
                  ? 'bg-blue-950 text-blue-300 border-blue-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title="Admin Inventory Dashboard"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">
                {isAdminLoggedIn ? 'Admin Active' : 'Admin'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops (ThinkPad, HP, Dell, MacBook)..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#1E293B] border border-slate-700 text-[#F8FAFC] placeholder:text-slate-400 text-sm font-medium focus:bg-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-3 shadow-2xl">
          <button
            onClick={() => {
              onOpenAIAdvisor();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-950/60 border border-blue-700/60 text-blue-200 font-bold text-sm uppercase tracking-wide"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>AI Laptop Smart Advisor</span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>

          <button
            onClick={() => {
              onOpenTracking();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 font-bold text-sm uppercase tracking-wide"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              <span>Track Your Order Status</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onOpenComparison();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 font-bold text-sm uppercase tracking-wide"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Compare Laptops ({comparedLaptopIds.length})</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-2 flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(settings.shopName)},%20I%20am%20interested%20in%20buying%20a%20used%20laptop`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-sm font-extrabold uppercase tracking-wide shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-sm font-extrabold uppercase tracking-wide border border-slate-700"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call Hotline</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
