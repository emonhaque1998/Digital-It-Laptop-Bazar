import React from 'react';
import {
  Laptop as LaptopIcon,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Truck,
  MessageSquare,
  Lock
} from 'lucide-react';
import { ShopSettings } from '../types';

interface FooterProps {
  settings: ShopSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/50">
                <LaptopIcon className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-[#F8FAFC] tracking-tight uppercase">
                {settings.shopName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              {settings.tagline}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 border border-slate-700 text-[#F8FAFC] text-xs font-black uppercase tracking-wider transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Links & Categories */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-black text-xs uppercase tracking-wider">
              Popular Used Brands
            </h4>
            <ul className="space-y-2 font-medium text-slate-300">
              <li>Lenovo ThinkPad T & X1 Carbon Series</li>
              <li>Apple MacBook Air & Pro (M1 / M2 / Retina)</li>
              <li>HP EliteBook & ProBook Business Laptops</li>
              <li>Dell Latitude & XPS 13 / 15 Ultrabooks</li>
              <li>ASUS TUF & ROG Gaming Series</li>
            </ul>
          </div>

          {/* Showroom & Hours */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-black text-xs uppercase tracking-wider">
              Showroom Location
            </h4>
            <div className="space-y-2.5 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{settings.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-black text-xs uppercase tracking-wider">
              Hotline & Support
            </h4>
            <div className="space-y-2.5">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-[#F8FAFC] hover:text-blue-400 font-extrabold"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#F8FAFC] hover:text-emerald-400 font-extrabold"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
              <p className="text-[11px] text-slate-400 pt-1 font-medium">
                Cash on Delivery available all over Bangladesh with courier inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} {settings.shopName}. All rights reserved.</p>
          <div className="flex items-center gap-4 uppercase font-bold text-slate-400">
            <span>15 Days Replacement Policy</span>
            <span>•</span>
            <span>2 Years Free Service Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
