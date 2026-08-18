import React from 'react';
import { X, MapPin, Phone, Mail, Award, ShieldCheck, Check, Calendar, Star, Clock, ArrowRight } from 'lucide-react';
import { Provider } from '../../types';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/currency';

interface ProviderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onBookProvider: (provider: Provider) => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  isOpen,
  onClose,
  provider,
  onBookProvider
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="relative bg-gradient-to-r from-brand-700 to-slate-900 text-white p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black">{isBn ? provider.nameBn : provider.name}</h2>
              <div className="text-xs text-brand-200 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-400" /> {provider.serviceArea.join(', ')}</span>
                <span>•</span>
                <span>{provider.experienceYears} Years Exp.</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {provider.verifiedBadges.map((badge, idx) => (
                  <Badge key={idx} type={badge} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="text-lg font-black text-slate-900">{provider.rating} ★</div>
              <div className="text-[11px] text-slate-400 font-medium">({provider.reviewCount} Reviews)</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="text-lg font-black text-brand-600">{provider.completedJobs}+</div>
              <div className="text-[11px] text-slate-400 font-medium">{isBn ? 'সম্পন্ন কাজ' : 'Jobs Done'}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="text-lg font-black text-slate-900">{formatBDT(provider.startingPrice || 500, language)}</div>
              <div className="text-[11px] text-slate-400 font-medium">{isBn ? 'শুরু মূল্য' : 'Base Rate'}</div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {isBn ? 'পেশাদার সম্পর্কে' : 'About Specialist'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {isBn ? provider.bioBn : provider.bio}
            </p>
          </div>

          {/* Skills & Expertise */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {isBn ? 'বিশেষ দক্ষতা ও অভিজ্ঞতা' : 'Skills & Specialties'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-brand-50 text-brand-800 border border-brand-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Ratings Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {isBn ? 'কাস্টমার মূল্যায়ন স্কোর' : 'Detailed Rating Score'}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-slate-600">{isBn ? 'কাজের মান (Quality):' : 'Work Quality:'}</span>
                <span className="font-bold text-slate-900">★ {provider.ratingBreakdown.quality}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-slate-600">{isBn ? 'সময়ানুবর্তিতা (Punctuality):' : 'Punctuality:'}</span>
                <span className="font-bold text-slate-900">★ {provider.ratingBreakdown.punctuality}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-slate-600">{isBn ? 'ব্যবহার (Behavior):' : 'Polite Behavior:'}</span>
                <span className="font-bold text-slate-900">★ {provider.ratingBreakdown.behavior}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-slate-600">{isBn ? 'ন্যায্য মূল্য (Price Fairness):' : 'Fair Pricing:'}</span>
                <span className="font-bold text-slate-900">★ {provider.ratingBreakdown.priceFairness}</span>
              </div>
            </div>
          </div>

          {/* Past Work Images */}
          {provider.pastWorkImages.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isBn ? 'পূর্বের কাজের ছবি' : 'Previous Work Photos'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {provider.pastWorkImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Past work"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{isBn ? 'কল অথবা বুক করুন' : 'Estimated Cost'}</div>
            <div className="text-lg font-black text-brand-700">{formatBDT(provider.startingPrice || 500, language)}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
            <button
              onClick={() => {
                onClose();
                onBookProvider(provider);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'এখনই বুক করুন' : 'Book Service Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
