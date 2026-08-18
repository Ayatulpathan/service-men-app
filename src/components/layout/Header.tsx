import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LocationSelector } from '../common/LocationSelector';
import {
  Search,
  Zap,
  Bell,
  User as UserIcon,
  Menu,
  X,
  PhoneCall,
  PlusCircle,
  Briefcase,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { SERVICE_ITEMS } from '../../data/serviceCategories';

interface HeaderProps {
  onNavigateTab: (tab: string) => void;
  activeTab: string;
  onOpenEmergencyModal: () => void;
  onOpenPostJobModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateTab,
  activeTab,
  onOpenEmergencyModal,
  onOpenPostJobModal
}) => {
  const { persona, currentUser, setPersona } = useAuth();
  const { language, t } = useLanguage();
  const { bookings, jobPosts } = useMarketplace();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter services for quick search dropdown
  const filteredServices = searchQuery.trim()
    ? SERVICE_ITEMS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameBn.includes(searchQuery) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const pendingBookingsCount = bookings.filter(b => b.status === 'requested' || b.status === 'on_the_way').length;

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-7 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              {/* Bangladesh-inspired circular logo */}
              <div className="relative w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <div className="absolute w-5 h-5 rounded-full bg-redaccent-500 -top-1 -right-1 opacity-90" />
                <span className="font-black text-xl tracking-tighter relative z-10">SM</span>
              </div>
              <div>
                <div className="font-black text-xl text-slate-900 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                  {isBn ? 'সার্ভিস মেন' : 'Service Men'}
                </div>
                <div className="text-[11px] font-semibold text-brand-600 leading-tight mt-0.5">
                  {isBn ? 'বিশ্বস্ত সেবা প্ল্যাটফর্ম' : 'On-Demand Services BD'}
                </div>
              </div>
            </button>

            {/* Location Selector */}
            <div className="hidden lg:block">
              <LocationSelector />
            </div>
          </div>

          {/* 2. Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Auto-suggest dropdown */}
            {showSearchDropdown && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 max-h-72 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  {isBn ? 'পরামর্শকৃত সার্ভিস' : 'Matching Services'}
                </div>
                {filteredServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      onNavigateTab('services');
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-brand-50 flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {isBn ? service.nameBn : service.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[280px]">
                        {isBn ? service.descriptionBn : service.description}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                      ৳{service.basePrice}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Action Buttons & Persona Specific Nav */}
          <div className="flex items-center gap-2.5">
            {/* 24/7 Emergency Dispatch SOS Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-redaccent-500 border border-red-200 text-xs font-black transition-all shadow-xs animate-pulse"
              title="24/7 Emergency Plumber, Electrician or Mechanic Dispatch"
            >
              <Zap className="w-4 h-4 text-redaccent-500 fill-redaccent-500" />
              <span className="hidden sm:inline">{isBn ? 'জরুরি সেবা' : 'Emergency 24/7'}</span>
            </button>

            {/* Post a Job Button */}
            <button
              onClick={onOpenPostJobModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-brand-400" />
              <span>{isBn ? 'জব পোস্ট' : 'Post a Job'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => onNavigateTab(persona === 'provider' ? 'requests' : 'bookings')}
              className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Notifications & Bookings"
            >
              <Bell className="w-4 h-4" />
              {pendingBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-redaccent-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border-2 border-brand-500 shadow-xs"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {isBn ? (currentUser.nameBn || currentUser.name) : currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 capitalize">
                    {currentUser.role} • {currentUser.thana}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setPersona('customer')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন / সাইন আপ' : 'Login / Register'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <LocationSelector compact />
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <button
                onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-slate-50 rounded-xl font-bold text-left"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => { onNavigateTab('services'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-slate-50 rounded-xl font-bold text-left"
              >
                {t('navServices')}
              </button>
              <button
                onClick={() => { onNavigateTab('bookings'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-slate-50 rounded-xl font-bold text-left"
              >
                {t('navBookings')}
              </button>
              <button
                onClick={() => { onOpenPostJobModal(); setMobileMenuOpen(false); }}
                className="p-2.5 bg-brand-50 text-brand-900 rounded-xl font-bold text-left"
              >
                {t('postAJob')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
