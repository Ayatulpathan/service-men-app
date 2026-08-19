import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from '../config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type ActivePersona = 'customer' | 'provider' | 'admin' | 'guest';

export interface AuthCredentials {
  identifier: string; // Email or Phone
  password: string;
  role: UserRole;
  user: User;
}

interface RegisterData {
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'provider';
  division: string;
  district: string;
  thana: string;
  area: string;
  nidNumber?: string;
}

interface AuthContextType {
  persona: ActivePersona;
  setPersona: (persona: ActivePersona) => void;
  currentUser: User | null;
  activeProviderId: string;
  isAuthenticated: boolean;
  loginWithCredentials: (identifier: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  registerUser: (data: RegisterData) => Promise<{ success: boolean; message: string; user?: User }>;
  loginAsDemoPersona: (role: UserRole) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

// Built-in verified system users & credentials
export const DEMO_CREDENTIALS: AuthCredentials[] = [
  {
    identifier: 'customer@servicemen.bd',
    password: 'password123',
    role: 'customer',
    user: {
      id: 'user-c1',
      name: 'Shakil Ahmed',
      nameBn: 'শাকিল আহমেদ',
      phone: '01712-987654',
      email: 'customer@servicemen.bd',
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
    }
  },
  {
    identifier: 'provider@servicemen.bd',
    password: 'provider123',
    role: 'provider',
    user: {
      id: 'prov-1',
      name: 'Md. Rafiqul Islam',
      nameBn: 'মো: রফিকুল ইসলাম',
      phone: '01711-234567',
      email: 'provider@servicemen.bd',
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
    }
  },
  {
    identifier: 'admin@servicemen.bd',
    password: 'admin123',
    role: 'admin',
    user: {
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
    }
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<ActivePersona>(() => {
    const saved = localStorage.getItem('sm_persona');
    return (saved as ActivePersona) || 'customer';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sm_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch {}
    }
    return DEMO_CREDENTIALS[0].user;
  });

  const [activeProviderId, setActiveProviderId] = useState<string>('prov-1');

  // Save session changes
  useEffect(() => {
    localStorage.setItem('sm_persona', persona);
    if (currentUser) {
      localStorage.setItem('sm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sm_current_user');
    }
  }, [persona, currentUser]);

  const setPersona = (newPersona: ActivePersona) => {
    setPersonaState(newPersona);
    if (newPersona === 'customer') {
      setCurrentUser(DEMO_CREDENTIALS[0].user);
    } else if (newPersona === 'provider') {
      setCurrentUser(DEMO_CREDENTIALS[1].user);
      setActiveProviderId('prov-1');
    } else if (newPersona === 'admin') {
      setCurrentUser(DEMO_CREDENTIALS[2].user);
    } else {
      setCurrentUser(null);
    }
  };

  // 1. Credentials-based Login
  const loginWithCredentials = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check built-in demo credentials or registered users
    const matched = DEMO_CREDENTIALS.find(
      c => (c.identifier.toLowerCase() === cleanId || c.user.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) &&
           c.password === cleanPass
    );

    if (matched) {
      setCurrentUser(matched.user);
      setPersonaState(matched.role);
      if (matched.role === 'provider') setActiveProviderId(matched.user.id);
      return {
        success: true,
        message: `Welcome back, ${matched.user.name}! (${matched.role.toUpperCase()} mode)`,
        user: matched.user
      };
    }

    // Check custom registered users in LocalStorage or Firestore
    const registeredUsersJson = localStorage.getItem('sm_registered_users');
    if (registeredUsersJson) {
      try {
        const regUsers: (AuthCredentials & { password: string })[] = JSON.parse(registeredUsersJson);
        const userFound = regUsers.find(
          u => (u.identifier.toLowerCase() === cleanId || u.user.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) &&
               u.password === cleanPass
        );
        if (userFound) {
          setCurrentUser(userFound.user);
          setPersonaState(userFound.role);
          if (userFound.role === 'provider') setActiveProviderId(userFound.user.id);
          return {
            success: true,
            message: `Login successful as ${userFound.user.name}!`,
            user: userFound.user
          };
        }
      } catch (e) {
        console.warn('Error reading registered users:', e);
      }
    }

    return {
      success: false,
      message: 'Invalid credentials. Please check your Email/Phone number or Password.'
    };
  };

  // 2. Account Registration / Sign Up
  const registerUser = async (
    data: RegisterData
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const newUserId = `user-${data.role[0]}-${Date.now().toString().slice(-4)}`;
    const defaultAvatar = data.role === 'provider'
      ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

    const newUser: User = {
      id: newUserId,
      name: data.name,
      nameBn: data.nameBn || data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatar: defaultAvatar,
      division: data.division,
      district: data.district,
      thana: data.thana,
      area: data.area,
      addressDetails: `${data.area}, ${data.thana}, ${data.district}`,
      loyaltyPoints: 100,
      referralCode: `${data.name.slice(0, 4).toUpperCase()}100`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newCredential: AuthCredentials = {
      identifier: data.email,
      password: data.password,
      role: data.role,
      user: newUser
    };

    // Save to LocalStorage registry
    const existing = localStorage.getItem('sm_registered_users');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newCredential);
    localStorage.setItem('sm_registered_users', JSON.stringify(list));

    // Save to Cloud Firestore
    try {
      await setDoc(doc(db, 'users', newUserId), {
        ...newUser,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore user save notice:', err);
    }

    // Auto login
    setCurrentUser(newUser);
    setPersonaState(data.role);
    if (data.role === 'provider') setActiveProviderId(newUserId);

    return {
      success: true,
      message: `Account created successfully! Welcome to Service Men, ${newUser.name}.`,
      user: newUser
    };
  };

  // 3. 1-Click Demo Persona Login
  const loginAsDemoPersona = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentUser(DEMO_CREDENTIALS[0].user);
      setPersonaState('customer');
    } else if (role === 'provider') {
      setCurrentUser(DEMO_CREDENTIALS[1].user);
      setPersonaState('provider');
      setActiveProviderId('prov-1');
    } else if (role === 'admin') {
      setCurrentUser(DEMO_CREDENTIALS[2].user);
      setPersonaState('admin');
    }
  };

  // 4. Logout
  const logout = () => {
    setCurrentUser(null);
    setPersonaState('guest');
    localStorage.removeItem('sm_current_user');
  };

  const updateUser = (fields: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    try {
      setDoc(doc(db, 'users', updated.id), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore updateUser:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        persona,
        setPersona,
        currentUser,
        activeProviderId,
        isAuthenticated: !!currentUser,
        loginWithCredentials,
        registerUser,
        loginAsDemoPersona,
        logout,
        updateUser
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
