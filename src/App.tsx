import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Layers,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown,
  Search,
  Filter,
  CheckCircle2,
  Package,
  Home,
  ShoppingCart,
  X
} from 'lucide-react';
import { Laptop, LaptopBrand, Order, OrderItem, ShopSettings } from './types';
import {
  getStoredLaptops,
  getStoredOrders,
  getStoredSettings
} from './utils/storage';
import {
  fetchLaptops,
  fetchOrders,
  fetchSettings,
  apiSaveLaptop,
  apiDeleteLaptop,
  apiCreateOrder,
  apiUpdateOrderStatus,
  apiSaveSettings,
} from './utils/api';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterSidebar, FilterState } from './components/FilterSidebar';
import { LaptopCard } from './components/LaptopCard';
import { LaptopDetailModal } from './components/LaptopDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LaptopComparisonModal } from './components/LaptopComparisonModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

const INITIAL_FILTER_STATE: FilterState = {
  brand: 'ALL',
  category: 'ALL',
  conditionGrade: 'ALL',
  minPrice: 15000,
  maxPrice: 90000,
  minRamGB: 0,
  processorFamily: 'ALL',
  sortBy: 'featured',
};

export default function App() {
  // State from storage
  const [laptops, setLaptops] = useState<Laptop[]>(getStoredLaptops);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [settings, setSettings] = useState<ShopSettings>(getStoredSettings);

  // Cart & Commerce
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('laptophat_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [comparedLaptopIds, setComparedLaptopIds] = useState<string[]>([]);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modals
  const [selectedLaptopDetails, setSelectedLaptopDetails] = useState<Laptop | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialId, setTrackingInitialId] = useState('');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Fetch data from Neon PostgreSQL backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadNeonData() {
      try {
        const [remoteLaptops, remoteOrders, remoteSettings] = await Promise.all([
          fetchLaptops(),
          fetchOrders(),
          fetchSettings(),
        ]);
        if (isMounted) {
          if (remoteLaptops && remoteLaptops.length > 0) setLaptops(remoteLaptops);
          if (remoteOrders) setOrders(remoteOrders);
          if (remoteSettings) setSettings(remoteSettings);
        }
      } catch (err) {
        console.warn('Initial Neon DB fetch failed, utilizing cached storage:', err);
      }
    }
    loadNeonData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('laptophat_cart_v1', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // Cart actions
  const handleAddToCart = (laptop: Laptop) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.laptopId === laptop.id);
      if (existing) {
        return prev.map((item) =>
          item.laptopId === laptop.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          laptopId: laptop.id,
          laptopTitle: laptop.title,
          laptopBrand: laptop.brand,
          price: laptop.price,
          quantity: 1,
          image: laptop.images[0],
          ram: laptop.ram,
          storage: laptop.storage,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleDirectBuy = (laptop: Laptop) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.laptopId === laptop.id);
      if (existing) {
        return prev;
      }
      return [
        {
          laptopId: laptop.id,
          laptopTitle: laptop.title,
          laptopBrand: laptop.brand,
          price: laptop.price,
          quantity: 1,
          image: laptop.images[0],
          ram: laptop.ram,
          storage: laptop.storage,
        },
      ];
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (laptopId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(laptopId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.laptopId === laptopId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (laptopId: string) => {
    setCart((prev) => prev.filter((item) => item.laptopId !== laptopId));
  };

  const handleOrderSuccess = (order: Order) => {
    // Deduct stock for ordered laptops
    setLaptops((prev) =>
      prev.map((lap) => {
        const orderItem = order.items.find((i) => i.laptopId === lap.id);
        if (orderItem) {
          return {
            ...lap,
            stock: Math.max(0, lap.stock - orderItem.quantity),
          };
        }
        return lap;
      })
    );

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setOrderSuccess(order);

    // Save directly to Neon PostgreSQL database
    apiCreateOrder(order);
  };

  // Compare actions
  const handleToggleCompare = (laptopId: string) => {
    setComparedLaptopIds((prev) => {
      if (prev.includes(laptopId)) {
        return prev.filter((id) => id !== laptopId);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 laptops at a time.');
        return prev;
      }
      return [...prev, laptopId];
    });
  };

  // Admin inventory actions
  const handleSaveLaptop = (laptop: Laptop) => {
    setLaptops((prev) => {
      const idx = prev.findIndex((l) => l.id === laptop.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = laptop;
        return updated;
      }
      return [laptop, ...prev];
    });
    // Persist to Neon DB
    apiSaveLaptop(laptop);
  };

  const handleDeleteLaptop = (laptopId: string) => {
    setLaptops((prev) => prev.filter((l) => l.id !== laptopId));
    // Persist delete to Neon DB
    apiDeleteLaptop(laptopId);
  };

  const handleUpdateLaptopStock = (laptopId: string, delta: number) => {
    setLaptops((prev) =>
      prev.map((l) => {
        if (l.id === laptopId) {
          const updated = { ...l, stock: Math.max(0, l.stock + delta) };
          apiSaveLaptop(updated);
          return updated;
        }
        return l;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    // Persist status change to Neon DB
    apiUpdateOrderStatus(orderId, status);
  };

  const handleSaveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    // Persist settings to Neon DB
    apiSaveSettings(newSettings);
  };

  // Filter & Search computation
  const filteredLaptops = laptops.filter((laptop) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        laptop.title.toLowerCase().includes(q) ||
        laptop.brand.toLowerCase().includes(q) ||
        laptop.processor.toLowerCase().includes(q) ||
        laptop.category.toLowerCase().includes(q) ||
        laptop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Brand filter
    if (filters.brand !== 'ALL' && laptop.brand !== filters.brand) {
      return false;
    }

    // Category filter
    if (filters.category !== 'ALL' && laptop.category !== filters.category) {
      return false;
    }

    // Condition grade
    if (filters.conditionGrade !== 'ALL' && laptop.conditionGrade !== filters.conditionGrade) {
      return false;
    }

    // Price range
    if (laptop.price < filters.minPrice || laptop.price > filters.maxPrice) {
      return false;
    }

    // RAM filter
    if (filters.minRamGB > 0) {
      const ramNum = parseInt(laptop.ram) || 0;
      if (ramNum < filters.minRamGB) return false;
    }

    return true;
  });

  // Sorting
  const sortedLaptops = [...filteredLaptops].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'battery-desc') return b.batteryHealth - a.batteryHealth;
    if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default: featured first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const comparedLaptops = laptops.filter((l) => comparedLaptopIds.includes(l.id));

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Announcement bar */}
      <AnnouncementBar settings={settings} />

      {/* Main Navbar */}
      <Navbar
        settings={settings}
        laptops={laptops}
        cart={cart}
        currency={currency}
        onCurrencyToggle={() => setCurrency((c) => (c === 'BDT' ? 'USD' : 'BDT'))}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenTracking={() => {
          setTrackingInitialId('');
          setIsTrackingOpen(true);
        }}
        onOpenComparison={() => setIsComparisonOpen(true)}
        comparedLaptopIds={comparedLaptopIds}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectLaptop={setSelectedLaptopDetails}
      />

      {/* Hero Banner with Value Proposition & Trust Badges */}
      <HeroBanner
        onSelectBrand={(b) => setFilters((f) => ({ ...f, brand: b }))}
        onSelectQuickCategory={(cat) => setFilters((f) => ({ ...f, category: cat as any }))}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        totalLaptopsCount={laptops.length}
      />

      {/* Main Catalog View */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12 flex-1 w-full space-y-6 pb-28 lg:pb-12">
        {/* Results Header & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1E293B] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-xl font-black text-[#F8FAFC] uppercase tracking-wide">
                In-Stock Used Laptops
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-700/60 text-blue-300 text-xs font-black uppercase tracking-wider">
                {sortedLaptops.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              100% Genuine imported • 15 Days Replacement • Cash on Delivery with QC
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] border border-slate-700 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Filter ({filters.brand === 'ALL' ? 'All Brands' : filters.brand})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-[#F8FAFC] text-xs font-extrabold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="battery-desc">Highest Battery Health</option>
                <option value="newest">Newly Uploaded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              availableBrands={['Lenovo', 'Apple', 'Dell', 'HP', 'Asus', 'Acer']}
              totalResults={sortedLaptops.length}
            />
          </div>

          {/* Mobile Filter Modal / Drawer Overlay */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 lg:hidden animate-in fade-in">
              <div className="bg-[#0F172A] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-400" />
                    <h3 className="font-black text-white text-sm uppercase tracking-wide">Filter Inventory</h3>
                  </div>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
                  availableBrands={['Lenovo', 'Apple', 'Dell', 'HP', 'Asus', 'Acer']}
                  totalResults={sortedLaptops.length}
                />
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wide shadow-lg"
                >
                  Show {sortedLaptops.length} Laptops
                </button>
              </div>
            </div>
          )}

          {/* Laptops Cards Grid */}
          <div className="lg:col-span-9">
            {sortedLaptops.length === 0 ? (
              <div className="bg-[#1E293B] rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#F8FAFC] uppercase tracking-wide">
                  No used laptops match your filters
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing some filters (brand, budget, or grade) to view our full collection of tested laptops.
                </p>
                <button
                  onClick={() => {
                    setFilters(INITIAL_FILTER_STATE);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {sortedLaptops.map((laptop) => (
                  <LaptopCard
                    key={laptop.id}
                    laptop={laptop}
                    currency={currency}
                    bdtToUsdRate={settings.bdtToUsdRate}
                    onViewDetails={setSelectedLaptopDetails}
                    onAddToCart={handleAddToCart}
                    onDirectBuy={handleDirectBuy}
                    isCompared={comparedLaptopIds.includes(laptop.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button (WhatsApp & Compare) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-2.5 items-end">
        {comparedLaptopIds.length > 0 && (
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-2xl border border-blue-400/50 cursor-pointer animate-bounce"
          >
            <Layers className="w-4 h-4" />
            <span>Compare ({comparedLaptopIds.length})</span>
          </button>
        )}

        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(settings.shopName)},%20I%20am%20interested%20in%20buying%20a%20used%20laptop`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 sm:p-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
          title="Chat with sales executive on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline text-xs font-black pr-1 uppercase tracking-wide">WhatsApp Chat</span>
        </a>
      </div>

      {/* Mobile & Tablet Bottom Sticky Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 lg:hidden px-2 py-2 flex items-center justify-around text-slate-400">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white"
        >
          <Home className="w-5 h-5 text-blue-400" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white relative"
        >
          <Filter className="w-5 h-5 text-blue-400" />
          <span>Filters</span>
          {filters.brand !== 'ALL' && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setIsAIAdvisorOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider text-cyan-300 hover:text-white"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>AI Match</span>
        </button>

        <button
          onClick={() => setIsComparisonOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white relative"
        >
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Compare</span>
          {comparedLaptopIds.length > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[9px] flex items-center justify-center font-black">
              {comparedLaptopIds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white relative"
        >
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] flex items-center justify-center font-black">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <Footer settings={settings} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* All Modal Overlays */}
      <LaptopDetailModal
        laptop={selectedLaptopDetails}
        onClose={() => setSelectedLaptopDetails(null)}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
        currency={currency}
        settings={settings}
        isCompared={selectedLaptopDetails ? comparedLaptopIds.includes(selectedLaptopDetails.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsCheckoutOpen(true)}
        currency={currency}
        settings={settings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
        currency={currency}
        settings={settings}
      />

      <OrderSuccessModal
        order={orderSuccess}
        onClose={() => setOrderSuccess(null)}
        onTrackOrder={(orderId) => {
          setTrackingInitialId(orderId);
          setIsTrackingOpen(true);
        }}
        currency={currency}
        settings={settings}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderId={trackingInitialId}
        currency={currency}
        settings={settings}
      />

      <LaptopComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedLaptops={comparedLaptops}
        onRemoveFromCompare={(id) => setComparedLaptopIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
        currency={currency}
        settings={settings}
      />

      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        inventory={laptops}
        onSelectLaptop={setSelectedLaptopDetails}
        currency={currency}
        settings={settings}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        laptops={laptops}
        orders={orders}
        settings={settings}
        onSaveLaptop={handleSaveLaptop}
        onDeleteLaptop={handleDeleteLaptop}
        onUpdateLaptopStock={handleUpdateLaptopStock}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onSaveSettings={handleSaveSettings}
        currency={currency}
        isAdminLoggedIn={isAdminLoggedIn}
        onSetAdminLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}
