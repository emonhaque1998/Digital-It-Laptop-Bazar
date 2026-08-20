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
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-lg w-full max-w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4 md:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <button
              onClick={() => {
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 sm:gap-2.5 text-left group min-w-0 cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <LaptopIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <span className="font-black text-sm sm:text-lg md:text-xl tracking-tight text-[#F8FAFC] uppercase truncate">
                    {settings.shopName.split(' ')[0]}
                  </span>
                  <span className="font-black text-sm sm:text-lg md:text-xl text-blue-400 uppercase truncate">
                    {settings.shopName.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400">
                  <span className="text-blue-300 bg-blue-950/70 border border-blue-800/60 px-1.5 py-0.2 rounded font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider shrink-0">
                    Used Laptops
                  </span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="hidden sm:inline font-semibold text-slate-400 truncate">{settings.shopNameBn}</span>
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
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* AI Advisor Button (Desktop) */}
            <button
              id="ai-advisor-btn"
              onClick={onOpenAIAdvisor}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-700/60 font-bold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-xs group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
              <span>AI Advisor</span>
            </button>

            {/* Compare Button (Tablet & Desktop) */}
            <button
              id="compare-btn"
              onClick={onOpenComparison}
              className="hidden sm:inline-flex relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer"
              title="Compare Laptops"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Compare</span>
              {comparedLaptopIds.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black">
                  {comparedLaptopIds.length}
                </span>
              )}
            </button>

            {/* Order Tracking Button (Desktop) */}
            <button
              id="track-order-btn"
              onClick={onOpenTracking}
              className="hidden lg:inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer"
              title="Track Order Status"
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>Track Order</span>
            </button>

            {/* Currency Toggle */}
            <button
              id="currency-toggle-btn"
              onClick={onCurrencyToggle}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-black bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] transition-colors border border-slate-700 uppercase cursor-pointer shrink-0"
              title="Switch Currency (BDT / USD)"
            >
              {currency === 'BDT' ? '৳' : '$'}<span className="hidden sm:inline ml-0.5">{currency}</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-blue-500/25 transition-all cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden md:inline">Cart</span>
              {cartTotalItems > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-blue-900 text-[10px] sm:text-[11px] font-black">
                  {cartTotalItems}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden xl:inline text-blue-100 font-bold pl-1 border-l border-blue-400/50">
                  {formatPrice(cartSubtotal, currency, settings.bdtToUsdRate)}
                </span>
              )}
            </button>

            {/* Admin Portal Button (Desktop & Tablet) */}
            <button
              id="admin-dashboard-btn"
              onClick={onOpenAdmin}
              className={`hidden sm:inline-flex p-2 rounded-xl border items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all cursor-pointer shrink-0 ${
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
              className="md:hidden p-2 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops (ThinkPad, HP, Dell, M1)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-[#F8FAFC] placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-2.5 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              onOpenAIAdvisor();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-950/60 border border-blue-700/60 text-blue-200 font-black text-xs uppercase tracking-wide cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Laptop Matcher</span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>

          <button
            onClick={() => {
              onOpenTracking();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wide cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Track Order Status</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onOpenComparison();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wide cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Compare Laptops ({comparedLaptopIds.length})</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wide cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin Management Dashboard {isAdminLoggedIn && '• Logged In'}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <div className="pt-2 flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(settings.shopName)},%20I%20am%20interested%20in%20buying%20a%20used%20laptop`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wide shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wide border border-slate-700"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
