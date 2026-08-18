import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Search, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const steps = [
    {
      icon: MapPin,
      number: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      color: 'bg-emerald-500'
    },
    {
      icon: Search,
      number: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      color: 'bg-blue-500'
    },
    {
      icon: Wrench,
      number: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      color: 'bg-amber-500'
    },
    {
      icon: ShieldCheck,
      number: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      color: 'bg-teal-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('howItWorks')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t('howItWorksSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-md font-black text-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
