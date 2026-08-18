/**
 * Firebase Cloud Firestore Database Service
 * Provides real-time listeners, document CRUD operations, and collection sync.
 */
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import {
  Booking,
  JobPost,
  JobBid,
  Provider,
  Review,
  Complaint,
  Coupon,
  ChatMessage,
  WithdrawalRequest
} from '../types';

// Collection Constants
export const COLLECTIONS = {
  CATEGORIES: 'categories',
  SERVICES: 'services',
  LOCATIONS: 'locations',
  PROVIDERS: 'providers',
  BOOKINGS: 'bookings',
  JOB_POSTS: 'job_posts',
  JOB_BIDS: 'job_bids',
  REVIEWS: 'reviews',
  COMPLAINTS: 'complaints',
  CHAT_MESSAGES: 'chat_messages',
  COUPONS: 'coupons',
  WITHDRAWALS: 'withdrawals'
};

export const firebaseDb = {
  // Real-time collection listener
  subscribeToCollection: <T>(collectionName: string, callback: (data: T[]) => void) => {
    try {
      const colRef = collection(db, collectionName);
      return onSnapshot(colRef, snapshot => {
        const items: T[] = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[];
        callback(items);
      }, (err) => {
        console.warn(`Firestore Listener [${collectionName}]:`, err.message);
      });
    } catch (e) {
      console.warn(`Firestore collection subscription failed [${collectionName}]`, e);
      return () => {};
    }
  },

  // 1. Bookings
  createBooking: async (booking: Booking) => {
    try {
      await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking.id), booking);
    } catch (err) {
      console.warn('Firestore createBooking error:', err);
    }
  },

  updateBooking: async (bookingId: string, data: Partial<Booking>) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId), data);
    } catch (err) {
      console.warn('Firestore updateBooking error:', err);
    }
  },

  // 2. Providers
  updateProvider: async (providerId: string, data: Partial<Provider>) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PROVIDERS, providerId), data);
    } catch (err) {
      console.warn('Firestore updateProvider error:', err);
    }
  },

  // 3. Job Posts & Bids
  createJobPost: async (jobPost: JobPost) => {
    try {
      await setDoc(doc(db, COLLECTIONS.JOB_POSTS, jobPost.id), jobPost);
    } catch (err) {
      console.warn('Firestore createJobPost error:', err);
    }
  },

  submitBid: async (jobPostId: string, bid: JobBid) => {
    try {
      await setDoc(doc(db, COLLECTIONS.JOB_BIDS, bid.id), bid);
    } catch (err) {
      console.warn('Firestore submitBid error:', err);
    }
  },

  // 4. Reviews & Complaints
  createReview: async (review: Review) => {
    try {
      await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review);
    } catch (err) {
      console.warn('Firestore createReview error:', err);
    }
  },

  createComplaint: async (complaint: Complaint) => {
    try {
      await setDoc(doc(db, COLLECTIONS.COMPLAINTS, complaint.id), complaint);
    } catch (err) {
      console.warn('Firestore createComplaint error:', err);
    }
  },

  updateComplaint: async (complaintId: string, data: Partial<Complaint>) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.COMPLAINTS, complaintId), data);
    } catch (err) {
      console.warn('Firestore updateComplaint error:', err);
    }
  },

  // 5. Chat Messages
  sendMessage: async (msg: ChatMessage) => {
    try {
      await setDoc(doc(db, COLLECTIONS.CHAT_MESSAGES, msg.id), msg);
    } catch (err) {
      console.warn('Firestore sendMessage error:', err);
    }
  },

  // 6. Withdrawals
  createWithdrawal: async (w: WithdrawalRequest) => {
    try {
      await setDoc(doc(db, COLLECTIONS.WITHDRAWALS, w.id), w);
    } catch (err) {
      console.warn('Firestore createWithdrawal error:', err);
    }
  },

  updateWithdrawal: async (wId: string, data: Partial<WithdrawalRequest>) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.WITHDRAWALS, wId), data);
    } catch (err) {
      console.warn('Firestore updateWithdrawal error:', err);
    }
  }
};
