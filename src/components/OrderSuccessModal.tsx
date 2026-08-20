import React from 'react';
import {
  CheckCircle,
  MessageSquare,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Order, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
  currency,
  settings,
}) => {
  if (!order) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello ${settings.shopName}! I just placed an order:\nOrder ID: ${order.id}\nCustomer: ${order.customerName} (${order.phone})\nTotal: ৳${order.total}\nItems: ${order.items.map(i => `${i.laptopTitle} (x${i.quantity})`).join(', ')}\nPlease confirm and prepare my package!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-center space-y-6">
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-950 border border-blue-600/50 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-950/60">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-cyan-300 font-black uppercase text-xs tracking-wider">
            🎉 Order Placed Successfully!
          </span>
          <h2 className="text-2xl font-black text-white pt-2 uppercase tracking-wide">
            ধন্যবাদ, {order.customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
            Your used laptop order has been received. Our sales executive will call you at{' '}
            <strong className="text-white font-bold">{order.phone}</strong> for quick dispatch confirmation.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1E293B] rounded-2xl p-4 sm:p-5 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-black uppercase tracking-wider">Order Tracking ID</span>
            <span className="font-mono font-black text-sm bg-blue-950 text-cyan-300 border border-blue-700 px-2.5 py-0.5 rounded-lg">
              {order.id}
            </span>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.laptopId} className="flex justify-between items-center">
                <span className="font-bold text-slate-200 truncate max-w-[240px]">
                  {item.laptopTitle} (x{item.quantity})
                </span>
                <span className="font-black text-white">
                  {formatPrice(item.price * item.quantity, currency, settings.bdtToUsdRate)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm">
            <span className="text-slate-300 uppercase tracking-wide">Total Payable:</span>
            <span className="text-blue-400 font-black text-base">
              {formatPrice(order.total, currency, settings.bdtToUsdRate)}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Delivery: {order.cityDistrict} • Payment: {order.paymentMethod}
          </div>
        </div>

        {/* WhatsApp & Tracking Direct Actions */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm Faster on WhatsApp (WhatsApp-এ কনফার্ম করুন)</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-black uppercase tracking-wide text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Track Status</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wide text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-950/50"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
