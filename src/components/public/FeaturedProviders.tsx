import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { MapPin, Briefcase, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { Provider } from '../../types';

interface FeaturedProvidersProps {
  onSelectProvider: (provider: Provider) => void;
  onBookProvider: (provider: Provider) => void;
}

export const FeaturedProviders: React.FC<FeaturedProvidersProps> = ({
  onSelectProvider,
  onBookProvider
}) => {
  const { language } = useLanguage();
  const { providers } = useMarketplace();
  const isBn = language === 'bn';

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'যাচাইকৃত পেশাদার' : 'Verified Professionals'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? 'শীর্ষ রেটিংপ্রাপ্ত সার্ভিস স্পেশালিস্ট' : 'Top Rated Verified Specialists'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isBn
                ? 'কঠোরভাবে পুলিশ ক্লিয়ারেন্স ও এনআইডি যাচাইকৃত অভিজ্ঞ মিস্ত্রি ও টেকনিশিয়ান'
                : 'Thoroughly vetted professionals with National ID checks, background clearance & high ratings.'}
            </p>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.slice(0, 6).map(provider => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with avatar & name */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
                    />
                    {provider.isAvailable && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Available now" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {isBn ? provider.nameBn : provider.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-redaccent-500 shrink-0" />
                      <span className="truncate">{provider.serviceArea.slice(0, 2).join(', ')}</span>
                    </div>

                    <div className="mt-1.5">
                      <StarRating rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {provider.verifiedBadges.map((badge, idx) => (
                    <Badge key={idx} type={badge} size="sm" />
                  ))}
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {isBn ? provider.bioBn : provider.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {provider.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Book CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {isBn ? 'শুরু মাত্র' : 'Starts from'}
                  </div>
                  <div className="text-base font-black text-brand-700">
                    ৳{provider.startingPrice || 500}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProvider(provider)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {isBn ? 'প্রোফাইল' : 'Profile'}
                  </button>
                  <button
                    onClick={() => onBookProvider(provider)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>{isBn ? 'হায়ার করুন' : 'Book Pro'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
