import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatBDT } from '../../utils/currency';
import {
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EarningsLedger: React.FC = () => {
  const { activeProviderId } = useAuth();
  const { language } = useLanguage();
  const { providers, withdrawals, requestWithdrawal } = useMarketplace();
  const isBn = language === 'bn';

  const currentProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [withdrawMethod, setWithdrawMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [accountPhone, setAccountPhone] = useState(currentProvider.phone || '01711234567');

  const providerWithdrawals = withdrawals.filter(w => w.providerId === currentProvider.id);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > currentProvider.earnings.pending) {
      alert(isBn ? 'অপর্যাপ্ত ব্যালেন্স' : 'Withdrawal amount exceeds available pending balance');
      return;
    }

    requestWithdrawal(currentProvider.id, currentProvider.name, withdrawAmount, withdrawMethod, accountPhone);
    setWithdrawModalOpen(false);
    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {}
    alert(isBn ? 'আপনার উইথড্রয়াল অনুরোধ সফলভাবে জমা হয়েছে। ২৪ ঘণ্টার মধ্যে বিকাশ/নগদে পাঠানো হবে।' : 'Withdrawal request submitted! Payout will arrive in your wallet within 24 hours.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {isBn ? 'উপার্জন ও বিকাশ/নগদ পেআউট' : 'Earnings Ledger & Wallet Payouts'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'সার্ভিস মেন থেকে অর্জিত আয় সরাসরি বিকাশ বা নগদে উত্তোলন করুন' : 'Track gross earnings, 10% platform commission & withdraw payouts'}
          </p>
        </div>

        <button
          onClick={() => setWithdrawModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 self-start"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{isBn ? 'টাকা উত্তোলন (Withdraw)' : 'Request Payout'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gross Earnings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Total Lifetime Earnings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatBDT(currentProvider.earnings.total, language)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            After 10% platform commission
          </div>
        </div>

        {/* Pending / Available to withdraw */}
        <div className="bg-gradient-to-br from-brand-600 to-teal-800 text-white p-6 rounded-3xl shadow-md">
          <div className="text-xs font-bold uppercase text-brand-200">Available to Withdraw</div>
          <div className="text-2xl font-black mt-1">
            {formatBDT(currentProvider.earnings.pending, language)}
          </div>
          <div className="text-[11px] text-brand-100 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant bKash / Nagad Transfer
          </div>
        </div>

        {/* Withdrawn History */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400">Total Withdrawn</div>
          <div className="text-2xl font-black text-slate-700 mt-1">
            {formatBDT(currentProvider.earnings.withdrawn, language)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Disbursed to mobile wallets
          </div>
        </div>
      </div>

      {/* Commission Breakdown Information */}
      <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-200 flex items-center justify-between text-xs text-brand-900 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span>Platform Fee Structure: 10% on completed jobs. 90% goes directly to provider.</span>
        </div>
        <span className="font-bold text-brand-800">Zero Hidden Deductions</span>
      </div>

      {/* Payout Withdrawal History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Payout Withdrawal Requests</h3>
          <span className="text-xs text-slate-500">MFS Direct Settlements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Request ID</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Account Phone</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providerWithdrawals.map(w => (
                <tr key={w.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{w.id}</td>
                  <td className="p-3.5 font-bold uppercase">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      w.method === 'bkash' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {w.method}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{w.accountPhone}</td>
                  <td className="p-3.5 font-black text-slate-900">{formatBDT(w.amount, language)}</td>
                  <td className="p-3.5 text-slate-500">{w.requestedAt}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {w.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">
                {isBn ? 'টাকা উত্তোলন অনুরোধ' : 'Request Wallet Payout'}
              </h3>
              <button onClick={() => setWithdrawModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Available Balance:</span>
                <span className="text-base font-black text-brand-700">{formatBDT(currentProvider.earnings.pending, language)}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Payout Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bkash')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      withdrawMethod === 'bkash' ? 'bg-pink-50 border-bkash text-bkash' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    bKash Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('nagad')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      withdrawMethod === 'nagad' ? 'bg-amber-50 border-nagad text-nagad' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Nagad Personal
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {withdrawMethod.toUpperCase()} Account Number
                </label>
                <input
                  type="text"
                  required
                  value={accountPhone}
                  onChange={e => setAccountPhone(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Withdrawal Amount (৳)
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  max={currentProvider.earnings.pending}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
