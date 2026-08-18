import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Coupon } from '../../types';
import { Tag, Plus, CheckCircle2, Percent, DollarSign, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CouponManager: React.FC = () => {
  const { language } = useLanguage();
  const { coupons, addCoupon } = useMarketplace();
  const isBn = language === 'bn';

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(150);
  const [minBookingAmount, setMinBookingAmount] = useState<number>(600);
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minBookingAmount: Number(minBookingAmount),
      description: description || `৳${discountValue} discount on orders above ৳${minBookingAmount}`,
      descriptionBn: `${minBookingAmount} টাকার বেশি বুকিংয়ে ${discountValue} টাকা ছাড়`,
      expiryDate: '2026-12-31',
      usageCount: 0,
      isActive: true
    });

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}

    alert(isBn ? 'নতুন কুপন কোড সফলভাবে তৈরি হয়েছে!' : 'New promo coupon campaign created successfully!');
    setCreateModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {isBn ? 'কুপন ও প্রমোশনাল ক্যাম্পেইন ম্যানেজার' : 'Coupon Engine & Promotional Campaigns'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'ফিক্সড বা শতকরা ডিসকাউন্ট কোড তৈরি ও নিয়ন্ত্রণ করুন' : 'Manage percentage & fixed BDT promo codes for customer acquisition'}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন কুপন তৈরি করুন' : 'Create New Coupon'}</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coupons.map((coupon, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm font-black px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl">
                  {coupon.code}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="text-xl font-black text-slate-900">
                {coupon.discountType === 'fixed' ? `৳${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {isBn ? coupon.descriptionBn : coupon.description}
              </p>

              <div className="mt-3 text-[11px] text-slate-400 space-y-0.5">
                <div>Min Booking: ৳{coupon.minBookingAmount}</div>
                <div>Expiry: {coupon.expiryDate}</div>
                <div>Used: {coupon.usageCount} times</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Campaign Live</span>
              <span className="text-[11px] text-brand-600 font-semibold">100% Guaranteed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Create New Promo Campaign</h3>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (e.g. DHAKA2026) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="SUMMER50"
                  className="w-full p-2.5 border rounded-xl font-mono text-sm uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white text-xs font-semibold"
                  >
                    <option value="fixed">Fixed Taka (৳)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Booking Order (৳)</label>
                <input
                  type="number"
                  required
                  value={minBookingAmount}
                  onChange={e => setMinBookingAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Special festival discount for Mirpur residents"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
