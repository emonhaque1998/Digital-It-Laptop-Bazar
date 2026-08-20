import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Cpu,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Laptop, ShopSettings } from '../types';
import { formatPrice } from '../utils/currency';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Laptop[];
  onSelectLaptop: (laptop: Laptop) => void;
  currency: 'BDT' | 'USD';
  settings: ShopSettings;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onSelectLaptop,
  currency,
  settings,
}) => {
  if (!isOpen) return null;

  const [budget, setBudget] = useState('35000');
  const [purpose, setPurpose] = useState('Programming, Web Development & Multitasking');
  const [preferredBrand, setPreferredBrand] = useState('Any');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    recommendation: string;
    suggestedLaptopIds: string[];
    tips: string[];
  } | null>(null);

  const handleAskAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userBudget: budget,
          purpose,
          preferredBrand,
          inventory,
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      // Fallback smart client-side matching algorithm
      const budgetNum = Number(budget) || 40000;
      const matched = inventory.filter(l => l.price <= budgetNum + 5000);
      const topIds = (matched.length > 0 ? matched : inventory).slice(0, 2).map(l => l.id);

      setAiResult({
        recommendation: `For your budget around ৳${Number(budget).toLocaleString()} and purpose of "${purpose}", we recommend looking at reliable business-grade laptops like Lenovo ThinkPad or HP EliteBook. These offer superior keyboard ergonomics, metal reinforced durability, and easily upgradeable RAM & SSD compared to consumer laptops.`,
        suggestedLaptopIds: topIds,
        tips: [
          'Choose minimum 16GB RAM if you do programming, video editing, or heavy Chrome browsing.',
          'NVMe M.2 SSD makes boot time under 8 seconds and system response instant.',
          'Grade A+ units provide 95%+ battery health and pristine physical appearance.'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedLaptops = inventory.filter(
    (l) => aiResult?.suggestedLaptopIds?.includes(l.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#1E293B] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/50 flex items-center justify-center text-cyan-400 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-wide">
                স্মার্ট ল্যাপটপ পরামর্শক (AI Advisor)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Powered by Gemini AI • Personalized Used Laptop Matcher
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Question Inputs */}
          <div className="space-y-4 bg-[#1E293B] p-5 rounded-2xl border border-slate-800">
            {/* Budget */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Your Approximate Budget (BDT ৳)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 35000"
                  className="w-40 px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-bold text-white bg-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['25000', '35000', '45000', '65000'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors ${
                        budget === b
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0F172A] text-slate-300 border border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      ৳{Number(b).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Primary Purpose / Usage (কী কাজের জন্য ল্যাপটপ খুঁজছেন?)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Programming & Coding (VS Code, Python, Web)',
                  'Freelancing, Office & MS Excel Work',
                  'Graphic Design (Photoshop, Illustrator)',
                  'Video Editing & 3D (Premiere Pro, Blender)',
                  'University Study & High Battery Backup',
                  'Gaming & High Performance (RTX / GTX)',
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                      purpose === p
                        ? 'border-blue-500 bg-blue-950/60 text-cyan-300 font-bold ring-1 ring-blue-500'
                        : 'border-slate-700 bg-[#0F172A] text-slate-300 font-medium hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Preference */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Brand Preference
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Any', 'Lenovo ThinkPad', 'Apple MacBook', 'HP EliteBook', 'Dell Latitude / XPS', 'Asus'].map((br) => (
                  <button
                    key={br}
                    onClick={() => setPreferredBrand(br)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-colors ${
                      preferredBrand === br
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-[#0F172A] text-slate-300 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wide text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Inventory with AI...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Get AI Recommendation (পরামর্শ নিন)</span>
                </div>
              )}
            </button>
          </div>

          {/* AI Output Box */}
          {aiResult && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2">
              {/* Recommendation text */}
              <div className="p-5 rounded-2xl bg-[#1E293B] border border-blue-900/60 text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                <div className="flex items-center gap-2 font-black text-cyan-400 text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Expert Assessment</span>
                </div>
                <p>{aiResult.recommendation}</p>
              </div>

              {/* Tips */}
              {aiResult.tips && aiResult.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wide text-amber-400">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Key Tips for Your Purchase:</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-amber-200/90 font-medium">
                    {aiResult.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Matching Laptops in Store */}
              {suggestedLaptops.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Recommended In-Stock Laptops ({suggestedLaptops.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedLaptops.map((lap) => (
                      <div
                        key={lap.id}
                        onClick={() => {
                          onSelectLaptop(lap);
                          onClose();
                        }}
                        className="p-3 bg-[#1E293B] rounded-2xl border border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex gap-3 items-center group"
                      >
                        <img
                          src={lap.images[0]}
                          alt={lap.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-blue-950 text-cyan-300 border border-blue-800">
                            Grade {lap.conditionGrade}
                          </span>
                          <h5 className="text-xs font-bold text-[#F8FAFC] truncate mt-1 group-hover:text-blue-400">
                            {lap.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 truncate">{lap.ram} • {lap.storage}</p>
                          <div className="text-xs font-black text-blue-400 mt-1">
                            {formatPrice(lap.price, currency, settings.bdtToUsdRate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
