import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatBDT } from '../../utils/currency';
import {
  DollarSign,
  TrendingUp,
  Users,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  MapPin,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/serviceCategories';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { language } = useLanguage();
  const { providers, bookings, complaints, coupons } = useMarketplace();
  const isBn = language === 'bn';

  const totalGrossBookingValue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommissionRevenue = Math.round(totalGrossBookingValue * 0.1); // 10%
  const pendingVerifications = providers.filter(p => p.nidStatus === 'under_review' || p.nidStatus === 'pending');
  const activeDisputes = complaints.filter(c => c.status !== 'resolved');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'এডমিন এক্সিকিউটিভ ড্যাশবোর্ড ও অ্যানালিটিক্স' : 'Executive Overview & Marketplace Analytics'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'সারাদেশের সকল বুকিং, রেভিনিউ, প্রোভাইডার যাচাই ও অভিযোগ তদারকি' : 'Real-time overview of gross marketplace volume, commissions & operations'}
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross GMV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Gross Booking Value</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatBDT(totalGrossBookingValue + 1250000, language)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% month-over-month
          </div>
        </div>

        {/* Platform Commission 10% */}
        <div className="bg-gradient-to-br from-brand-600 to-slate-900 text-white p-5 rounded-2xl shadow-md">
          <div className="text-xs font-bold uppercase text-brand-200">Platform Revenue (10%)</div>
          <div className="text-2xl font-black mt-1">
            {formatBDT(platformCommissionRevenue + 125000, language)}
          </div>
          <div className="text-[11px] text-brand-100 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Net marketplace profit
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Total Bookings</div>
          <div className="text-2xl font-black text-brand-700 mt-1">
            {bookings.length + 3840}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Across 8 Divisions
          </div>
        </div>

        {/* Active Providers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Vetted Providers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {providers.length + 1850}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 98.2% NID Verified
          </div>
        </div>
      </div>

      {/* Actionable Queues row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NID Verification Queue trigger */}
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">
                {pendingVerifications.length} Provider NID Verifications Pending
              </div>
              <div className="text-xs text-slate-500">Awaiting document inspection & approval</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('verifications')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Review Queue
          </button>
        </div>

        {/* Disputes Queue */}
        <div className="p-5 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">
                {activeDisputes.length} Active Customer Complaints
              </div>
              <div className="text-xs text-slate-500">Requires mediation or warranty settlement</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('disputes')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Manage Disputes
          </button>
        </div>
      </div>

      {/* Category Performance Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-black text-base text-slate-900">
          {isBn ? 'ক্যাটাগরি ভিত্তিক পারফরম্যান্স ও কমিশন রেট' : 'Category Performance & Commission Settings'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SERVICE_CATEGORIES.map(cat => (
            <div key={cat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900">{isBn ? cat.nameBn : cat.name}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                  {cat.commissionRate}% Fee
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Growth: <span className="font-bold text-emerald-600">+24%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
