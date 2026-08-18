import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StarRating } from '../common/StarRating';
import { Quote, CheckCircle2, MapPin } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { language, t } = useLanguage();
  const { reviews } = useMarketplace();
  const isBn = language === 'bn';

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            {isBn ? 'বাস্তব রিভিউ' : 'Verified Feedback'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('customerReviews')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {isBn
              ? 'সেবা নেওয়ার পর গ্রাহকদের শতভাগ সত্য ও যাচাইকৃত মতামত'
              : 'Real, unbiased testimonials from verified customers after service completion.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} size="sm" />
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>

                <div className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md inline-block mb-3">
                  Service: {review.serviceName}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                {review.customerAvatar ? (
                  <img
                    src={review.customerAvatar}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                    {review.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    <span>{review.customerName}</span>
                    <span title="Verified Customer">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {review.createdAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
