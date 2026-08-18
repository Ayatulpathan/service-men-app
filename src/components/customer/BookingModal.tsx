import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Tag, ShieldCheck, Zap, Image, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { ServiceItem, Provider, Booking, PaymentMethod } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/currency';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  provider?: Provider | null;
  isEmergencyDefault?: boolean;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  provider,
  isEmergencyDefault = false,
  onBookingCreated
}) => {
  const { language, t } = useLanguage();
  const { selectedLocation, createBooking, validateCoupon } = useMarketplace();
  const { currentUser, setPersona } = useAuth();
  const isBn = language === 'bn';

  const [problemDescription, setProblemDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-08-20');
  const [scheduledTime, setScheduledTime] = useState('03:00 PM');
  const [isEmergency, setIsEmergency] = useState(isEmergencyDefault);
  const [addressDetails, setAddressDetails] = useState('House 12, Road 4, Sector 3');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '01712-987654');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Shakil Ahmed');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !service) return null;

  const basePrice = provider?.startingPrice || service.basePrice;
  const platformFee = 50;
  const discount = appliedCoupon?.discount || 0;
  const emergencyFee = isEmergency ? 150 : 0;
  const totalAmount = Math.max(0, basePrice + platformFee + emergencyFee - discount);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = validateCoupon(couponInput, basePrice);
    if (res.valid) {
      setAppliedCoupon({ code: couponInput.trim().toUpperCase(), discount: res.discount });
      setCouponSuccess(res.message);
      setCouponError('');
    } else {
      setCouponError(res.message);
      setCouponSuccess('');
      setAppliedCoupon(null);
    }
  };

  const handleConfirm = () => {
    if (!problemDescription.trim()) {
      alert(isBn ? 'অনুগ্রহ করে সমস্যার সংক্ষিপ্ত বিবরণ লিখুন' : 'Please briefly describe your service issue');
      return;
    }

    // Auto-switch to customer persona if guest
    if (!currentUser || currentUser.role !== 'customer') {
      setPersona('customer');
    }

    const newBooking = createBooking({
      customerId: currentUser?.id || 'user-c1',
      customerName: customerName || 'Shakil Ahmed',
      customerPhone: customerPhone || '01712-987654',
      customerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      providerId: provider?.id || 'prov-1',
      providerName: provider?.name || 'Md. Rafiqul Islam (Assigned Pro)',
      providerPhone: provider?.phone || '01711-234567',
      providerAvatar: provider?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
      serviceId: service.id,
      serviceName: service.name,
      serviceNameBn: service.nameBn,
      categoryId: service.categoryId,
      status: 'requested',
      problemDescription,
      photos: selectedPhoto ? [selectedPhoto] : undefined,
      location: {
        division: selectedLocation.division,
        district: selectedLocation.district,
        thana: selectedLocation.thana,
        area: selectedLocation.area,
        addressDetails
      },
      scheduledDate: isEmergency ? new Date().toISOString().split('T')[0] : scheduledDate,
      scheduledTime: isEmergency ? 'Immediate Dispatch (<30 mins)' : scheduledTime,
      isEmergency,
      pricingType: service.priceType,
      baseAmount: basePrice,
      partsAmount: 0,
      discountAmount: discount,
      platformFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      couponCode: appliedCoupon?.code,
      warrantyDays: service.warrantyDays || 7
    });

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    onBookingCreated(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isBn ? 'সার্ভিস বুকিং ফর্ম' : 'Book Service Appointment'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isBn ? service.nameBn : service.name} • {formatBDT(basePrice, language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Emergency Alert Box if active */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-900 font-bold">
              <Zap className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
              <span>{isBn ? '২৪/৭ জরুরি দ্রুত সার্ভিস প্রয়োজন?' : 'Need 24/7 Urgent Emergency Dispatch?'}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={e => setIsEmergency(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Assigned Provider preview if provided */}
          {provider && (
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={provider.avatar} alt={provider.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-slate-900">{isBn ? provider.nameBn : provider.name}</div>
                  <div className="text-[10px] text-slate-500">★ {provider.rating} ({provider.completedJobs} jobs done)</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Selected Pro
              </span>
            </div>
          )}

          {/* Problem Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? '১. সমস্যার বিস্তারিত বিবরণ লিখুন *' : '1. Describe the Problem & Requirements *'}
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder={isBn ? 'যেমন: ১.৫ টন এসি ঠান্ডা হচ্ছে না, সাথে শব্দ করছে...' : 'e.g. AC compressor tripping, leakage from pipe, need jet pump wash...'}
              className="w-full p-3 border border-slate-300 rounded-xl font-sans text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? '২. সমস্যার ছবি সংযুক্ত করুন (ঐচ্ছিক)' : '2. Attach Issue Photo (Optional)'}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedPhoto('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80')}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
                  selectedPhoto ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>{selectedPhoto ? 'Photo Attached ✓' : 'Add Sample Damage Photo'}</span>
              </button>
            </div>
          </div>

          {/* Schedule Date & Time (if not emergency) */}
          {!isEmergency && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" /> {isBn ? 'তারিখ' : 'Service Date'}
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1" /> {isBn ? 'সময়সূচী' : 'Preferred Slot'}
                </label>
                <select
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none bg-white"
                >
                  <option value="10:00 AM">Morning (10:00 AM)</option>
                  <option value="12:30 PM">Noon (12:30 PM)</option>
                  <option value="03:00 PM">Afternoon (03:00 PM)</option>
                  <option value="05:30 PM">Evening (05:30 PM)</option>
                  <option value="08:00 PM">Night (08:00 PM)</option>
                </select>
              </div>
            </div>
          )}

          {/* Address Details */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-redaccent-500" /> {isBn ? 'সার্ভিস ঠিকানা ও মোবাইল' : 'Service Address & Contact'}
            </label>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-bold text-brand-800">
              📍 {selectedLocation.area}, {selectedLocation.thana}, {selectedLocation.district}
            </div>
            <input
              type="text"
              value={addressDetails}
              onChange={e => setAddressDetails(e.target.value)}
              placeholder="House, Flat No, Road/Sector Details"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2 border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Promo Coupon */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Tag className="w-3.5 h-3.5 inline mr-1 text-brand-600" /> {isBn ? 'ডিসকাউন্ট কুপন কোড' : 'Apply Promo Code'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                placeholder="FIRST100 or EID2026"
                className="flex-1 p-2 border border-slate-300 rounded-xl font-mono text-xs uppercase focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
            {couponSuccess && <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ {couponSuccess}</p>}
            {couponError && <p className="text-[11px] text-red-500 font-bold mt-1">✕ {couponError}</p>}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isBn ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Choose Payment Method'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  paymentMethod === 'bkash' ? 'bg-pink-50 border-bkash text-bkash shadow-xs' : 'border-slate-200 text-slate-600'
                }`}
              >
                bKash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  paymentMethod === 'nagad' ? 'bg-amber-50 border-nagad text-nagad shadow-xs' : 'border-slate-200 text-slate-600'
                }`}
              >
                Nagad
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  paymentMethod === 'cash' ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-xs' : 'border-slate-200 text-slate-600'
                }`}
              >
                Cash on Service
              </button>
            </div>
          </div>

          {/* Price Breakdown Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'সার্ভিস চার্জ:' : 'Service Base Charge:'}</span>
              <span className="font-bold">{formatBDT(basePrice, language)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'প্ল্যাটফর্ম সুরক্ষা ফি:' : 'Platform Fee:'}</span>
              <span>+{formatBDT(platformFee, language)}</span>
            </div>
            {isEmergency && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>{isBn ? 'জরুরি এক্সপ্রেস ফি:' : 'Emergency Dispatch Fee:'}</span>
                <span>+{formatBDT(emergencyFee, language)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{isBn ? 'কুপন ডিসকাউন্ট:' : 'Coupon Discount:'}</span>
                <span>-{formatBDT(discount, language)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
              <span>{isBn ? 'সর্বমোট প্রদেয়:' : 'Total Amount:'}</span>
              <span className="text-brand-700">{formatBDT(totalAmount, language)}</span>
            </div>
          </div>
        </div>

        {/* Footer Confirm */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-teal-800 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>7-Day Warranty Included</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'বুকিং নিশ্চিত করুন' : 'Confirm Booking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
