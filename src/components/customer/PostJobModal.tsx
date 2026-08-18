import React, { useState } from 'react';
import { X, PlusCircle, Tag, MapPin, Calendar, Clock, DollarSign, Image, CheckCircle, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICE_CATEGORIES } from '../../data/serviceCategories';
import confetti from 'canvas-confetti';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const { language } = useLanguage();
  const { selectedLocation, createJobPost } = useMarketplace();
  const { currentUser, setPersona } = useAuth();
  const isBn = language === 'bn';

  const [serviceName, setServiceName] = useState('');
  const [categoryId, setCategoryId] = useState('cat-home');
  const [problemDescription, setProblemDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState(1000);
  const [budgetMax, setBudgetMax] = useState(2500);
  const [preferredDate, setPreferredDate] = useState('2026-08-22');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [addressDetails, setAddressDetails] = useState('Sector 4, Road 11, Uttara');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !problemDescription.trim()) {
      alert(isBn ? 'অনুগ্রহ করে কাজের শিরোনাম ও বিবরণ দিন' : 'Please provide job title and requirements');
      return;
    }

    if (!currentUser || currentUser.role !== 'customer') {
      setPersona('customer');
    }

    createJobPost({
      customerId: currentUser?.id || 'user-c1',
      customerName: currentUser?.name || 'Shakil Ahmed',
      customerPhone: currentUser?.phone || '01712-987654',
      serviceName,
      categoryId,
      problemDescription,
      location: {
        division: selectedLocation.division,
        district: selectedLocation.district,
        thana: selectedLocation.thana,
        area: selectedLocation.area,
        addressDetails
      },
      preferredDate,
      preferredTime,
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      attachments: [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80'
      ]
    });

    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {}

    onJobCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isBn ? 'কাস্টম জব রিকোয়েস্ট পোস্ট করুন' : 'Post a Custom Service Tender'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'আপনার বাজেট অনুযায়ী নিকটস্থ মিস্ত্রিদের থেকে বিড পান' : 'Get competitive price quotes from nearby professionals'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isBn ? 'কাজের শিরোনাম *' : 'Job Title / Service Needed *'}
            </label>
            <input
              type="text"
              required
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              placeholder="e.g. 2 Ton AC Installation & Gas Leak Detection"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isBn ? 'ক্যাটাগরি নির্বাচন' : 'Select Category'}
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none bg-white"
            >
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {isBn ? c.nameBn : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isBn ? 'কাজের বিস্তারিত বিবরণ ও শর্তাবলী *' : 'Detailed Requirements & Notes *'}
            </label>
            <textarea
              rows={3}
              required
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="Describe square footage, issues, floor, materials provided or required..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Budget in BDT */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isBn ? 'আপনার আনুমানিক বাজেট (৳)' : 'Estimated Budget Range (৳)'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Min Budget (৳)</span>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={e => setBudgetMin(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max Budget (৳)</span>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={e => setBudgetMax(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                <Calendar className="w-3 h-3 inline mr-1" /> Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 inline mr-1" /> Time Slot
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              <MapPin className="w-3 h-3 inline mr-1 text-redaccent-500" /> Location Details
            </label>
            <div className="p-2 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700 mb-1.5">
              Area: {selectedLocation.area}, {selectedLocation.thana}
            </div>
            <input
              type="text"
              value={addressDetails}
              onChange={e => setAddressDetails(e.target.value)}
              placeholder="Road, House number, landmarks"
              className="w-full p-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'জব প্রকাশ করুন' : 'Post Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
