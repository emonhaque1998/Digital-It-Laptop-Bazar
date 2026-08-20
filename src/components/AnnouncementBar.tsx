import React, { useState } from 'react';
import { Sparkles, Phone, MapPin, X } from 'lucide-react';
import { ShopSettings } from '../types';

interface AnnouncementBarProps {
  settings: ShopSettings;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings }) => {
  const [closed, setClosed] = useState(false);

  if (!settings.showAnnouncement || closed) return null;

  return (
    <div id="announcement-bar" className="bg-[#0B1120] text-[#F8FAFC] text-xs sm:text-sm py-2 px-3 sm:px-6 transition-all border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Main highlight message */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-extrabold text-[11px] uppercase tracking-wider shrink-0 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400" />
            Special
          </span>
          <p className="font-semibold text-slate-200 line-clamp-1">
            {settings.announcement}
          </p>
        </div>

        {/* Quick Contact & Location */}
        <div className="flex items-center gap-4 text-xs text-slate-300 shrink-0 font-medium">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>Hotline: <strong className="text-white font-bold">{settings.phone}</strong></span>
          </a>
          <span className="hidden lg:inline-flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="max-w-[240px] truncate">{settings.address.split(',')[0]}</span>
          </span>
          <button
            onClick={() => setClosed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            title="Close announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
