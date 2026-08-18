import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, PhoneCall, Mail, MapPin, Award, Heart, CheckCircle2 } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/serviceCategories';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                SM
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">Service Men</span>
                <span className="block text-xs font-semibold text-brand-400">
                  {isBn ? 'আপনার সেবা, আপনার পছন্দ, আপনার বিশ্বস্ত পেশাদার' : 'Your service, your choice, your trusted pro'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {isBn
                ? 'সার্ভিস মেন বাংলাদেশের সর্বপ্রথম পূর্ণাঙ্গ ডিজিটাল সার্ভিস মার্কেটপ্লেস। ঘরে বসেই নিশ্চিত করুন জাতীয় পরিচয়পত্র ভেরিফাইড ইলেকট্রিশিয়ান, প্লাম্বার, এসি টেকনিশিয়ান এবং দক্ষ প্রফেশনাল সেবা।'
                : 'Service Men is Bangladesh’s premier on-demand digital service marketplace connecting homeowners and businesses with NID-verified electricians, plumbers, AC technicians, and skilled professionals.'}
            </p>

            {/* Helpline box */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 inline-flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {isBn ? '২৪/৭ কাস্টমার সাপোর্ট হেল্পলাইন' : '24/7 National Helpline'}
                </div>
                <div className="font-mono text-base font-black text-brand-300">16222 / 09612-SERVICE</div>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {isBn ? 'সার্ভিস ক্যাটাগরি' : 'Service Categories'}
            </h4>
            <ul className="space-y-2">
              {SERVICE_CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <a href="#services" className="hover:text-brand-400 transition-colors">
                    {isBn ? cat.nameBn : cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Bangladesh Divisions */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {isBn ? 'কভারেজ এলাকা' : 'Service Coverage'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-redaccent-500" /> Dhaka (মিরপুর, ধানমন্ডি, গুলশান)</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-redaccent-500" /> Chattogram (আগ্রাবাদ, নাসিরাবাদ)</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-redaccent-500" /> Sylhet (জিন্দাবাজার, আম্বরখানা)</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-redaccent-500" /> Rajshahi (বোয়ালিয়া, জিরো পয়েন্ট)</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-redaccent-500" /> Khulna, Barishal, Rangpur</li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {isBn ? 'নিরাপত্তা ও পেমেন্ট' : 'Trust & Payments'}
            </h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>১০০% এনআইডি ভেরিফাইড কারিগর</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Award className="w-4 h-4 text-teal-400" />
                <span>৭ দিনের নিশ্চিত সার্ভিস ওয়ারেন্টি</span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isBn ? 'সমর্থিত পেমেন্ট মাধ্যম' : 'Supported Payment Methods'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-pink-900/60 text-pink-300 rounded font-bold text-[10px]">bKash</span>
              <span className="px-2 py-1 bg-amber-900/60 text-amber-300 rounded font-bold text-[10px]">নগদ</span>
              <span className="px-2 py-1 bg-purple-900/60 text-purple-300 rounded font-bold text-[10px]">Rocket</span>
              <span className="px-2 py-1 bg-blue-900/60 text-blue-300 rounded font-bold text-[10px]">Cards</span>
              <span className="px-2 py-1 bg-emerald-900/60 text-emerald-300 rounded font-bold text-[10px]">Cash</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <div>
            © 2026 Service Men Bangladesh Ltd. All Rights Reserved. Built for Digital Bangladesh.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Provider Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
