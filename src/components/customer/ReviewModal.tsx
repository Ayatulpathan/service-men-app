import React, { useState } from 'react';
import { X, Star, CheckCircle, Image, ArrowRight } from 'lucide-react';
import { Booking } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from '../common/StarRating';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, booking }) => {
  const { language } = useLanguage();
  const { addReview } = useMarketplace();
  const { currentUser } = useAuth();
  const isBn = language === 'bn';

  const [overallRating, setOverallRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [behaviorRating, setBehaviorRating] = useState(5);
  const [priceFairnessRating, setPriceFairnessRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert(isBn ? 'অনুগ্রহ করে আপনার অভিজ্ঞতা সম্পর্কে কিছু মন্তব্য লিখুন' : 'Please leave a brief review comment');
      return;
    }

    addReview({
      bookingId: booking.id,
      customerId: currentUser?.id || booking.customerId,
      customerName: currentUser?.name || booking.customerName,
      customerAvatar: currentUser?.avatar || booking.customerAvatar,
      providerId: booking.providerId || 'prov-1',
      serviceName: booking.serviceName,
      rating: overallRating,
      ratings: {
        quality: qualityRating,
        punctuality: punctualityRating,
        behavior: behaviorRating,
        priceFairness: priceFairnessRating
      },
      comment
    });

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    alert(isBn ? 'আপনার মূল্যবান রিভিউ সফলভাবে গৃহীত হয়েছে!' : 'Thank you! Your verified review has been submitted.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isBn ? 'সার্ভিস রেটিং ও রিভিউ দিন' : 'Rate & Review Service'}
              </h3>
              <p className="text-xs text-amber-100">
                {booking.serviceName} • {booking.providerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-amber-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Overall Rating */}
          <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isBn ? 'সার্বিক সন্তুষ্টি (Overall Experience)' : 'Overall Rating'}
            </div>
            <StarRating
              rating={overallRating}
              interactive
              onRatingChange={setOverallRating}
              size="lg"
              showScore={false}
            />
            <div className="text-sm font-bold text-amber-600 mt-1.5">
              {overallRating} out of 5 Stars
            </div>
          </div>

          {/* 4 Multi-criteria dimensions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">{isBn ? 'কাজের মান (Quality):' : 'Work Quality:'}</span>
              <StarRating rating={qualityRating} interactive onRatingChange={setQualityRating} size="sm" showScore={false} />
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">{isBn ? 'সময়ানুবর্তিতা (Punctuality):' : 'Punctuality:'}</span>
              <StarRating rating={punctualityRating} interactive onRatingChange={setPunctualityRating} size="sm" showScore={false} />
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">{isBn ? 'ব্যবহার ও শিষ্টাচার (Behavior):' : 'Politeness & Behavior:'}</span>
              <StarRating rating={behaviorRating} interactive onRatingChange={setBehaviorRating} size="sm" showScore={false} />
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">{isBn ? 'ন্যায্য মূল্য (Price Fairness):' : 'Fair Pricing:'}</span>
              <StarRating rating={priceFairnessRating} interactive onRatingChange={setPriceFairnessRating} size="sm" showScore={false} />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isBn ? 'আপনার অভিজ্ঞতা বিস্তারিত লিখুন *' : 'Write Your Detailed Experience *'}
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was the technician's behavior, work cleanliness, tools used..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
