import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase Project Credentials configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoServiceMenKey2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "service-men-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "service-men-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "service-men-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "266830532258",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:266830532258:web:a1b2c3d4e5f6g7h8"
};

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore Instance
export const db = getFirestore(app);

export default app;
