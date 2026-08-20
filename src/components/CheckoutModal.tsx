import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Building,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderItem, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onOrderSuccess: (order: Order) => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  currency,
  settings,
}) => {
  if (!isOpen || items.length === 0) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cityDistrict, setCityDistrict] = useState('Dhaka City (Home Delivery)');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Nagad' | 'Store Pickup (Showroom)'>('Cash on Delivery');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery Fee calculation
  let deliveryFee = settings.deliveryFeeInsideDhaka;
  if (cityDistrict === 'Store Pickup (Showroom)') {
    deliveryFee = 0;
  } else if (cityDistrict.includes('Outside') || cityDistrict !== 'Dhaka City (Home Delivery)') {
    deliveryFee = settings.deliveryFeeOutsideDhaka;
  }

  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name (আপনার নাম লিখুন)');
      return;
    }

    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 11) {
      setErrorMsg('Please enter a valid 11-digit mobile number (e.g. 01712-345678)');
      return;
    }

    if (cityDistrict !== 'Store Pickup (Showroom)' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter your complete delivery address (ঠিকানা লিখুন)');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      alternativePhone: altPhone.trim() || undefined,
      deliveryAddress: cityDistrict === 'Store Pickup (Showroom)' ? `Showroom Pickup: ${settings.address}` : deliveryAddress.trim(),
      cityDistrict,
      deliveryNotes: deliveryNotes.trim() || undefined,
      paymentMethod,
      items: [...items],
      subtotal,
      deliveryFee,
      discount: 0,
      total: grandTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#1E293B]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 border border-blue-600/40 flex items-center justify-center font-black">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-[#F8FAFC] text-base sm:text-lg uppercase tracking-wide">
                অর্ডার নিশ্চিতকরণ (Order Checkout)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                15 Days Replacement • Pay on Delivery with Inspection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-600 text-rose-200 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Customer & Address details */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Customer & Delivery Information
              </h4>

              {/* Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name (আপনার নাম) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#1E293B] text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone & Alt Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                    Mobile Number (মোবাইল) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712-345678"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#1E293B] text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                    Alternative Phone (বিকল্প নম্বর)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="01911-000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#1E293B] text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* City / District */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                  Delivery Region / City <span className="text-rose-400">*</span>
                </label>
                <select
                  value={cityDistrict}
                  onChange={(e) => setCityDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm bg-[#1E293B] text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dhaka City (Home Delivery)" className="bg-[#1E293B]">Dhaka City (Home Delivery - ৳120)</option>
                  <option value="Outside Dhaka - Chattogram" className="bg-[#1E293B]">Chattogram (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Sylhet" className="bg-[#1E293B]">Sylhet (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Rajshahi" className="bg-[#1E293B]">Rajshahi (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Khulna" className="bg-[#1E293B]">Khulna (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Barishal" className="bg-[#1E293B]">Barishal (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Rangpur" className="bg-[#1E293B]">Rangpur (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Mymensingh" className="bg-[#1E293B]">Mymensingh (Courier Parcel - ৳250)</option>
                  <option value="Outside Dhaka - Other District" className="bg-[#1E293B]">Other Districts in Bangladesh (৳250)</option>
                  <option value="Store Pickup (Showroom)" className="bg-[#1E293B]">Showroom Pickup (Multiplan Center, Dhaka - Free)</option>
                </select>
              </div>

              {/* Address */}
              {cityDistrict !== 'Store Pickup (Showroom)' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                    Delivery Address (বাসা/রোড/এলাকার ঠিকানা) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. House 14, Road 5, Block B, Banasree, Rampura"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                  Payment Method (পেমেন্ট পদ্ধতি)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Cash on Delivery', title: 'Cash on Delivery', sub: 'Pay after checking' },
                    { id: 'bKash / Nagad', title: 'bKash / Nagad', sub: 'Mobile Banking' },
                    { id: 'Store Pickup (Showroom)', title: 'Showroom Pay', sub: 'Pay at Counter' },
                  ].map((pay) => (
                    <button
                      type="button"
                      key={pay.id}
                      onClick={() => setPaymentMethod(pay.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === pay.id
                          ? 'border-blue-500 bg-blue-950/80 text-white font-black ring-1 ring-blue-500'
                          : 'border-slate-800 bg-[#1E293B] text-slate-300 font-bold hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-black uppercase tracking-wide text-xs">{pay.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{pay.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                  Special Notes / Delivery Time Instruction (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 5 PM / call before coming"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right: Order Summary & Review */}
            <div className="lg:col-span-5 bg-[#1E293B] p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Order Summary ({items.length} Laptop)
                </h4>

                {/* Selected Laptops */}
                <div className="divide-y divide-slate-800 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.laptopId} className="py-2.5 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold text-[#F8FAFC] truncate">
                          {item.laptopTitle}
                        </div>
                        <div className="text-[11px] text-blue-400 font-black">
                          Qty: {item.quantity} × {formatPrice(item.price, currency, settings.bdtToUsdRate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free gifts highlight */}
                <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-200 text-xs space-y-1">
                  <div className="font-black flex items-center gap-1.5 uppercase tracking-wide text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Gifts Included:</span>
                  </div>
                  <ul className="text-[11px] list-disc list-inside text-slate-300 font-medium">
                    <li>Original 65W Power Charger</li>
                    <li>Quality Laptop Backpack</li>
                    <li>Wireless / Optical Mouse</li>
                    <li>15 Days Replacement Guarantee Card</li>
                  </ul>
                </div>

                {/* Pricing Calculation */}
                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span className="uppercase tracking-wider text-[11px]">Laptops Subtotal</span>
                    <span className="font-black text-[#F8FAFC]">
                      {formatPrice(subtotal, currency, settings.bdtToUsdRate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span className="uppercase tracking-wider text-[11px]">Delivery Charge</span>
                    <span className="font-black text-[#F8FAFC]">
                      {deliveryFee === 0 ? 'Free (Pickup)' : formatPrice(deliveryFee, currency, settings.bdtToUsdRate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                    <span className="uppercase tracking-wider">Total Payable</span>
                    <span className="text-blue-400 font-black text-lg">
                      {formatPrice(grandTotal, currency, settings.bdtToUsdRate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-blue-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Place Order (অর্ডার নিশ্চিত করুন)'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  🔒 No advance required for Cash on Delivery in Dhaka.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
