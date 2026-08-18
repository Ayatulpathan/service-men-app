import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../../data/serviceCategories';
import { ServiceItem, Provider } from '../../types';
import { formatBDT } from '../../utils/currency';
import {
  Search,
  Filter,
  Zap,
  Star,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Tag,
  Clock,
  Wrench
} from 'lucide-react';

interface ServiceDirectoryProps {
  initialCategoryId?: string;
  initialQuery?: string;
  onBookService: (service: ServiceItem, provider?: Provider) => void;
  onSelectProvider: (provider: Provider) => void;
}

export const ServiceDirectory: React.FC<ServiceDirectoryProps> = ({
  initialCategoryId,
  initialQuery = '',
  onBookService,
  onSelectProvider
}) => {
  const { language, t } = useLanguage();
  const { providers, selectedLocation } = useMarketplace();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'services' | 'providers'>('services');

  // Filter Services
  const filteredServices = SERVICE_ITEMS.filter(item => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (onlyEmergency && !item.isEmergency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q) || item.nameBn.includes(q);
      const matchDesc = item.description.toLowerCase().includes(q) || item.descriptionBn.includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // Filter Providers
  const filteredProviders = providers.filter(p => {
    if (onlyEmergency && !p.emergencyReady) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || p.nameBn.includes(q);
      const matchSkill = p.skills.some(s => s.toLowerCase().includes(q));
      const matchArea = p.serviceArea.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchSkill && !matchArea) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isBn ? 'সকল সার্ভিস ও ভেরিফাইড প্রোভাইডার তালিকা' : 'Browse Services & Verified Specialists'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              📍 {selectedLocation.area}, {selectedLocation.thana}, {selectedLocation.district}
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl self-start">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সার্ভিসসমূহ' : 'Services'} ({filteredServices.length})
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'providers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'মিস্ত্রি ও টেকনিশিয়ান' : 'Specialists'} ({filteredProviders.length})
            </button>
          </div>
        </div>

        {/* Search & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'সার্ভিস বা টেকনিশিয়ানের নাম দিয়ে খুঁজুন...' : 'Search by service name, skills or area...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:outline-none"
            >
              <option value="all">{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {isBn ? cat.nameBn : cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Emergency 24/7 Filter Toggle */}
          <div className="sm:col-span-3 flex items-center justify-between sm:justify-center gap-2 p-2 bg-red-50/60 rounded-2xl border border-red-200">
            <span className="text-xs font-bold text-red-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-red-600" />
              <span>{isBn ? 'জরুরি ২৪/৭' : '24/7 SOS'}</span>
            </span>
            <input
              type="checkbox"
              checked={onlyEmergency}
              onChange={e => setOnlyEmergency(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* View Content: SERVICES */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {service.isEmergency && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        24/7 SOS
                      </span>
                    )}
                    {service.popular && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900">
                  {isBn ? service.nameBn : service.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {isBn ? service.descriptionBn : service.description}
                </p>

                {/* Features */}
                <div className="mt-3 space-y-1">
                  {(isBn ? service.featuresBn : service.features).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Book CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    {service.priceType === 'fixed' ? 'Fixed Price' : service.priceType === 'hourly' ? 'Hourly Rate' : 'Starting From'}
                  </div>
                  <div className="text-lg font-black text-brand-700">
                    {formatBDT(service.basePrice, language)}
                  </div>
                </div>

                <button
                  onClick={() => onBookService(service)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>{isBn ? 'বুক করুন' : 'Book Service'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Content: PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map(provider => (
            <div
              key={provider.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{isBn ? provider.nameBn : provider.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{provider.serviceArea.join(', ')}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-800">
                      ★ {provider.rating} <span className="text-slate-400">({provider.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {isBn ? provider.bioBn : provider.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {provider.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Base Charge</div>
                  <div className="text-base font-black text-brand-700">{formatBDT(provider.startingPrice || 500, language)}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProvider(provider)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onBookService(SERVICE_ITEMS[0], provider)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Hire Pro
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
