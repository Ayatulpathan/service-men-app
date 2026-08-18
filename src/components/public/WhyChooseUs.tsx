import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Tag, Award, Smartphone, CheckCircle } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const features = [
    {
      icon: ShieldCheck,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: Tag,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Award,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      icon: Smartphone,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold mb-2">
            <span>{isBn ? 'নিরাপত্তা ও গুণগত মান' : 'Quality & Security Guarantee'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('whyChooseUs')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isBn
              ? 'বাংলাদেশের লক্ষাধিক গ্রাহক কেন প্রতিদিন সার্ভিস মেন ব্যবহার করেন'
              : 'Why thousands of Bangladeshi households & businesses rely on Service Men'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-brand-500/50 hover:bg-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1 text-[11px] font-bold text-brand-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isBn ? '১০০% নিশ্চিত মান' : 'Guaranteed Quality'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
