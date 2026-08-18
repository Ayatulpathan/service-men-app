import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { JobPost } from '../../types';
import { formatBDT } from '../../utils/currency';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Send,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  XCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobBiddingCenter: React.FC = () => {
  const { activeProviderId, currentUser } = useAuth();
  const { language } = useLanguage();
  const { jobPosts, providers, submitBid } = useMarketplace();
  const isBn = language === 'bn';

  const currentProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [quotedAmount, setQuotedAmount] = useState<number>(1800);
  const [arrivalEstimate, setArrivalEstimate] = useState('Can start tomorrow at 10:00 AM');
  const [proposalNote, setProposalNote] = useState('Experienced with genuine parts and 7-day service warranty.');

  const handleOpenBidModal = (job: JobPost) => {
    setActiveJobId(job.id);
    setQuotedAmount(Math.round((job.budgetMin + job.budgetMax) / 2));
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobId) return;

    submitBid(activeJobId, {
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      providerAvatar: currentProvider.avatar,
      providerRating: currentProvider.rating,
      providerCompletedJobs: currentProvider.completedJobs,
      quotedAmount,
      arrivalEstimate,
      proposalNote
    });

    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {}

    alert(isBn ? 'আপনার কোটেশন সফলভাবে কাস্টমারকে পাঠানো হয়েছে!' : 'Quotation submitted successfully to customer!');
    setActiveJobId(null);
  };

  const openJobs = jobPosts.filter(j => j.status === 'open');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'ওপেন কাস্টমার জব লিডস ও বিডিং' : 'Open Customer Tenders & Bidding Hub'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'নিকটস্থ কাস্টমারদের পোস্ট করা কাস্টম কাজে কোটেশন ও প্রস্তাব পাঠান' : 'Submit competitive quotations on customer-tendered service requests'}
        </p>
      </div>

      {openJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">No open job leads currently available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {openJobs.map(job => {
            const hasAlreadyBid = job.bids.some(b => b.providerId === currentProvider.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{job.id}</span>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Open for Bids ({job.bids.length} submitted)
                    </span>
                    <span className="text-xs text-slate-400">{job.createdAt}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{job.serviceName}</h3>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{job.problemDescription}"
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      👤 {job.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-redaccent-500" />
                      {job.location.area}, {job.location.thana}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5" />
                      {job.preferredDate} • {job.preferredTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold lg:text-right">Customer Budget</div>
                    <div className="text-xl font-black text-brand-700 lg:text-right">
                      {formatBDT(job.budgetMin, language)} - {formatBDT(job.budgetMax, language)}
                    </div>
                  </div>

                  {hasAlreadyBid ? (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Quote Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenBidModal(job)}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>{isBn ? 'কোটেশন / বিড পাঠান' : 'Submit Quotation'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bid Submission Modal */}
      {activeJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">
                {isBn ? 'কোটেশন ও প্রস্তাব দিন' : 'Submit Service Quotation'}
              </h3>
              <button onClick={() => setActiveJobId(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'আপনার প্রস্তাবিত মোট মূল্য (৳) *' : 'Your Quoted Price (৳) *'}
                </label>
                <input
                  type="number"
                  required
                  value={quotedAmount}
                  onChange={e => setQuotedAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'কখন পৌঁছাতে পারবেন *' : 'Estimated Arrival / Start Time *'}
                </label>
                <input
                  type="text"
                  required
                  value={arrivalEstimate}
                  onChange={e => setArrivalEstimate(e.target.value)}
                  placeholder="e.g. In 45 mins / Tomorrow at 10 AM"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'প্রস্তাবের বিবরণ ও নিশ্চয়তা *' : 'Proposal Note for Customer *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalNote}
                  onChange={e => setProposalNote(e.target.value)}
                  placeholder="Describe your tools, guarantee, experience..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveJobId(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
