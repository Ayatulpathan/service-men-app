import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Complaint } from '../../types';
import { formatBDT } from '../../utils/currency';
import { AlertTriangle, CheckCircle2, ShieldAlert, DollarSign, MessageSquare, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DisputeCenter: React.FC = () => {
  const { language } = useLanguage();
  const { complaints, resolveComplaint } = useMarketplace();
  const isBn = language === 'bn';

  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('Case reviewed by customer grievance officer. Refund issued.');
  const [refundAmount, setRefundAmount] = useState<number>(300);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    resolveComplaint(activeComplaint.id, resolutionNote, refundAmount);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    alert(isBn ? 'অভিযোগটি সফলভাবে সমাধান করা হয়েছে এবং রিফান্ড পাঠানো হয়েছে।' : 'Dispute resolved successfully and refund dispatched to customer wallet.');
    setActiveComplaint(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'গ্রাহক অভিযোগ ও ডিসপিউট মীমাংসা কেন্দ্র' : 'Complaint Resolution & Mediation Center'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'অতিরিক্ত চার্জ, নিম্নমানের কাজ বা অসদাচরণের অভিযোগ সমাধান করুন' : 'Investigate customer complaints, issue warranty refunds & enforce provider rules'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Logged Complaints & Grievances</h3>
          <span className="text-xs font-bold text-slate-500">{complaints.length} Total Cases</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Provider</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{c.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{c.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.customerPhone}</div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{c.providerName}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-red-600">{c.reason}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.description}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {c.status !== 'resolved' ? (
                      <button
                        onClick={() => {
                          setActiveComplaint(c);
                          setRefundAmount(c.refundAmount || 200);
                        }}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Mediate & Settle
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">Resolved ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Dispute Case: {activeComplaint.id}
                </h3>
                <p className="text-xs text-slate-500">Booking: {activeComplaint.bookingId}</p>
              </div>
              <button onClick={() => setActiveComplaint(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                ✕
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1 text-xs text-red-900">
              <div className="font-bold">Customer Claim: {activeComplaint.reason}</div>
              <div>"{activeComplaint.description}"</div>
            </div>

            <form onSubmit={handleResolve} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Customer Refund (৳)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resolution Note / Action Taken</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Resolution & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
