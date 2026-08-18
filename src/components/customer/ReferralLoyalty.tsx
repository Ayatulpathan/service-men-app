import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Gift, Share2, Copy, Check, Award, Coins, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReferralLoyalty: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [copied, setCopied] = useState(false);

  const referralCode = currentUser?.referralCode || 'SHAKIL100';
  const loyaltyPoints = currentUser?.loyaltyPoints || 350;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'লয়্যালটি পয়েন্ট ও রেফারেল প্রোগ্রাম' : 'Loyalty Rewards & Referral Program'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'বন্ধু রেফার করুন এবং পান প্রতি বুকিংয়ে আকর্ষণীয় ক্যাশব্যাক ও পয়েন্ট' : 'Earn points and ৳100 wallet credit for inviting friends'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Card */}
        <div className="bg-gradient-to-br from-brand-700 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-brand-300" />
            </div>
            <h3 className="text-lg font-bold">
              {isBn ? 'বন্ধুকে আমন্ত্রণ জানান ও পান ৳১০০' : 'Refer a Friend & Earn ৳100'}
            </h3>
            <p className="text-xs text-brand-100 mt-1.5 leading-relaxed">
              {isBn
                ? 'আপনার বন্ধু প্রথম বুকিংয়ে পাবে ৳১০০ ছাড় এবং কাজ সম্পন্ন হলে আপনার ওয়ালেটেও যুক্ত হবে ৳১০০ বোনাস ক্রেডিট।'
                : 'Your friend gets ৳100 off their first booking, and you receive ৳100 credit after their first completed service.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-[10px] uppercase font-bold text-brand-200 mb-1.5">
              {isBn ? 'আপনার ইউনিক রেফারেল কোড:' : 'Your Unique Referral Code:'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 px-4 py-2.5 rounded-xl font-mono text-sm font-black tracking-widest text-center border border-white/20">
                {referralCode}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
              <Coins className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {isBn ? 'সার্ভিস মেন লয়্যালটি ক্লাব' : 'Loyalty Points Balance'}
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                Silver Tier
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">{loyaltyPoints}</span>
              <span className="text-xs font-bold text-slate-500">{isBn ? 'পয়েন্ট উপলব্ধ' : 'Points Available'}</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {isBn
                ? '১০০ পয়েন্ট = ৳৫০ সমমূল্যের ডিসকাউন্ট কুপন। পরবর্তী অর্ডারে রিডিম করুন।'
                : '100 points = ৳50 discount coupon. Earn 20 points for every ৳500 spent.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Value: ৳{Math.round(loyaltyPoints * 0.5)} Discount</span>
            <button
              onClick={() => alert(isBn ? 'আপনার ৩০০ পয়েন্ট সফলভাবে কুপনে রূপান্তরিত হয়েছে: REWARD150' : 'Redeemed! Use coupon REWARD150 on your next booking.')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {isBn ? 'পয়েন্ট রিডিম করুন' : 'Redeem Points'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
