import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, Clock, ShieldAlert, PhoneCall, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenEmergencyModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenEmergencyModal }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section className="py-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-redaccent-600 via-rose-600 to-red-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Background decorative waves */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{isBn ? '২৪/৭ জরুরি ডেসপ্যাচ সেবা' : '24/7 Rapid Emergency Dispatch'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isBn ? 'জরুরি পানির লিকেজ, শর্ট সার্কিট বা গাড়ি বিকল?' : 'Sudden Pipe Burst, Electrical Fire Hazard or Car Breakdown?'}
              </h3>

              <p className="text-xs sm:text-sm text-red-50 max-w-2xl leading-relaxed">
                {isBn
                  ? 'চিন্তা করবেন না! সার্ভিস মেনের জরুরি টিম ৩০ মিনিটের মধ্যে আপনার ঠিকানায় পৌঁছাবে। ঢাকা ও চট্টগ্রামের সকল এলাকায় সার্বক্ষণিক সাপোর্ট।'
                  : 'Get priority response in under 30 minutes with our verified standby rapid-response emergency technicians across Dhaka & Chattogram.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-red-100 font-semibold pt-1">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> &lt;30 Min Average Arrival</span>
                <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Verified Emergency Pros</span>
                <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4" /> Direct Phone Coordination</span>
              </div>
            </div>

            {/* Emergency Action CTA */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenEmergencyModal}
                className="px-6 py-3.5 rounded-2xl bg-white text-redaccent-600 hover:bg-red-50 font-black text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Zap className="w-5 h-5 fill-redaccent-600" />
                <span>{isBn ? 'জরুরি সার্ভিস বুক করুন' : 'Book Emergency SOS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:16222"
                className="px-6 py-3 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isBn ? 'হেল্পলাইনে কল করুন: 16222' : 'Call Helpline: 16222'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
