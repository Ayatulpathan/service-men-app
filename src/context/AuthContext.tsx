import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

export type ActivePersona = 'customer' | 'provider' | 'admin' | 'guest';

interface AuthContextType {
  persona: ActivePersona;
  setPersona: (persona: ActivePersona) => void;
  currentUser: User | null;
  activeProviderId: string;
  updateUser: (fields: Partial<User>) => void;
  login: (role: UserRole) => void;
  logout: () => void;
}

const DEFAULT_CUSTOMER: User = {
  id: 'user-c1',
  name: 'Shakil Ahmed',
  nameBn: 'শাকিল আহমেদ',
  phone: '01712-987654',
  email: 'shakil.ahmed@example.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  division: 'Dhaka',
  district: 'Dhaka',
  thana: 'Mirpur',
  area: 'Mirpur-2',
  addressDetails: 'House 24, Road 5, Block B, Mirpur-2, Dhaka',
  loyaltyPoints: 350,
  referralCode: 'SHAKIL100',
  createdAt: '2025-06-10'
};

const DEFAULT_PROVIDER_USER: User = {
  id: 'prov-1',
  name: 'Md. Rafiqul Islam',
  nameBn: 'মো: রফিকুল ইসলাম',
  phone: '01711-234567',
  email: 'rafiqul.ac@servicemen.bd',
  role: 'provider',
  avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80',
  division: 'Dhaka',
  district: 'Dhaka',
  thana: 'Mirpur',
  area: 'Mirpur-10',
  addressDetails: 'Shop 12, Mirpur Electronic Market, Dhaka',
  loyaltyPoints: 0,
  referralCode: 'RAFIQ50',
  createdAt: '2023-01-15'
};

const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'System Admin HQ',
  nameBn: 'হেডকোয়ার্টার এডমিন',
  phone: '01900-000111',
  email: 'admin@servicemen.bd',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  division: 'Dhaka',
  district: 'Dhaka',
  thana: 'Gulshan',
  area: 'Gulshan-1',
  loyaltyPoints: 9999,
  referralCode: 'ADMINVIP',
  createdAt: '2022-01-01'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<ActivePersona>(() => {
    const saved = localStorage.getItem('servicemen_persona');
    return (saved as ActivePersona) || 'guest';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedPersona = localStorage.getItem('servicemen_persona');
    if (savedPersona === 'customer') return DEFAULT_CUSTOMER;
    if (savedPersona === 'provider') return DEFAULT_PROVIDER_USER;
    if (savedPersona === 'admin') return DEFAULT_ADMIN;
    return null;
  });

  const [activeProviderId, setActiveProviderId] = useState<string>('prov-1');

  useEffect(() => {
    localStorage.setItem('servicemen_persona', persona);
    if (persona === 'customer') {
      setCurrentUser(DEFAULT_CUSTOMER);
    } else if (persona === 'provider') {
      setCurrentUser(DEFAULT_PROVIDER_USER);
      setActiveProviderId('prov-1');
    } else if (persona === 'admin') {
      setCurrentUser(DEFAULT_ADMIN);
    } else {
      setCurrentUser(null);
    }
  }, [persona]);

  const setPersona = (newPersona: ActivePersona) => {
    setPersonaState(newPersona);
  };

  const login = (role: UserRole) => {
    if (role === 'customer') setPersona('customer');
    else if (role === 'provider') setPersona('provider');
    else if (role === 'admin') setPersona('admin');
  };

  const logout = () => {
    setPersona('guest');
  };

  const updateUser = (fields: Partial<User>) => {
    setCurrentUser(prev => (prev ? { ...prev, ...fields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        persona,
        setPersona,
        currentUser,
        activeProviderId,
        updateUser,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
