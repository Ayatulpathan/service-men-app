import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { JobPost, JobBid } from '../../types';
import { StarRating } from '../common/StarRating';
import { formatBDT } from '../../utils/currency';
import { Clock, CheckCircle2, DollarSign, Calendar, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobBidsViewProps {
  onBidAccepted: () => void;
}

export const JobBidsView: React.FC<JobBidsViewProps> = ({ onBidAccepted }) => {
  const { language } = useLanguage();
  const { jobPosts, acceptBid } = useMarketplace();
  const isBn = language === 'bn';

  const handleAccept = (jobPostId: string, bidId: string) => {
    try {
      acceptBid(jobPostId, bidId);
      confetti({ particleCount: 80, spread: 70 });
      onBidAccepted();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {isBn ? 'আপনার পোস্টকৃত কাজের বিডসমূহ' : 'Quotes Received on Your Job Posts'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'মিস্ত্রিদের কোটেশন ও রেটিং তুলনা করে ১-ক্লিকে নিশ্চিত করুন' : 'Compare provider quotes, ratings & proposals and accept the best offer'}
          </p>
        </div>
      </div>

      {jobPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">No open job posts yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Job Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{post.id}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      post.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {post.status === 'open' ? 'Receiving Bids' : 'Awarded'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{post.serviceName}</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">{post.problemDescription}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Your Budget:</div>
                  <div className="text-base font-black text-brand-700">
                    {formatBDT(post.budgetMin, language)} - {formatBDT(post.budgetMax, language)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" /> {post.preferredDate} • {post.preferredTime}
                  </div>
                </div>
              </div>

              {/* Bids List */}
              <div className="p-5 space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isBn ? `প্রাপ্ত কোটেশন (${post.bids.length})` : `Submitted Quotations (${post.bids.length})`}
                </div>

                {post.bids.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    Waiting for nearby providers to submit quotations...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.bids.map(bid => {
                      const isAwarded = bid.status === 'accepted';
                      return (
                        <div
                          key={bid.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            isAwarded
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-white border-slate-200 hover:border-brand-500/50 hover:shadow-md'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={bid.providerAvatar}
                                  alt={bid.providerName}
                                  className="w-12 h-12 rounded-xl object-cover border"
                                />
                                <div>
                                  <div className="font-bold text-sm text-slate-900">{bid.providerName}</div>
                                  <StarRating rating={bid.providerRating} size="sm" />
                                  <div className="text-[10px] text-slate-500 mt-0.5">{bid.providerCompletedJobs} jobs completed</div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase font-bold">Quote</div>
                                <div className="text-lg font-black text-brand-700">{formatBDT(bid.quotedAmount, language)}</div>
                              </div>
                            </div>

                            {/* Proposal note */}
                            <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 italic border border-slate-100">
                              "{bid.proposalNote}"
                            </div>

                            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-brand-600" />
                              <span>{bid.arrivalEstimate}</span>
                            </div>
                          </div>

                          {/* Accept CTA */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{bid.createdAt}</span>

                            {isAwarded ? (
                              <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Quote Accepted
                              </span>
                            ) : post.status === 'open' ? (
                              <button
                                onClick={() => handleAccept(post.id, bid.id)}
                                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                              >
                                <span>Accept Offer</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Closed</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
