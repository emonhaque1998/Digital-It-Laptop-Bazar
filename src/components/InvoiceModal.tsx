import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import { Order, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  settings: ShopSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose, settings }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">
              Invoice #{order.id}
            </span>
            <span className="text-xs text-slate-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice (ক্যাশ মেমো)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div className="border border-slate-300 rounded-2xl p-6 space-y-6 bg-white text-slate-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-2 border-slate-900">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {settings.shopName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">{settings.shopNameBn}</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">{settings.address}</p>
              <p className="text-[11px] text-slate-600 font-bold">Hotline: {settings.phone} • WhatsApp: {settings.whatsapp}</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded">
                CASH MEMO / INVOICE
              </span>
              <div className="text-xs font-bold text-slate-900 mt-2">Invoice No: {order.id}</div>
              <div className="text-[11px] text-slate-500">Date: {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Customer Details:</span>
              <div className="font-extrabold text-slate-900 text-sm">{order.customerName}</div>
              <div className="text-slate-700">Phone: {order.phone}</div>
              {order.alternativePhone && <div className="text-slate-500">Alt Phone: {order.alternativePhone}</div>}
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Delivery & Payment:</span>
              <div className="text-slate-800">{order.deliveryAddress}</div>
              <div className="text-slate-600 font-medium">Region: {order.cityDistrict}</div>
              <div className="font-bold text-emerald-700">Payment: {order.paymentMethod}</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-2">SL</th>
                <th className="py-2">Laptop Description & Specs</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => (
                <tr key={item.laptopId} className="py-2">
                  <td className="py-2.5 font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2.5">
                    <div className="font-bold text-slate-900">{item.laptopTitle}</div>
                    <div className="text-[10px] text-slate-500">Brand: {item.laptopBrand} • 15 Days Replacement + 2 Yrs Warranty</div>
                  </td>
                  <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                  <td className="py-2.5 text-right font-medium">৳{item.price.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Totals */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-bold">৳{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-950 font-black text-sm pt-1 border-t-2 border-slate-900">
                <span>Grand Total:</span>
                <span className="text-emerald-700 font-black text-base">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-4">
            <p className="italic">
              * Warranty Policy: 15 Days hardware replacement guarantee against any internal motherboard defect + 2 Years Free Service Warranty. Physical broken, water damage, or burnt parts are excluded from warranty.
            </p>
            <div className="flex justify-between pt-6">
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mx-auto" />
                <span className="font-semibold text-slate-700">Customer Signature</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mx-auto" />
                <span className="font-semibold text-slate-700">Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
