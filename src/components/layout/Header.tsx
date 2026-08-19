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
  PlusCircle,
  KeyRound,
  LogOut
} from 'lucide-react';
import { SERVICE_ITEMS } from '../../data/serviceCategories';

interface HeaderProps {
  onNavigateTab: (tab: string) => void;
  activeTab: string;
  onOpenEmergencyModal: () => void;
  onOpenPostJobModal: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateTab,
  activeTab,
  onOpenEmergencyModal,
  onOpenPostJobModal,
  onOpenAuthModal
}) => {
  const { persona, currentUser, setPersona, logout } = useAuth();
  const { language, t } = useLanguage();
  const { bookings } = useMarketplace();
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
    <header className="no-print bg-white border-b border-slate-200 sticky top-[28px] sm:top-7 z-40 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2 text-left group"
            >
              {/* Bangladesh-inspired circular logo */}
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <div className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-redaccent-500 -top-1 -right-1 opacity-90" />
                <span className="font-black text-base sm:text-xl tracking-tighter relative z-10">SM</span>
              </div>
              <div>
                <div className="font-black text-base sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                  {isBn ? 'সার্ভিস মেন' : 'Service Men'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-brand-600 leading-tight mt-0.5 hidden xs:block">
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 24/7 Emergency Dispatch SOS Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-red-50 hover:bg-red-100 text-redaccent-500 border border-red-200 text-xs font-black transition-all shadow-xs shrink-0"
              title="24/7 Emergency Plumber, Electrician or Mechanic Dispatch"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-redaccent-500 fill-redaccent-500 shrink-0" />
              <span className="hidden sm:inline">{isBn ? 'জরুরি সেবা' : 'Emergency 24/7'}</span>
              <span className="sm:hidden font-extrabold text-[10px]">SOS</span>
            </button>

            {/* Post a Job Button */}
            <button
              onClick={onOpenPostJobModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{isBn ? 'জব পোস্ট' : 'Post a Job'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => onNavigateTab(persona === 'provider' ? 'requests' : 'bookings')}
              className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
              title="Notifications & Bookings"
            >
              <Bell className="w-4 h-4" />
              {pendingBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-redaccent-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Pill */}
            {currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all shrink-0 text-left group"
                title="Click to Switch Credentials / Logout"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border-2 border-brand-500 shadow-xs shrink-0"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">
                    {isBn ? (currentUser.nameBn || currentUser.name) : currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 capitalize">
                    {currentUser.role} • {currentUser.thana}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>{isBn ? 'লগইন' : 'Login'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 md:hidden shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 px-1">
            {/* Mobile Auth Button */}
            <button
              onClick={() => { onOpenAuthModal?.(); setMobileMenuOpen(false); }}
              className="w-full p-2.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between text-brand-900 font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand-600" />
                <span>{currentUser ? `${currentUser.name} (${currentUser.role})` : (isBn ? 'লগইন / রেজিস্টার করুন' : 'Sign In with Credentials')}</span>
              </div>
              <span className="text-[10px] text-brand-600 font-bold uppercase">{currentUser ? 'Switch' : 'Sign In'}</span>
            </button>

            {/* Mobile Search Bar */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              {/* Mobile Auto-suggest dropdown */}
              {showSearchDropdown && filteredServices.length > 0 && (
                <div className="mt-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-2 max-h-60 overflow-y-auto">
                  {filteredServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => {
                        onNavigateTab('services');
                        setShowSearchDropdown(false);
                        setMobileMenuOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-brand-50 flex items-center justify-between text-left"
                    >
                      <div className="text-xs font-bold text-slate-800">
                        {isBn ? service.nameBn : service.name}
                      </div>
                      <span className="text-[11px] font-bold text-brand-600">
                        ৳{service.basePrice}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <LocationSelector compact />

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-bold text-left flex items-center gap-2 ${
                  activeTab === 'home' ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span>🏠</span>
                <span>{t('navHome')}</span>
              </button>
              <button
                onClick={() => { onNavigateTab('services'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-bold text-left flex items-center gap-2 ${
                  activeTab === 'services' ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span>🛠️</span>
                <span>{t('navServices')}</span>
              </button>
              <button
                onClick={() => { onNavigateTab('bookings'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-bold text-left flex items-center gap-2 ${
                  activeTab === 'bookings' ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span>📋</span>
                <span>{t('navBookings')}</span>
              </button>
              <button
                onClick={() => { onOpenPostJobModal(); setMobileMenuOpen(false); }}
                className="p-2.5 bg-slate-900 text-white rounded-xl font-bold text-left flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-brand-400" />
                <span>{t('postAJob')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
