import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatBDT } from '../../utils/currency';
import {
  Wrench,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ProviderDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, activeProviderId } = useAuth();
  const { language, t } = useLanguage();
  const { providers, bookings, jobPosts, updateProviderAvailability } = useMarketplace();
  const isBn = language === 'bn';

  const currentProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  const providerBookings = bookings.filter(b => b.providerId === currentProvider.id);
  const pendingRequests = providerBookings.filter(b => b.status === 'requested');
  const activeJobs = providerBookings.filter(b => b.status === 'accepted' || b.status === 'on_the_way' || b.status === 'service_started');
  const completedJobs = providerBookings.filter(b => b.status === 'service_completed' || b.status === 'payment_completed');

  return (
    <div className="space-y-6">
      {/* Welcome & Online Status Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentProvider.avatar}
            alt={currentProvider.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">
                {isBn ? currentProvider.nameBn : currentProvider.name}
              </h2>
              {currentProvider.nidStatus === 'verified' && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Pro
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentProvider.serviceArea.join(', ')} • {currentProvider.experienceYears} Years Experience
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">
              {currentProvider.isAvailable ? (isBn ? 'ডিউটিতে সক্রিয়' : 'Online & Receiving Jobs') : (isBn ? 'অফলাইন' : 'Offline')}
            </div>
            <div className="text-[10px] text-slate-400">
              {currentProvider.isAvailable ? 'Ready for instant dispatch' : 'Paused new bookings'}
            </div>
          </div>
          <button
            onClick={() => updateProviderAvailability(currentProvider.id, !currentProvider.isAvailable)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              currentProvider.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                currentProvider.isAvailable ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            {isBn ? 'মোট আয়' : 'Total Earnings'}
          </div>
          <div className="text-2xl font-black text-brand-700 mt-1">
            {formatBDT(currentProvider.earnings.total, language)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% this week
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            {isBn ? 'নতুন অনুরোধ' : 'Pending Requests'}
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {pendingRequests.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Requires action
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            {isBn ? 'চলমান কাজ' : 'Active In-Progress'}
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {activeJobs.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Scheduled today
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            {isBn ? 'কাস্টমার রেটিং' : 'Customer Rating'}
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
            {currentProvider.rating} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {currentProvider.reviewCount} verified reviews
          </div>
        </div>
      </div>

      {/* Quick Actions & Open Job Leads Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Jobs / Incoming Requests list */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900">
              {isBn ? 'সাম্প্রতিক কাজের অনুরোধ' : 'Incoming Jobs & Active Work'}
            </h3>
            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View All ➔
            </button>
          </div>

          {providerBookings.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No bookings assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {providerBookings.slice(0, 3).map(bk => (
                <div
                  key={bk.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{bk.id}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        {bk.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 mt-0.5">{bk.serviceName}</div>
                    <div className="text-xs text-slate-500">Customer: {bk.customerName} ({bk.location.thana})</div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-brand-700">{formatBDT(bk.totalAmount, language)}</div>
                    <button
                      onClick={() => onNavigateTab('requests')}
                      className="mt-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Links / Open Leads */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-base text-slate-900">
            {isBn ? 'ওপেন জব লিডস ও বিডিং' : 'Open Customer Job Tenders'}
          </h3>
          <p className="text-xs text-slate-500">
            {isBn ? 'কাস্টমারদের পোস্ট করা কাস্টম কাজে কোটেশন পাঠিয়ে নতুন কাজ পান' : 'Submit competitive bids on open customer job tenders'}
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Available Tenders:</span>
              <span className="font-black text-sm text-amber-900">{jobPosts.length} Leads</span>
            </div>
            <button
              onClick={() => onNavigateTab('bidding')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              Browse Open Leads & Bid
            </button>
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => onNavigateTab('earnings')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-between"
            >
              <span>Earnings & bKash Withdrawal</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigateTab('verification')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-between"
            >
              <span>NID & Document Verification</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
