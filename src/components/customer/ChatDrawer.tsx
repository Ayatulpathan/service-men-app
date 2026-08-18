import React, { useState } from 'react';
import { X, Send, Phone, MapPin, Image, ShieldCheck, CheckCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, bookingId }) => {
  const { language } = useLanguage();
  const { bookings, getBookingMessages, sendMessage } = useMarketplace();
  const { currentUser, persona } = useAuth();
  const isBn = language === 'bn';

  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen || !bookingId) return null;

  const currentBooking = bookings.find(b => b.id === bookingId);
  const messages = getBookingMessages(bookingId);

  const senderRole = persona === 'provider' ? 'provider' : 'customer';
  const senderId = currentUser?.id || (persona === 'provider' ? 'prov-1' : 'user-c1');
  const senderName = currentUser?.name || (persona === 'provider' ? 'Md. Rafiqul Islam' : 'Shakil Ahmed');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    sendMessage(bookingId, senderId, senderName, senderRole, text.trim());
    setInputMessage('');
  };

  const quickReplies = isBn ? [
    "কখন পৌঁছাবেন?",
    "দরকারি পার্টস সাথে এনেছেন কি?",
    "আমি লোকেশনে আছি, চলে আসুন।"
  ] : [
    "What is your expected arrival time?",
    "Do you have the required replacement tools?",
    "I am at home, please come in."
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={
                persona === 'provider'
                  ? currentBooking?.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  : currentBooking?.providerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80'
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-400"
            />
            <div>
              <div className="font-bold text-sm">
                {persona === 'provider' ? currentBooking?.customerName : currentBooking?.providerName}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>Online • {currentBooking?.serviceName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${persona === 'provider' ? currentBooking?.customerPhone : currentBooking?.providerPhone}`}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-brand-50 border-b border-brand-100 flex items-center gap-2 text-[11px] text-brand-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{isBn ? 'নিরাপদ প্ল্যাটফর্ম চ্যাট। সকল বুকিং ওয়ারেন্টির অন্তর্ভুক্ত।' : 'Secure In-App Chat. All interactions are protected under warranty.'}</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map(msg => {
            const isMe = msg.senderRole === senderRole;
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-semibold">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {msg.senderName} • {msg.timestamp}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] font-medium leading-relaxed ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
          {quickReplies.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={isBn ? 'বার্তা লিখুন...' : 'Type your message...'}
              className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-brand-600 disabled:opacity-40 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
