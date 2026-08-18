import React from 'react';
import { useAuth, ActivePersona } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Users, Wrench, Shield, Globe, RotateCcw, Check, Database } from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { persona, setPersona } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { resetToDefaults, isDatabaseConnected } = useMarketplace();

  const personas: { id: ActivePersona; labelEn: string; labelBn: string; icon: any }[] = [
    { id: 'guest', labelEn: 'Public Marketplace', labelBn: 'মার্কেটপ্লেস হোম', icon: Globe },
    { id: 'customer', labelEn: 'Customer Mode', labelBn: 'কাস্টমার মোড', icon: Users },
    { id: 'provider', labelEn: 'Service Provider', labelBn: 'সার্ভিস প্রোভাইডার', icon: Wrench },
    { id: 'admin', labelEn: 'Administrator', labelBn: 'এডমিন প্যানেল', icon: Shield },
  ];

  const handleReset = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি ডেমো ডাটা রিসেট করতে চান?' : 'Reset all marketplace bookings, chats and mock data to initial state?')) {
      resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="no-print bg-slate-950 text-slate-200 border-b border-slate-800 text-xs py-1 px-2 sm:px-4 sticky top-0 z-50 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto py-0.5 scrollbar-none">
        {/* Left: Persona Pills */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline mr-1 shrink-0">
            {language === 'bn' ? 'সরাসরি রোল:' : 'Role:'}
          </span>
          {personas.map(p => {
            const Icon = p.icon;
            const isActive = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{language === 'bn' ? p.labelBn : p.labelEn}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right: Database Indicator & Language toggle & Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Database Status Indicator */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 shrink-0">
            <Database className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">DB: {isDatabaseConnected ? 'Prisma SQL' : 'Local'}</span>
            <span className="sm:hidden">{isDatabaseConnected ? 'SQL' : 'Local'}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] border border-slate-700 transition-colors shrink-0"
            title="Toggle English / Bangla"
          >
            <span className={language === 'en' ? 'text-brand-400 font-black' : 'text-slate-400'}>EN</span>
            <span className="text-slate-600">|</span>
            <span className={language === 'bn' ? 'text-brand-400 font-black' : 'text-slate-400'}>বাংলা</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 text-[10px] transition-colors shrink-0"
            title="Reset to fresh demo dataset"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span className="hidden md:inline">{language === 'bn' ? 'ডেমো রিসেট' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
