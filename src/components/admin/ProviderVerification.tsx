import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Provider } from '../../types';
import { ShieldCheck, CheckCircle2, XCircle, FileText, MapPin, Star, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProviderVerification: React.FC = () => {
  const { language } = useLanguage();
  const { providers, verifyProvider } = useMarketplace();
  const isBn = language === 'bn';

  const [inspectingProvider, setInspectingProvider] = useState<Provider | null>(null);

  const handleApprove = (providerId: string) => {
    verifyProvider(providerId, 'verified', ['NID Verified', 'Police Clearance', 'Top Rated']);
    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {}
    alert(isBn ? 'প্রোভাইডার এনআইডি সফলভাবে অনুমোদিত হয়েছে ও ব্যাজ যুক্ত হয়েছে।' : 'Provider NID verified successfully! Verified badge added.');
    setInspectingProvider(null);
  };

  const handleReject = (providerId: string) => {
    verifyProvider(providerId, 'rejected');
    alert(isBn ? 'প্রোভাইডার এনআইডি বাতিল করা হয়েছে।' : 'Provider verification rejected. Notification sent.');
    setInspectingProvider(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'প্রোভাইডার এনআইডি ও ডকুমেন্ট ভেরিফিকেশন কিউ' : 'Provider NID & Document Verification Queue'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'জাতীয় পরিচয়পত্র, পুলিশ ক্লিয়ারেন্স ও সনদ যাচাই করে অনুমোদন দিন' : 'Inspect submitted Bangladesh National ID cards & assign Verified Pro status'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Registered Service Professionals</h3>
          <span className="text-xs font-bold text-slate-500">{providers.length} Total Providers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Provider</th>
                <th className="p-3.5">NID Number</th>
                <th className="p-3.5">Service Area</th>
                <th className="p-3.5">Experience</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map(provider => (
                <tr key={provider.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-10 h-10 rounded-xl object-cover border"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{isBn ? provider.nameBn : provider.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{provider.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">{provider.nidNumber}</td>
                  <td className="p-3.5 text-slate-600">{provider.serviceArea.join(', ')}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{provider.experienceYears} Years</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      provider.nidStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : provider.nidStatus === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {provider.nidStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setInspectingProvider(provider)}
                      className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    {provider.nidStatus !== 'verified' && (
                      <button
                        onClick={() => handleApprove(provider.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Document Modal */}
      {inspectingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {inspectingProvider.name} (NID Inspection)
                </h3>
                <p className="text-xs text-slate-400 font-mono">NID: {inspectingProvider.nidNumber}</p>
              </div>
              <button onClick={() => setInspectingProvider(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border text-center space-y-2">
                  <div className="font-bold text-slate-700">NID Card Front</div>
                  <div className="h-28 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-mono text-[10px]">
                    [NID PHOTO FRONT PREVIEW]
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border text-center space-y-2">
                  <div className="font-bold text-slate-700">NID Card Back</div>
                  <div className="h-28 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-mono text-[10px]">
                    [NID PHOTO BACK PREVIEW]
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-bold text-slate-700">Trade / Professional Details:</div>
                <div className="text-slate-600">Categories: {inspectingProvider.serviceCategories.join(', ')}</div>
                <div className="text-slate-600">Skills: {inspectingProvider.skills.join(', ')}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => handleReject(inspectingProvider.id)}
                  className="px-4 py-2 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 text-xs"
                >
                  Reject Verification
                </button>
                <button
                  onClick={() => handleApprove(inspectingProvider.id)}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Badge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
