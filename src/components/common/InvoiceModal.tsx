import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download, Building, Phone, Calendar, User } from 'lucide-react';
import { Booking } from '../../types';
import { formatBDT } from '../../utils/currency';
import { useLanguage } from '../../context/LanguageContext';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, booking }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Official Digital Invoice</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {booking.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {isBn ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto font-sans text-slate-800 space-y-6">
          {/* Brand Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg">
                  SM
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">Service Men</h1>
                  <p className="text-[11px] text-slate-500 font-medium">On-Demand Service Marketplace BD</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <div>HQ: Level 8, Gulshan Avenue, Dhaka-1212</div>
                <div>BIN / VAT Reg: 004829103-0101</div>
                <div>Helpline: 16222 | support@servicemen.bd</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs uppercase font-bold text-slate-400">Invoice Number</div>
              <div className="text-lg font-black text-brand-700 font-mono">{booking.invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-1">Date: {booking.completedAt || booking.createdAt}</div>
              
              {/* Payment Status Badge */}
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{booking.paymentStatus === 'paid' ? `PAID via ${booking.paymentMethod.toUpperCase()}` : 'PAYMENT DUE'}</span>
              </div>
            </div>
          </div>

          {/* Customer & Provider Columns */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-600" /> Billed To (Customer)
              </div>
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600 mt-0.5">Phone: {booking.customerPhone}</div>
              <div className="text-slate-600">Location: {booking.location.addressDetails || `${booking.location.thana}, ${booking.location.district}`}</div>
            </div>

            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-brand-600" /> Service Provider
              </div>
              <div className="font-bold text-slate-900 text-sm">{booking.providerName || 'Assigned Pro'}</div>
              <div className="text-slate-600 mt-0.5">Phone: {booking.providerPhone || 'N/A'}</div>
              <div className="text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> NID Verified Technician
              </div>
            </div>
          </div>

          {/* Service Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Service Description</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{booking.serviceName}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{booking.problemDescription}</div>
                  </td>
                  <td className="p-3 text-center capitalize font-medium text-slate-600">
                    {booking.pricingType}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    {formatBDT(booking.baseAmount, language)}
                  </td>
                </tr>

                {booking.partsAmount ? (
                  <tr>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">Replacement Parts & Materials</div>
                      <div className="text-slate-400 text-[11px]">Hardware spares utilized during repair</div>
                    </td>
                    <td className="p-3 text-center text-slate-500">Materials</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {formatBDT(booking.partsAmount, language)}
                    </td>
                  </tr>
                ) : null}

                <tr>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">Platform Safety & Dispatch Fee</div>
                  </td>
                  <td className="p-3 text-center text-slate-500">Service Fee</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    {formatBDT(booking.platformFee, language)}
                  </td>
                </tr>

                {booking.discountAmount ? (
                  <tr className="bg-emerald-50/50">
                    <td className="p-3 text-emerald-800 font-medium">
                      Coupon Promo Discount ({booking.couponCode})
                    </td>
                    <td className="p-3 text-center text-emerald-700 font-medium">Discount</td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      -{formatBDT(booking.discountAmount, language)}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium">{formatBDT(booking.baseAmount + (booking.partsAmount || 0), language)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Fee:</span>
                <span className="font-medium">+{formatBDT(booking.platformFee, language)}</span>
              </div>
              {booking.discountAmount ? (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount:</span>
                  <span>-{formatBDT(booking.discountAmount, language)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-300 pt-2">
                <span>Grand Total:</span>
                <span className="text-brand-700">{formatBDT(booking.totalAmount, language)}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Warranty Certificate Banner */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/80 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                <span>7-Day Service Men Guarantee & Warranty Active</span>
              </div>
              <p className="text-teal-800 mt-0.5">
                This service is covered under our 7-Day Protection Policy. If any recurring issue happens within 7 days, our verified technician will re-inspect and fix it at zero extra service charge.
              </p>
            </div>
          </div>

          {/* Invoice Footer */}
          <div className="text-center border-t border-slate-100 pt-4 text-[11px] text-slate-400">
            Thank you for choosing Service Men Bangladesh. For disputes or assistance, dial 16222 or email support@servicemen.bd.
          </div>
        </div>
      </div>
    </div>
  );
};
