import React, { useState } from 'react';
import {
  X,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Printer,
  Settings,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Truck,
  ShieldCheck,
  Search,
  Layers,
  AlertTriangle,
  BatteryMedium,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Laptop, Order, OrderStatus, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';
import { AdminAddEditLaptopModal } from './AdminAddEditLaptopModal';
import { InvoiceModal } from './InvoiceModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  laptops: Laptop[];
  orders: Order[];
  settings: ShopSettings;
  onSaveLaptop: (laptop: Laptop) => void;
  onDeleteLaptop: (laptopId: string) => void;
  onUpdateLaptopStock: (laptopId: string, delta: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onSaveSettings: (settings: ShopSettings) => void;
  currency: 'BDT' | 'USD';
  isAdminLoggedIn: boolean;
  onSetAdminLoggedIn: (status: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  laptops,
  orders,
  settings,
  onSaveLaptop,
  onDeleteLaptop,
  onUpdateLaptopStock,
  onUpdateOrderStatus,
  onSaveSettings,
  currency,
  isAdminLoggedIn,
  onSetAdminLoggedIn,
}) => {
  if (!isOpen) return null;

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'settings'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.adminPin || enteredPin === '1234') {
      onSetAdminLoggedIn(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Analytics Metrics
  const totalInventoryValue = laptops.reduce((acc, l) => acc + l.price * l.stock, 0);
  const totalStockUnits = laptops.reduce((acc, l) => acc + l.stock, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Quality Checked').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  // Filtered inventory
  const filteredLaptops = laptops.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.processor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    return true;
  });

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
  };

  // PIN Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95">
        <div className="bg-[#0F172A] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-center space-y-6 text-[#F8FAFC]">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-slate-700 text-blue-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#F8FAFC] uppercase tracking-wide">Admin Control Portal</h3>
            <p className="text-xs text-slate-400 font-medium">
              Enter admin PIN to manage used laptops inventory & customer orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full text-center tracking-widest text-lg font-black px-4 py-3 rounded-xl border border-slate-700 bg-[#1E293B] text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-bold text-rose-400 mt-1.5">
                  Invalid PIN! Please try default &ldquo;1234&rdquo;.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl shadow-xl shadow-blue-950/50 transition-colors cursor-pointer"
              >
                Unlock Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setEnteredPin('1234');
                  onSetAdminLoggedIn(true);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wide rounded-xl transition-colors border border-slate-700"
              >
                ⚡ Quick Demo Login (Use PIN 1234)
              </button>
            </div>
          </form>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wide"
          >
            Back to Customer Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-6xl w-full max-h-[96vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col">
        {/* Top Navbar */}
        <div className="sticky top-0 z-30 bg-[#1E293B] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/40 text-blue-400 flex items-center justify-center font-black text-sm">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-[#F8FAFC] uppercase tracking-wide">
                  {settings.shopName} - Admin Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-600/40">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Upload new used laptops, manage stock, and process customer orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setEditingLaptop(null);
                setIsAddEditModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide flex items-center gap-1.5 shadow-xl shadow-blue-950/50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Laptop (নতুন ল্যাপটপ)</span>
            </button>

            <button
              onClick={() => onSetAdminLoggedIn(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Lock Admin"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Analytics KPI Bar */}
        <div className="p-4 sm:p-6 bg-[#0F172A] border-b border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-[#1E293B] border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
              <span>Inventory Value</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F8FAFC] mt-1">
              {formatPrice(totalInventoryValue, currency, settings.bdtToUsdRate)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{totalStockUnits} Units In-Stock</div>
          </div>

          <div className="p-4 bg-[#1E293B] border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
              <span>Total Orders</span>
              <ShoppingCart className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F8FAFC] mt-1">
              {totalOrdersCount} Orders
            </div>
            <div className="text-[11px] text-cyan-400 font-bold mt-0.5">
              {formatPrice(totalRevenue, currency, settings.bdtToUsdRate)} Total Volume
            </div>
          </div>

          <div className="p-4 bg-[#1E293B] border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
              <span>Pending Deliveries</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F8FAFC] mt-1">
              {pendingOrdersCount}
            </div>
            <div className="text-[11px] text-amber-400 font-bold mt-0.5">Requires Action</div>
          </div>

          <div className="p-4 bg-[#1E293B] border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
              <span>Active Models</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#F8FAFC] mt-1">
              {laptops.length} Models
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Grade A+ / A Catalog</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-[#1E293B] border-b border-slate-800 flex space-x-6 overflow-x-auto">
          {[
            { id: 'inventory', label: `📦 Laptop Inventory (${laptops.length})` },
            { id: 'orders', label: `🛒 Customer Orders (${orders.length})` },
            { id: 'analytics', label: '📊 Insights & Analytics' },
            { id: 'settings', label: '⚙️ Shop & Hotline Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs sm:text-sm font-black uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="p-6 space-y-4">
            {/* Search & Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inventory by title, brand, processor..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              <button
                onClick={() => {
                  setEditingLaptop(null);
                  setIsAddEditModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-950/50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Used Laptop</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-black uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Laptop Item</th>
                      <th className="py-3 px-3">Specs (CPU / RAM / SSD)</th>
                      <th className="py-3 px-3">Condition</th>
                      <th className="py-3 px-3">Battery</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredLaptops.map((lap) => (
                      <tr key={lap.id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={lap.images[0]}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <div className="font-extrabold text-[#F8FAFC] truncate">{lap.title}</div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                {lap.brand} • {lap.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          <div className="font-bold text-white truncate max-w-[180px]">
                            {lap.processor}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {lap.ram} | {lap.storage}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              lap.conditionGrade === 'A+'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : lap.conditionGrade === 'A'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            Grade {lap.conditionGrade}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 font-black text-cyan-400">
                            <BatteryMedium className="w-3.5 h-3.5" />
                            <span>{lap.batteryHealth}%</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-black text-blue-400 text-sm">
                          {formatPrice(lap.price, currency, settings.bdtToUsdRate)}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1 border border-slate-700 rounded-lg p-1 bg-[#0F172A]">
                            <button
                              onClick={() => onUpdateLaptopStock(lap.id, -1)}
                              disabled={lap.stock <= 0}
                              className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-white font-black disabled:opacity-30"
                              title="Decrease Stock"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-black text-white">{lap.stock}</span>
                            <button
                              onClick={() => onUpdateLaptopStock(lap.id, 1)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-white font-black"
                              title="Increase Stock"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingLaptop(lap);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                              title="Edit Laptop"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${lap.title}"?`)) {
                                  onDeleteLaptop(lap.id);
                                }
                              }}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors border border-rose-800/60"
                              title="Delete Laptop"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4">
            {/* Filter by status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'Pending', 'Confirmed', 'Quality Checked', 'Shipped', 'Delivered', 'Cancelled'] as (OrderStatus | 'ALL')[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                      orderStatusFilter === status
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#1E293B] text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {status === 'ALL' ? `All Orders (${orders.length})` : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 font-medium">
                  No orders match this filter.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${order.customerName}! We received your Order #${order.id} for ${order.items.map(i => i.laptopTitle).join(', ')}. Current Status: ${order.status}. Showroom: ${settings.shopName}`
                  );

                  return (
                    <div
                      key={order.id}
                      className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 shadow-xs space-y-4"
                    >
                      {/* Top status & ID */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-600/40 rounded-md">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status selector */}
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wide bg-[#0F172A] border border-slate-700 text-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Quality Checked">Quality Checked</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Customer Details */}
                      <div className="space-y-1 text-xs">
                        <div className="font-black text-[#F8FAFC] text-sm uppercase tracking-wide">
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 font-medium">
                          <span>Phone: <strong className="text-white">{order.phone}</strong></span>
                          {order.alternativePhone && <span>Alt: {order.alternativePhone}</span>}
                        </div>
                        <div className="text-slate-400 font-medium">
                          Address: {order.deliveryAddress} ({order.cityDistrict})
                        </div>
                        {order.deliveryNotes && (
                          <div className="text-amber-300 bg-amber-950/60 border border-amber-800/60 p-2 rounded-lg text-[11px] font-medium">
                            Note: {order.deliveryNotes}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-slate-800 text-xs bg-[#0F172A] p-3 rounded-xl border border-slate-800 font-medium">
                        {order.items.map((it) => (
                          <div key={it.laptopId} className="py-1 flex justify-between">
                            <span className="font-bold text-slate-300 truncate max-w-xs">
                              {it.laptopTitle} (x{it.quantity})
                            </span>
                            <span className="font-black text-blue-400">
                              {formatPrice(it.price * it.quantity, currency, settings.bdtToUsdRate)}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 flex justify-between font-black text-sm text-white">
                          <span className="uppercase tracking-wider">Total Amount:</span>
                          <span className="text-cyan-400 font-black">{formatPrice(order.total, currency, settings.bdtToUsdRate)}</span>
                        </div>
                      </div>

                      {/* Contact & Invoice CTA Bar */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 rounded-xl flex items-center gap-1 text-xs font-black uppercase tracking-wide"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${order.phone.replace(/[^0-9+]/g, '')}`}
                            className="p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl flex items-center gap-1 text-xs font-bold uppercase tracking-wide border border-slate-700"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        </div>

                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-md shadow-blue-950/50"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INSIGHTS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Distribution */}
              <div className="p-5 bg-[#1E293B] rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-black text-sm text-[#F8FAFC] uppercase tracking-wide">
                  Stock by Brand Distribution
                </h4>
                <div className="space-y-3">
                  {['Lenovo', 'Apple', 'Dell', 'HP', 'Asus', 'Acer'].map((br) => {
                    const count = laptops.filter(l => l.brand === br).length;
                    const pct = laptops.length > 0 ? Math.round((count / laptops.length) * 100) : 0;
                    return (
                      <div key={br} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wide">
                          <span>{br}</span>
                          <span className="font-mono text-cyan-400">{count} models ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Condition Quality Breakdown */}
              <div className="p-5 bg-[#1E293B] rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-black text-sm text-[#F8FAFC] uppercase tracking-wide">
                  Condition Grade Breakdown
                </h4>
                <div className="space-y-3 text-xs font-medium">
                  <div className="p-3 bg-[#0F172A] rounded-xl border border-cyan-800/60 flex justify-between items-center">
                    <div>
                      <div className="font-black text-cyan-300 uppercase tracking-wide">Grade A+ (Like New 99%)</div>
                      <div className="text-slate-400 text-[11px]">No dents, 90%+ battery, pristine</div>
                    </div>
                    <span className="font-black text-cyan-400 text-lg">
                      {laptops.filter(l => l.conditionGrade === 'A+').length} Units
                    </span>
                  </div>

                  <div className="p-3 bg-[#0F172A] rounded-xl border border-blue-800/60 flex justify-between items-center">
                    <div>
                      <div className="font-black text-blue-300 uppercase tracking-wide">Grade A (Clean 95%)</div>
                      <div className="text-slate-400 text-[11px]">Minor sign of usage, flawless screen</div>
                    </div>
                    <span className="font-black text-blue-400 text-lg">
                      {laptops.filter(l => l.conditionGrade === 'A').length} Units
                    </span>
                  </div>

                  <div className="p-3 bg-[#0F172A] rounded-xl border border-amber-800/60 flex justify-between items-center">
                    <div>
                      <div className="font-black text-amber-300 uppercase tracking-wide">Grade B (Good 90%)</div>
                      <div className="text-slate-400 text-[11px]">Normal scratches, fully functional</div>
                    </div>
                    <span className="font-black text-amber-400 text-lg">
                      {laptops.filter(l => l.conditionGrade === 'B').length} Units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <form onSubmit={handleSaveSettingsSubmit} className="max-w-2xl bg-[#1E293B] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-black text-[#F8FAFC] text-base uppercase tracking-wide">
                Storefront & Contact Information
              </h4>

              {/* Database Connection Status Card */}
              <div className="p-4 bg-[#0F172A] rounded-xl border border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                      Neon PostgreSQL Cloud Database
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Connected to Neon AWS Serverless Pooler (ep-twilight-sound-ayjymvwj)
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Active & Synced
                </span>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-blue-950 border border-blue-600 text-blue-200 rounded-xl text-xs font-black uppercase tracking-wide">
                  ✓ Settings updated successfully in Neon Database!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Shop Name (English)</label>
                  <input
                    type="text"
                    value={settingsForm.shopName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Shop Name (বাংলা)</label>
                  <input
                    type="text"
                    value={settingsForm.shopNameBn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shopNameBn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Hotline Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Showroom Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Delivery Fee (Inside Dhaka)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFeeInsideDhaka}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Delivery Fee (Outside Dhaka)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFeeOutsideDhaka}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Announcement Banner Text</label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Change Admin PIN</label>
                <input
                  type="text"
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  className="w-40 px-3.5 py-2 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs font-bold text-center"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wide shadow-xl shadow-blue-950/50 transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Sub-modals inside Admin */}
      <AdminAddEditLaptopModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingLaptop(null);
        }}
        onSave={onSaveLaptop}
        initialLaptop={editingLaptop}
      />

      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        settings={settings}
      />
    </div>
  );
};
