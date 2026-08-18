import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Booking } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, booking }) => {
  const { language } = useLanguage();
  const { submitComplaint } = useMarketplace();
  const { currentUser } = useAuth();
  const isBn = language === 'bn';

  const [reason, setReason] = useState('Poor Service Quality');
  const [description, setDescription] = useState('');

  if (!isOpen || !booking) return null;

  const reasons = isBn ? [
    'নিম্নমানের কাজ (Poor Service Quality)',
    'অতিরিক্ত টাকা দাবি / ওভারচার্জিং (Overcharging)',
    'মিস্ত্রি উপস্থিত হননি (Provider No-show)',
    'মালামালের ক্ষতিসাধন (Property Damage)',
    'অশোভন আচরণ (Unprofessional Behavior)',
    'পেমেন্ট সম্পর্কিত জটিলতা (Payment Problem)'
  ] : [
    'Poor Service Quality',
    'Overcharging / Hidden Fees',
    'Provider No-show',
    'Property Damage',
    'Unprofessional Behavior',
    'Payment Problem'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(isBn ? 'অনুগ্রহ করে বিস্তারিত অভিযোগের বিবরণ দিন' : 'Please provide dispute details');
      return;
    }

    submitComplaint({
      bookingId: booking.id,
      invoiceNumber: booking.invoiceNumber,
      customerId: currentUser?.id || booking.customerId,
      customerName: currentUser?.name || booking.customerName,
      customerPhone: currentUser?.phone || booking.customerPhone,
      providerId: booking.providerId || 'prov-1',
      providerName: booking.providerName || 'Technician',
      reason,
      description
    });

    alert(
      isBn
        ? 'আপনার অভিযোগটি সফলভাবে দাখিল করা হয়েছে। সার্ভিস মেনের ডিসপিউট টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।'
        : 'Your complaint has been submitted to the Admin Resolution Team. Our safety officer will contact you within 24 hours.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isBn ? 'অভিযোগ / ডিসপিউট দাখিল' : 'File a Complaint / Dispute'}
              </h3>
              <p className="text-xs text-red-100">
                Booking: {booking.id} • {booking.serviceName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-red-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 leading-relaxed text-[11px]">
            🛡️ {isBn ? 'আপনার নিরাপত্তা ও সন্তুষ্টি আমাদের শীর্ষ অগ্রাধিকার। প্রয়োজনে ক্ষতিপূরণ বা রিফান্ড প্রদান করা হবে।' : 'Customer safety and fair service are protected under our Warranty and Refund Guarantee.'}
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? 'অভিযোগের মূল কারণ নির্বাচন করুন *' : 'Select Primary Issue *'}
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none bg-white"
            >
              {reasons.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? 'ঘটনার বিস্তারিত বিবরণ লিখুন *' : 'Detailed Complaint Description *'}
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain exactly what happened, extra amount demanded, or damage caused..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

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
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'অভিযোগ জমা দিন' : 'Submit Dispute'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
