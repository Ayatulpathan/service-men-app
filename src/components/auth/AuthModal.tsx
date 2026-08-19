import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BANGLADESH_LOCATIONS } from '../../data/bangladeshLocations';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Shield,
  Wrench,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, registerUser, currentUser, logout } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regRole, setRegRole] = useState<'customer' | 'provider'>('customer');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('Dhaka');
  const [regThana, setRegThana] = useState('Mirpur');
  const [regArea, setRegArea] = useState('Mirpur-2');
  const [regNid, setRegNid] = useState('');

  if (!isOpen) return null;

  const currentDivisionNode = BANGLADESH_LOCATIONS.find(l => l.division === regDivision) || BANGLADESH_LOCATIONS[0];
  const thanaObjects = currentDivisionNode.districts[0]?.thanas || [];
  const thanaNames = thanaObjects.map(t => t.name);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await loginWithCredentials(loginIdentifier, loginPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      division: regDivision,
      district: currentDivisionNode.districts[0]?.name || regDivision,
      thana: regThana,
      area: regArea,
      nidNumber: regNid
    });

    setIsLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Quick autofill demo credentials
  const handleAutofillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setLoginIdentifier(cred.identifier);
    setLoginPassword(cred.password);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="relative bg-slate-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <KeyRound className="w-5 h-5 text-brand-200" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {activeTab === 'login'
                  ? (isBn ? 'লগইন করুন (Credentials Auth)' : 'Sign In with Credentials')
                  : (isBn ? 'নতুন একাউন্ট খুলুন' : 'Create an Account')}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'সার্ভিস মেন প্ল্যাটফর্মে নিরাপদ অ্যাক্সেস' : 'Secure access to Service Men Bangladesh'}
              </p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isBn ? 'লগইন' : 'Sign In'}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isBn ? 'রেজিস্ট্রেশন' : 'Register'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'ইমেইল বা মোবাইল নম্বর *' : 'Email or Phone Number *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="customer@servicemen.bd / 01712987654"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying credentials...'}</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{isBn ? 'লগইন করুন' : 'Sign In with Credentials'}</span>
                  </>
                )}
              </button>

              {/* Quick Demo Credentials Autofill Helper */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? '১-ক্লিক ডেমো ক্রেডেনশিয়াল টেস্ট করুন:' : '1-Click Demo Credentials (Click to Fill):'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_CREDENTIALS.map(cred => (
                    <button
                      key={cred.role}
                      type="button"
                      onClick={() => handleAutofillDemo(cred)}
                      className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {cred.role === 'customer' && <UserIcon className="w-3.5 h-3.5 text-blue-600" />}
                        {cred.role === 'provider' && <Wrench className="w-3.5 h-3.5 text-amber-600" />}
                        {cred.role === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-600" />}
                        <span className="font-extrabold text-[11px] text-slate-800 capitalize group-hover:text-brand-700">
                          {cred.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">{cred.identifier}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">Pass: {cred.password}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isBn ? 'একাউন্টের ধরন নির্বাচন করুন *' : 'Select Account Role *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      regRole === 'customer'
                        ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{isBn ? 'কাস্টমার' : 'Customer'}</div>
                      <div className="text-[10px] text-slate-500">{isBn ? 'সেবা নেওয়ার জন্য' : 'Book home services'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('provider')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      regRole === 'provider'
                        ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{isBn ? 'সার্ভিস প্রোভাইডার' : 'Service Pro'}</div>
                      <div className="text-[10px] text-slate-500">{isBn ? 'আয় ও কাজ করার জন্য' : 'Earn as technician'}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isBn ? 'পুরো নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Tanvir Hossain"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isBn ? 'মোবাইল নম্বর *' : 'Phone Number (BD) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isBn ? 'ইমেইল এড্রেস *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isBn ? 'পাসওয়ার্ড নির্ধারণ করুন *' : 'Create Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Division</label>
                  <select
                    value={regDivision}
                    onChange={e => setRegDivision(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                  >
                    {BANGLADESH_LOCATIONS.map(l => (
                      <option key={l.division} value={l.division}>{l.division}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Thana / Upazila</label>
                  <select
                    value={regThana}
                    onChange={e => setRegThana(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                  >
                    {thanaNames.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Area</label>
                  <input
                    type="text"
                    value={regArea}
                    onChange={e => setRegArea(e.target.value)}
                    placeholder="e.g. Block C"
                    className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Provider NID Field */}
              {regRole === 'provider' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isBn ? 'জাতীয় পরিচয়পত্র নম্বর (NID)' : 'National ID Number (NID)'}
                  </label>
                  <input
                    type="text"
                    value={regNid}
                    onChange={e => setRegNid(e.target.value)}
                    placeholder="1990XXXXXXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>{isBn ? 'একাউন্ট তৈরি হচ্ছে...' : 'Creating your account in Firestore...'}</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{isBn ? 'একাউন্ট তৈরি করুন' : 'Create Account & Sign In'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
