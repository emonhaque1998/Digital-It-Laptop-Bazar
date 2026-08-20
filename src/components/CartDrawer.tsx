import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Gift,
  Zap
} from 'lucide-react';
import { OrderItem, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (laptopId: string, quantity: number) => void;
  onRemoveItem: (laptopId: string) => void;
  onCheckout: () => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency,
  settings,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-[#0F172A] text-[#F8FAFC] h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h3 className="font-black text-[#F8FAFC] text-base uppercase tracking-wide">Shopping Cart</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-600/40 text-xs font-black uppercase tracking-wider">
              {items.reduce((sum, i) => sum + i.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Gifts Banner */}
        <div className="bg-blue-950/90 text-blue-200 px-4 py-2.5 text-xs flex items-center gap-2 border-b border-blue-900 font-medium">
          <Gift className="w-4 h-4 text-blue-400 shrink-0" />
          <span><strong className="text-white font-bold">Free Package:</strong> Laptop Backpack + Optical Mouse + Power Adapter with each unit!</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="font-black text-[#F8FAFC] text-sm uppercase tracking-wide">Your cart is currently empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
                Explore our used and refurbished laptop collection and add your favorite device!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wide"
              >
                Browse Laptops
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.laptopId}
                className="p-3 bg-[#1E293B] border border-slate-800 rounded-2xl flex items-center gap-3 relative"
              >
                <img
                  src={item.image}
                  alt={item.laptopTitle}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {item.laptopBrand}
                  </span>
                  <h4 className="text-xs font-extrabold text-[#F8FAFC] truncate">
                    {item.laptopTitle}
                  </h4>
                  <div className="text-xs font-black text-blue-400 mt-1">
                    {formatPrice(item.price, currency, settings.bdtToUsdRate)}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-700 rounded-xl bg-[#0F172A] overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.laptopId, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 font-bold"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.laptopId, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 font-bold"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.laptopId)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-[#1E293B] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400 font-medium">
                <span className="uppercase font-bold tracking-wider text-[11px]">Subtotal</span>
                <span className="font-black text-[#F8FAFC] text-sm">
                  {formatPrice(subtotal, currency, settings.bdtToUsdRate)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium">
                <span className="uppercase font-bold tracking-wider text-[11px]">Warranty Coverage</span>
                <span className="font-bold text-cyan-400">Included (Free)</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium">
                <span className="uppercase font-bold tracking-wider text-[11px]">Delivery</span>
                <span className="font-bold text-slate-300">Calculated at checkout</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-blue-950/50 transition-all cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করুন (Proceed to Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
