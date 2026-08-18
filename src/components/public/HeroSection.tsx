import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, MapPin, ShieldCheck, Zap, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/serviceCategories';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenEmergencyModal: () => void;
  onOpenPostJobModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onSelectCategory,
  onOpenEmergencyModal,
  onOpenPostJobModal
}) => {
  const { language, t } = useLanguage();
  const { selectedLocation } = useMarketplace();
  const isBn = language === 'bn';

  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative gradient blur bubbles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            <span>
              {isBn
                ? '১০০% এনআইডি ভেরিফাইড কারিগর ও ৭ দিনের ওয়ারেন্টি'
                : '100% NID-Verified Professionals • 7-Day Warranty'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isBn ? (
              <>
                আপনার এলাকার <span className="text-brand-600">বিশ্বস্ত মিস্ত্রি</span> ও সার্ভিস প্রফেশনাল খুঁজুন
              </>
            ) : (
              <>
                Book Trusted <span className="text-brand-600">Service Professionals</span> Across Bangladesh
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {t('taglineSubtitle')}
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="p-2 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-auto sm:flex-1">
                <Search className="w-5 h-5 text-brand-600 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={isBn ? 'যেমন: এসি মেরামত, প্লাম্বার, কার মেকানিক...' : 'e.g. AC servicing, Electrician, Plumber...'}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              {/* Location indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 border-l border-slate-200 text-xs font-semibold text-slate-600 shrink-0">
                <MapPin className="w-4 h-4 text-redaccent-500" />
                <span className="truncate max-w-[120px]">{selectedLocation.thana}</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>{isBn ? 'খুঁজুন' : 'Search'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Categories Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isBn ? 'জনপ্রিয়:' : 'Popular:'}
            </span>
            {SERVICE_CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 shadow-xs transition-all"
              >
                {isBn ? cat.nameBn : cat.name}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80">
            <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-brand-700">10,000+</div>
              <div className="text-xs text-slate-500 font-medium">{isBn ? 'সফল বুকিং' : 'Completed Bookings'}</div>
            </div>
            <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-slate-900">2,500+</div>
              <div className="text-xs text-slate-500 font-medium">{isBn ? 'এনআইডি ভেরিফাইড কারিগর' : 'Verified Pros'}</div>
            </div>
            <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-xs text-slate-500 font-medium">{isBn ? 'গড় কাস্টমার রেটিং' : 'Average Rating'}</div>
            </div>
            <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-600">৮টি বিভাগে</div>
              <div className="text-xs text-slate-500 font-medium">{isBn ? 'দেশব্যাপী কভারেজ' : 'All 8 Divisions'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
