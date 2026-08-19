import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertTriangle, Image as ImageIcon, X } from 'lucide-react';

export const VerificationManager: React.FC = () => {
  const { activeProviderId } = useAuth();
  const { language } = useLanguage();
  const { providers, verifyProvider } = useMarketplace();
  const isBn = language === 'bn';

  const currentProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  const [nidNumber, setNidNumber] = useState(currentProvider.nidNumber || '19882691234567890');
  const [tradeLicense, setTradeLicense] = useState('TRAD/DNCC/049102/2024');
  
  // File upload state with live image preview
  const [nidFrontFile, setNidFrontFile] = useState<{ name: string; preview: string } | null>({
    name: 'nid_front_rafiqul.jpg',
    preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60'
  });
  const [nidBackFile, setNidBackFile] = useState<{ name: string; preview: string } | null>({
    name: 'nid_back_rafiqul.jpg',
    preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60'
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (side === 'front') {
        setNidFrontFile({ name: file.name, preview: result });
      } else {
        setNidBackFile({ name: file.name, preview: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidFrontFile || !nidBackFile) {
      alert(isBn ? 'দয়া করে এনআইডি ফ্রন্ট ও ব্যাক উভয় পাশের ছবি আপলোড করুন।' : 'Please upload both front and back sides of your NID card.');
      return;
    }
    verifyProvider(currentProvider.id, 'under_review');
    alert(isBn ? 'আপনার এনআইডি ও ডকুমেন্ট সফলভাবে পর্যালোচনার জন্য জমা হয়েছে।' : 'Your National ID documents have been submitted for admin verification.');
  };

  const getStatusBadge = () => {
    switch (currentProvider.nidStatus) {
      case 'verified':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isBn ? '১০০% এনআইডি ভেরিফাইড' : '100% NID Verified & Background Cleared'}
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs flex items-center gap-1.5 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-600" />
            {isBn ? 'এডমিন রিভিউ চলছে (১২-২৪ ঘণ্টা)' : 'Under Admin Review (12-24 Hours)'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs flex items-center gap-1.5 border border-slate-300">
            <AlertTriangle className="w-4 h-4 text-slate-500" />
            {isBn ? 'ভেরিফিকেশন পেন্ডিং' : 'Pending Verification Submission'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {isBn ? 'জাতীয় পরিচয়পত্র ও প্রফেশনাল ভেরিফিকেশন' : 'National ID & Professional Verification'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'এনআইডি যাচাইয়ের মাধ্যমে ভেরিফাইড ব্যাজ পেয়ে কাস্টমারের আস্থা ও বুকিং বাড়ান' : 'Earn the official Verified Pro badge by verifying your Bangladesh National ID (NID)'}
          </p>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs leading-relaxed flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            {isBn
              ? 'সার্ভিস মেনের সকল প্রোভাইডারের এনআইডি তথ্য নির্বাচন কমিশনের ডাটাবেজের সাথে ক্রস-চেক করা হয়। আপনার সংবেদনশীল তথ্য সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত।'
              : 'All Service Men technician credentials are cross-verified against National ID registries. Sensitive personal information is strictly protected.'}
          </span>
        </div>

        <form onSubmit={handleSubmitForReview} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isBn ? 'জাতীয় পরিচয়পত্র নম্বর (১০ বা ১৭ ডিজিট) *' : 'National ID Number (10 or 17 Digits) *'}
              </label>
              <input
                type="text"
                required
                value={nidNumber}
                onChange={e => setNidNumber(e.target.value)}
                placeholder="1990XXXXXXXXXXXXX"
                className="w-full p-2.5 border rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isBn ? 'ট্রেড লাইসেন্স / টেকনিক্যাল সার্টিফিকেট নং' : 'Trade License / Technical Certificate No.'}
              </label>
              <input
                type="text"
                value={tradeLicense}
                onChange={e => setTradeLicense(e.target.value)}
                placeholder="TRAD/XXXX/YYYY"
                className="w-full p-2.5 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Hidden file input elements */}
          <input
            type="file"
            ref={frontInputRef}
            onChange={e => handleFileUpload(e, 'front')}
            accept="image/*,.pdf"
            className="hidden"
          />
          <input
            type="file"
            ref={backInputRef}
            onChange={e => handleFileUpload(e, 'back')}
            accept="image/*,.pdf"
            className="hidden"
          />

          {/* Document Upload Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* NID Front */}
            <div className="p-4 border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl bg-slate-50 text-center space-y-3 transition-colors">
              {nidFrontFile?.preview ? (
                <div className="relative mx-auto w-full max-w-[220px] h-28 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xs">
                  <img src={nidFrontFile.preview} alt="NID Front" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] rounded font-bold">
                    Front Side
                  </span>
                </div>
              ) : (
                <FileText className="w-8 h-8 text-brand-600 mx-auto" />
              )}
              
              <div>
                <div className="font-bold text-slate-800 text-xs">
                  {isBn ? 'এনআইডি কার্ড (সামনের পাশ)' : 'NID Card (Front Side)'}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[220px] mx-auto">
                  {nidFrontFile ? `${nidFrontFile.name} (Uploaded ✓)` : (isBn ? 'ফাইল নির্বাচন করুন (JPG/PNG)' : 'Select image file (JPG/PNG)')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => frontInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-white hover:bg-brand-50 text-brand-700 border border-slate-200 hover:border-brand-300 rounded-xl text-[11px] font-bold shadow-xs transition-all flex items-center gap-1.5 mx-auto"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{nidFrontFile ? (isBn ? 'পরিবর্তন করুন' : 'Re-upload Front') : (isBn ? 'ছবি আপলোড করুন' : 'Upload Front')}</span>
              </button>
            </div>

            {/* NID Back */}
            <div className="p-4 border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl bg-slate-50 text-center space-y-3 transition-colors">
              {nidBackFile?.preview ? (
                <div className="relative mx-auto w-full max-w-[220px] h-28 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xs">
                  <img src={nidBackFile.preview} alt="NID Back" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] rounded font-bold">
                    Back Side
                  </span>
                </div>
              ) : (
                <FileText className="w-8 h-8 text-brand-600 mx-auto" />
              )}

              <div>
                <div className="font-bold text-slate-800 text-xs">
                  {isBn ? 'এনআইডি কার্ড (পেছনের পাশ)' : 'NID Card (Back Side)'}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[220px] mx-auto">
                  {nidBackFile ? `${nidBackFile.name} (Uploaded ✓)` : (isBn ? 'ফাইল নির্বাচন করুন (JPG/PNG)' : 'Select image file (JPG/PNG)')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-white hover:bg-brand-50 text-brand-700 border border-slate-200 hover:border-brand-300 rounded-xl text-[11px] font-bold shadow-xs transition-all flex items-center gap-1.5 mx-auto"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{nidBackFile ? (isBn ? 'পরিবর্তন করুন' : 'Re-upload Back') : (isBn ? 'ছবি আপলোড করুন' : 'Upload Back')}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-lg"
            >
              {isBn ? 'এডমিন ভেরিফিকেশনের জন্য জমা দিন' : 'Submit for Admin Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
