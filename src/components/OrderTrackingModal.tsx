import React, { useState } from 'react';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId = '',
  currency,
  settings,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialOrderId);
  const [searched, setSearched] = useState(Boolean(initialOrderId));

  const matchedOrder = orders.find(
    (o) =>
      o.id.toLowerCase() === query.trim().toLowerCase() ||
      o.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
  );

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Pending', label: 'Order Placed', desc: 'Order received in system' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Verified by showroom agent' },
    { key: 'Quality Checked', label: 'QC Passed', desc: 'Display, thermal & battery tested' },
    { key: 'Shipped', label: 'Shipped / In Transit', desc: 'Handed to courier / delivery rider' },
    { key: 'Delivered', label: 'Delivered', desc: 'Warranty coverage active' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Quality Checked': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = matchedOrder ? getStepIndex(matchedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-blue-400" />
            <h3 className="font-black text-[#F8FAFC] text-lg uppercase tracking-wide">
              Track Your Used Laptop Order (অর্ডার ট্র্যাকিং)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && setSearched(true)}
              placeholder="Enter Order ID (e.g. ORD-98241) or Phone (01712...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-[#1E293B] text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            onClick={() => setSearched(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide transition-colors cursor-pointer"
          >
            Track
          </button>
        </div>

        {/* Results */}
        {searched && !matchedOrder && (
          <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-800 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="font-black text-white text-sm uppercase tracking-wide">No order found</p>
            <p className="text-xs text-slate-400 font-medium">
              Please check your Order ID (e.g. ORD-98241) or phone number and try again.
            </p>
          </div>
        )}

        {matchedOrder && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-blue-300 uppercase tracking-wider">Current Order Status</span>
                <div className="text-lg font-black text-white mt-0.5 uppercase tracking-wide">
                  {matchedOrder.status === 'Cancelled' ? 'Order Cancelled' : matchedOrder.status}
                </div>
              </div>
              <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-blue-600 text-white">
                {matchedOrder.id}
              </span>
            </div>

            {/* Timeline Milestones */}
            {matchedOrder.status !== 'Cancelled' && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Delivery Progress Timeline
                </h4>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.key} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[#0F172A] ${
                            isCompleted
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-slate-700'
                          }`}
                        >
                          {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-black uppercase tracking-wide ${
                                isCurrent
                                  ? 'text-cyan-400'
                                  : isCompleted
                                  ? 'text-[#F8FAFC]'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-600/40 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items Info */}
            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 text-xs space-y-2 font-medium">
              <div className="font-bold text-slate-200">Customer: {matchedOrder.customerName} ({matchedOrder.phone})</div>
              <div className="text-slate-400">Address: {matchedOrder.deliveryAddress}</div>
              <div className="divide-y divide-slate-800 pt-2">
                {matchedOrder.items.map((i) => (
                  <div key={i.laptopId} className="py-1.5 flex justify-between">
                    <span className="font-bold text-slate-300 truncate max-w-xs">{i.laptopTitle}</span>
                    <span className="font-black text-blue-400">{formatPrice(i.price, currency, settings.bdtToUsdRate)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline contact */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Need quick assistance?</span>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20LaptopHat,%20inquiring%20about%20my%20Order%20${matchedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black uppercase tracking-wide text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
