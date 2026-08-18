import React from 'react';
import { useAuth, ActivePersona } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Users, Wrench, Shield, Globe, RotateCcw, Check, Database } from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { persona, setPersona } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { resetToDefaults, isDatabaseConnected } = useMarketplace();

  const personas: { id: ActivePersona; labelEn: string; labelBn: string; icon: any; color: string }[] = [
    { id: 'guest', labelEn: 'Public Marketplace', labelBn: 'মার্কেটপ্লেস হোম', icon: Globe, color: 'hover:bg-slate-700' },
    { id: 'customer', labelEn: 'Customer Mode', labelBn: 'কাস্টমার মোড', icon: Users, color: 'hover:bg-blue-700' },
    { id: 'provider', labelEn: 'Service Provider', labelBn: 'সার্ভিস প্রোভাইডার', icon: Wrench, color: 'hover:bg-emerald-700' },
    { id: 'admin', labelEn: 'Administrator', labelBn: 'এডমিন প্যানেল', icon: Shield, color: 'hover:bg-purple-700' },
  ];

  const handleReset = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি ডেমো ডাটা রিসেট করতে চান?' : 'Reset all marketplace bookings, chats and mock data to initial state?')) {
      resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="no-print bg-slate-950 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Persona Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
            {language === 'bn' ? 'সরাসরি রোল পরিবর্তন:' : 'Switch Role:'}
          </span>
          {personas.map(p => {
            const Icon = p.icon;
            const isActive = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-xs font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? p.labelBn : p.labelEn}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Right: Database Indicator & Language toggle & Reset */}
        <div className="flex items-center gap-2">
          {/* Database Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>DB: {isDatabaseConnected ? 'Prisma SQL' : 'Local'}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            title="Toggle English / Bangla"
          >
            <span className={language === 'en' ? 'text-brand-400 font-extrabold' : 'text-slate-400'}>EN</span>
            <span className="text-slate-600">|</span>
            <span className={language === 'bn' ? 'text-brand-400 font-extrabold' : 'text-slate-400'}>বাংলা</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 text-[11px] transition-colors"
            title="Reset to fresh demo dataset"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">{language === 'bn' ? 'ডেমো রিসেট' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
