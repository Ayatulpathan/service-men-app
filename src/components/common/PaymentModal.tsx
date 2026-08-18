import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Smartphone, CreditCard, Banknote, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types';
import { formatBDT } from '../../utils/currency';
import { useLanguage } from '../../context/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceName: string;
  totalAmount: number;
  onPaymentSuccess: (method: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  serviceName,
  totalAmount,
  onPaymentSuccess
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [step, setStep] = useState<'select' | 'mfs_number' | 'mfs_otp' | 'mfs_pin' | 'card_info' | 'processing' | 'success'>('select');
  const [phone, setPhone] = useState('01712987654');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleStartPayment = () => {
    if (selectedMethod === 'cash') {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        triggerConfetti();
        setTimeout(() => {
          onPaymentSuccess('cash');
          onClose();
        }, 1500);
      }, 1000);
      return;
    }

    if (selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') {
      setStep('mfs_number');
      return;
    }

    if (selectedMethod === 'card') {
      setStep('card_info');
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 11) {
      setErrorMsg(isBn ? 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন' : 'Enter valid 11-digit BD mobile number');
      return;
    }
    setErrorMsg('');
    setStep('processing');
    setTimeout(() => {
      setStep('mfs_otp');
      setOtp('7392'); // Pre-fill mock OTP for smooth demo
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      setErrorMsg(isBn ? '৪ সংখ্যার ওটিপি কোড দিন' : 'Enter 4-digit OTP code');
      return;
    }
    setErrorMsg('');
    setStep('mfs_pin');
  };

  const handleConfirmPin = () => {
    if (!pin || pin.length < 4) {
      setErrorMsg(isBn ? 'গোপন পিন কোড দিন' : 'Enter secret PIN');
      return;
    }
    setErrorMsg('');
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      triggerConfetti();
      setTimeout(() => {
        onPaymentSuccess(selectedMethod);
        onClose();
      }, 1800);
    }, 1200);
  };

  const handleCardPayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      triggerConfetti();
      setTimeout(() => {
        onPaymentSuccess('card');
        onClose();
      }, 1800);
    }, 1200);
  };

  // MFS Styling
  const getMfsTheme = () => {
    if (selectedMethod === 'bkash') {
      return {
        bg: 'bg-bkash',
        text: 'text-bkash',
        border: 'border-bkash',
        name: 'bKash Payment Gateway'
      };
    }
    if (selectedMethod === 'nagad') {
      return {
        bg: 'bg-nagad',
        text: 'text-nagad',
        border: 'border-nagad',
        name: 'Nagad Online Gateway'
      };
    }
    return {
      bg: 'bg-rocket',
      text: 'text-rocket',
      border: 'border-rocket',
      name: 'Rocket DBBL Gateway'
    };
  };

  const mfsTheme = getMfsTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Select Method */}
        {step === 'select' && (
          <div className="p-6">
            <div className="text-center mb-5">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Choose Payment Method'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {serviceName} • Total: <span className="font-bold text-slate-800">{formatBDT(totalAmount, language)}</span>
              </p>
            </div>

            {/* Methods Grid */}
            <div className="space-y-2.5 mb-6">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bkash')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  selectedMethod === 'bkash'
                    ? 'border-bkash bg-pink-50/50 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bkash text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-xs">
                    bKash
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">bKash MFS</div>
                    <div className="text-xs text-slate-500">
                      {isBn ? 'বিকাশ ওয়ালেট থেকে ইনস্ট্যান্ট পেমেন্ট' : 'Fast, secure mobile wallet'}
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'bkash' ? 'border-bkash bg-bkash' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'bkash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setSelectedMethod('nagad')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  selectedMethod === 'nagad'
                    ? 'border-nagad bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-nagad text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-xs">
                    নগদ
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">Nagad Post Office MFS</div>
                    <div className="text-xs text-slate-500">
                      {isBn ? 'ডাক বিভাগের ডিজিটাল লেনদেন' : 'Direct from Nagad account'}
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'nagad' ? 'border-nagad bg-nagad' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'nagad' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setSelectedMethod('rocket')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  selectedMethod === 'rocket'
                    ? 'border-rocket bg-purple-50/50 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rocket text-white font-black text-[10px] flex items-center justify-center tracking-tighter shadow-xs">
                    Rocket
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">Dutch-Bangla Rocket</div>
                    <div className="text-xs text-slate-500">DBBL 12-digit account</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'rocket' ? 'border-rocket bg-rocket' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'rocket' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">Visa / Mastercard / Amex</div>
                    <div className="text-xs text-slate-500">SSLCommerz Gateway</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setSelectedMethod('cash')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  selectedMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">
                      {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Service Completion'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isBn ? 'কাজ সম্পন্ন হওয়ার পর নগদ টাকা দিন' : 'Pay technician directly after work'}
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'cash' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'cash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleStartPayment}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isBn ? 'পেমেন্ট প্রক্রিয়া এগিয়ে নিন' : 'Proceed to Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: MFS Phone Number */}
        {step === 'mfs_number' && (
          <div className="p-6">
            <div className={`p-4 rounded-xl ${mfsTheme.bg} text-white mb-6 text-center shadow-md`}>
              <div className="text-xs uppercase font-bold tracking-wider opacity-90">{mfsTheme.name}</div>
              <div className="text-2xl font-black mt-1">{formatBDT(totalAmount, language)}</div>
              <div className="text-xs opacity-80 mt-0.5">Booking ID: {bookingId}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'আপনার একাউন্ট মোবাইল নম্বর' : 'Enter Your Account Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold text-sm">+88</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                🔒 {isBn ? 'আপনার নম্বরে একটি ৪ সংখ্যার ওটিপি ভেরিফিকেশন কোড পাঠানো হবে।' : 'A 4-digit verification code will be sent to your mobile.'}
              </div>

              <button
                onClick={handleSendOtp}
                className={`w-full py-3 rounded-xl font-bold text-white ${mfsTheme.bg} hover:opacity-90 transition-all shadow-md`}
              >
                {isBn ? 'ওটিপি কোড পাঠান' : 'Send Verification OTP'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MFS OTP Verification */}
        {step === 'mfs_otp' && (
          <div className="p-6">
            <div className={`p-4 rounded-xl ${mfsTheme.bg} text-white mb-6 text-center shadow-md`}>
              <div className="text-xs uppercase font-bold tracking-wider opacity-90">Verify Mobile OTP</div>
              <div className="text-sm font-semibold mt-1">Sent to +88 {phone}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  {isBn ? '৪ সংখ্যার ওটিপি কোড লিখুন' : 'Enter 4-Digit Code'}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="7392"
                  className="w-full text-center py-3 border border-slate-300 rounded-xl font-mono text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <p className="text-[11px] text-center text-slate-400 mt-1">
                  Demo auto-filled: 7392
                </p>
                {errorMsg && <p className="text-xs text-red-500 mt-1 text-center">{errorMsg}</p>}
              </div>

              <button
                onClick={handleVerifyOtp}
                className={`w-full py-3 rounded-xl font-bold text-white ${mfsTheme.bg} hover:opacity-90 transition-all shadow-md`}
              >
                {isBn ? 'ওটিপি নিশ্চিত করুন' : 'Confirm OTP'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MFS PIN */}
        {step === 'mfs_pin' && (
          <div className="p-6">
            <div className={`p-4 rounded-xl ${mfsTheme.bg} text-white mb-6 text-center shadow-md`}>
              <div className="text-xs uppercase font-bold tracking-wider opacity-90">Enter Wallet PIN</div>
              <div className="text-2xl font-black mt-1">{formatBDT(totalAmount, language)}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  {isBn ? 'আপনার বিকাশ/নগদ পিন নম্বর দিন' : 'Enter 5-digit PIN'}
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full text-center py-3 border border-slate-300 rounded-xl font-mono text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <p className="text-[11px] text-center text-slate-400 mt-1">
                  Demo: enter any PIN (e.g. 12345)
                </p>
                {errorMsg && <p className="text-xs text-red-500 mt-1 text-center">{errorMsg}</p>}
              </div>

              <button
                onClick={handleConfirmPin}
                className={`w-full py-3 rounded-xl font-bold text-white ${mfsTheme.bg} hover:opacity-90 transition-all shadow-md`}
              >
                {isBn ? 'পেমেন্ট সম্পন্ন করুন' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        )}

        {/* STEP Card Info */}
        {step === 'card_info' && (
          <div className="p-6">
            <div className="bg-slate-900 text-white p-4 rounded-xl mb-5 shadow-md">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span>SSLCOMMERZ SECURE GATEWAY</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black">{formatBDT(totalAmount, language)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVV/CVC</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleCardPayment}
                className="w-full py-3 mt-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
              >
                Pay {formatBDT(totalAmount, language)}
              </button>
            </div>
          </div>
        )}

        {/* STEP Processing */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {isBn ? 'পেমেন্ট প্রসেসিং হচ্ছে...' : 'Processing Transaction...'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn ? 'অনুগ্রহ করে অপেক্ষা করুন' : 'Connecting to Bangladesh Banking Network'}
            </p>
          </div>
        )}

        {/* STEP Success */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {isBn ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
            </h3>
            <p className="text-xs text-slate-600">
              {isBn ? 'আপনার ডিজিটাল ইনভয়েস ও ওয়ারেন্টি সক্রিয় হয়েছে।' : 'Digital Invoice & 7-Day Warranty Activated.'}
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
              TXN: BD{Math.floor(100000000 + Math.random() * 900000000)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
