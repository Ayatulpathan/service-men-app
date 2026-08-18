import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Booking, BookingStatus } from '../../types';
import { formatBDT } from '../../utils/currency';
import {
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Plus,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingRequestsProps {
  onOpenChat: (bookingId: string) => void;
}

export const BookingRequests: React.FC<BookingRequestsProps> = ({ onOpenChat }) => {
  const { activeProviderId } = useAuth();
  const { language } = useLanguage();
  const { bookings, updateBookingStatus } = useMarketplace();
  const isBn = language === 'bn';

  const [partsInputBookingId, setPartsInputBookingId] = useState<string | null>(null);
  const [partsAmount, setPartsAmount] = useState<number>(350);

  const providerBookings = bookings.filter(b => b.providerId === activeProviderId || !b.providerId);

  const handleStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    updateBookingStatus(bookingId, nextStatus);
    if (nextStatus === 'service_completed' || nextStatus === 'payment_completed') {
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {}
    }
  };

  const handleAddParts = (bookingId: string) => {
    updateBookingStatus(bookingId, 'service_started', { partsAmount });
    setPartsInputBookingId(null);
    alert(isBn ? `৳${partsAmount} পার্টস মূল্য ইনভয়েসে যুক্ত হয়েছে` : `Added ৳${partsAmount} replacement parts to invoice.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {isBn ? 'বুকিং অনুরোধ ও কাজের অগ্রগতি' : 'Job Requests & Active Orders'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn ? 'কাস্টমারের অনুরোধ গ্রহণ করুন এবং কাজের প্রতি ধাপ আপডেট করুন' : 'Accept new jobs, update travel status & add on-site parts charges'}
        </p>
      </div>

      {providerBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">No booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providerBookings.map(booking => {
            const isRequested = booking.status === 'requested';
            const isAccepted = booking.status === 'accepted';
            const isOnTheWay = booking.status === 'on_the_way';
            const isInProgress = booking.status === 'service_started';
            const isCompleted = booking.status === 'service_completed';
            const isPaid = booking.status === 'payment_completed';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Customer & Job Info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      {booking.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{booking.createdAt}</span>
                    {booking.isEmergency && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        24/7 Emergency
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900">{booking.serviceName}</h3>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{booking.problemDescription}"
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      👤 {booking.customerName} (<a href={`tel:${booking.customerPhone}`} className="text-brand-600 font-mono hover:underline">{booking.customerPhone}</a>)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-redaccent-500" />
                      {booking.location.area}, {booking.location.thana} ({booking.location.addressDetails})
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.scheduledDate} • {booking.scheduledTime}
                    </span>
                  </div>

                  {booking.partsAmount ? (
                    <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg inline-block font-semibold">
                      Spares / Parts: +{formatBDT(booking.partsAmount, language)}
                    </div>
                  ) : null}
                </div>

                {/* Right: Status Flow Actions */}
                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold lg:text-right">Total Payout</div>
                    <div className="text-xl font-black text-brand-700 lg:text-right">
                      {formatBDT(booking.totalAmount, language)}
                    </div>
                    <div className="text-[10px] text-slate-500 lg:text-right">
                      (Net: {formatBDT(Math.round(booking.totalAmount * 0.9), language)} after 10% fee)
                    </div>
                  </div>

                  {/* Progressive Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Chat button */}
                    <button
                      onClick={() => onOpenChat(booking.id)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Chat with customer"
                    >
                      <MessageSquare className="w-4 h-4 text-brand-600" />
                    </button>

                    {/* Step 1: Requested -> Accept/Reject */}
                    {isRequested && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'accepted')}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'গ্রহণ করুন' : 'Accept Job'}</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          {isBn ? 'বাতিল' : 'Decline'}
                        </button>
                      </>
                    )}

                    {/* Step 2: Accepted -> Start Travel */}
                    {isAccepted && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'on_the_way')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        {isBn ? 'রওয়ানা হয়েছি (On The Way)' : 'Start Travel (On The Way)'}
                      </button>
                    )}

                    {/* Step 3: On The Way -> Start Service */}
                    {isOnTheWay && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'service_started')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        {isBn ? 'কাজ শুরু করেছি' : 'Mark Service Started'}
                      </button>
                    )}

                    {/* Step 4: Service Started -> Add Parts or Complete */}
                    {isInProgress && (
                      <>
                        <button
                          onClick={() => setPartsInputBookingId(booking.id)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Parts Bill</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(booking.id, 'service_completed')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          {isBn ? 'কাজ সম্পন্ন করুন' : 'Complete Job'}
                        </button>
                      </>
                    )}

                    {/* Step 5: Service Completed -> Collect Payment */}
                    {isCompleted && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'payment_completed')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        {isBn ? 'পেমেন্ট গ্রহণ নিশ্চিত করুন' : 'Confirm Payment Collected'}
                      </button>
                    )}

                    {/* Step 6: Paid */}
                    {isPaid && (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Completed & Paid
                      </span>
                    )}
                  </div>

                  {/* Parts Input Popover */}
                  {partsInputBookingId === booking.id && (
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-2xl space-y-2 mt-2 w-full">
                      <div className="text-[11px] font-bold text-slate-700">Add Spare Parts Cost (৳):</div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={partsAmount}
                          onChange={e => setPartsAmount(Number(e.target.value))}
                          className="w-24 p-1.5 border rounded-lg text-xs font-mono font-bold"
                        />
                        <button
                          onClick={() => handleAddParts(booking.id)}
                          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setPartsInputBookingId(null)}
                          className="px-2 py-1.5 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
