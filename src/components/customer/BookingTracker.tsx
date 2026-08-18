import React, { useState } from 'react';
import {
  Booking,
  BookingStatus,
  PaymentMethod
} from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/currency';
import {
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  FileText,
  Star,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { PaymentModal } from '../common/PaymentModal';
import { InvoiceModal } from '../common/InvoiceModal';

interface BookingTrackerProps {
  bookings: Booking[];
  onOpenChat: (bookingId: string) => void;
  onOpenReviewModal: (booking: Booking) => void;
  onOpenComplaintModal: (booking: Booking) => void;
}

export const BookingTracker: React.FC<BookingTrackerProps> = ({
  bookings,
  onOpenChat,
  onOpenReviewModal,
  onOpenComplaintModal
}) => {
  const { language, t } = useLanguage();
  const { updateBookingStatus, payBooking, cancelBooking } = useMarketplace();
  const isBn = language === 'bn';

  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  const STATUS_STEPS: { key: BookingStatus; labelEn: string; labelBn: string; desc: string }[] = [
    { key: 'requested', labelEn: 'Requested', labelBn: 'অনুরোধ পাঠানো হয়েছে', desc: 'Technician matching' },
    { key: 'accepted', labelEn: 'Accepted', labelBn: 'গৃহীত হয়েছে', desc: 'Pro assigned & confirmed' },
    { key: 'on_the_way', labelEn: 'On The Way', labelBn: 'রওয়ানা হয়েছেন', desc: 'Arriving in ~15-20 min' },
    { key: 'service_started', labelEn: 'In Progress', labelBn: 'কাজ চলমান', desc: 'Work in execution' },
    { key: 'service_completed', labelEn: 'Completed', labelBn: 'কাজ সম্পন্ন', desc: 'Ready for verification' },
    { key: 'payment_completed', labelEn: 'Paid & Closed', labelBn: 'পেমেন্ট সম্পন্ন', desc: 'Warranty active' }
  ];

  const getStepIndex = (status: BookingStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  const handleNextDemoStatus = (booking: Booking) => {
    const currentIndex = getStepIndex(booking.status);
    if (currentIndex >= 0 && currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1].key;
      updateBookingStatus(booking.id, nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {isBn ? 'আমার বুকিং ও লাইভ ট্র্যাকিং' : 'My Bookings & Real-Time Tracking'}
          </h2>
          <p className="text-xs text-slate-500">
            {isBn ? 'আপনার সকল চলমান ও পূর্বের সার্ভিসের অবস্থা ট্র্যাক করুন' : 'Track ongoing repairs, technician arrival, chat & view digital invoices'}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No active bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => {
            const currentStepIdx = getStepIndex(booking.status);
            const isCancelled = booking.status === 'cancelled';
            const isCompleted = booking.status === 'payment_completed';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 bg-slate-50 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {booking.isEmergency ? <Zap className="w-6 h-6 text-amber-300" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                          {booking.id}
                        </span>
                        {booking.isEmergency && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                            24/7 Emergency
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          {booking.createdAt}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {isBn ? (booking.serviceNameBn || booking.serviceName) : booking.serviceName}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-redaccent-500" />
                        <span>{booking.location.area}, {booking.location.thana} ({booking.location.addressDetails})</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Invoice Trigger */}
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-xs text-slate-400 uppercase font-bold">Total Amount</div>
                    <div className="text-lg font-black text-brand-700">
                      {formatBDT(booking.totalAmount, language)}
                    </div>
                    <div className="flex items-center md:justify-end gap-2 mt-1">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.paymentStatus === 'paid' ? `Paid (${booking.paymentMethod.toUpperCase()})` : 'Payment Due'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Steps Lifecycle */}
                {!isCancelled && (
                  <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div
                            key={step.key}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                                : isDone
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                            }`}
                          >
                            <div className="flex justify-center mb-1.5">
                              {isDone ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {isBn ? step.labelBn : step.labelEn}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {step.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Body Details & Assigned Pro */}
                <div className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Pro info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.providerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80'}
                      alt={booking.providerName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-xs"
                    />
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase">Assigned Technician</div>
                      <div className="text-sm font-black text-slate-900">{booking.providerName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{booking.providerPhone}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> NID Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Live Chat */}
                    <button
                      onClick={() => onOpenChat(booking.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4 text-brand-400" />
                      <span>{isBn ? 'চ্যাট করুন' : 'Live Chat'}</span>
                    </button>

                    {/* Direct Call */}
                    <a
                      href={`tel:${booking.providerPhone}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4 text-brand-600" />
                      <span>{isBn ? 'কল দিন' : 'Call'}</span>
                    </a>

                    {/* Invoice */}
                    <button
                      onClick={() => setSelectedBookingForInvoice(booking)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span>{isBn ? 'ইনভয়েস' : 'Invoice'}</span>
                    </button>

                    {/* Pay Button if pending and completed */}
                    {booking.paymentStatus === 'pending' && (
                      <button
                        onClick={() => setSelectedBookingForPayment(booking)}
                        className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <span>{isBn ? 'পেমেন্ট করুন' : 'Pay Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Rate & Review (if completed) */}
                    {isCompleted && (
                      <button
                        onClick={() => onOpenReviewModal(booking)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>{isBn ? 'রিভিউ দিন' : 'Rate Pro'}</span>
                      </button>
                    )}

                    {/* Complaint Button */}
                    <button
                      onClick={() => onOpenComplaintModal(booking)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="File a Dispute or Complaint"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulation Step Advancer for Demo Testing */}
                <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span>Demo Simulator: Fast forward technician lifecycle</span>
                  </div>

                  <div className="flex gap-2">
                    {booking.status !== 'payment_completed' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleNextDemoStatus(booking)}
                        className="font-bold text-brand-700 bg-brand-100/80 hover:bg-brand-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        Advance Step ➔
                      </button>
                    )}
                    {booking.status === 'requested' && (
                      <button
                        onClick={() => cancelBooking(booking.id, 'Customer cancelled')}
                        className="text-red-500 hover:underline font-semibold"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          bookingId={selectedBookingForPayment.id}
          serviceName={selectedBookingForPayment.serviceName}
          totalAmount={selectedBookingForPayment.totalAmount}
          onPaymentSuccess={(method) => {
            payBooking(selectedBookingForPayment.id, method);
          }}
        />
      )}

      {/* Digital Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          isOpen={!!selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
          booking={selectedBookingForInvoice}
        />
      )}
    </div>
  );
};
