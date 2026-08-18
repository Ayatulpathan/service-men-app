/**
 * Firebase Firestore Automated Seeder
 * Populates Firestore database collections with Bangladesh service dataset.
 */
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { COLLECTIONS } from './firebaseDb';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../data/serviceCategories';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import {
  INITIAL_BOOKINGS,
  INITIAL_JOB_POSTS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_COUPONS,
  INITIAL_CHAT_MESSAGES
} from '../data/mockBookings';

export async function seedFirestoreDatabase() {
  console.log('🌱 Starting Firebase Cloud Firestore Database Seeding...');
  try {
    // 1. Categories
    for (const cat of SERVICE_CATEGORIES) {
      await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
    }

    // 2. Services
    for (const srv of SERVICE_ITEMS) {
      await setDoc(doc(db, COLLECTIONS.SERVICES, srv.id), srv);
    }

    // 3. Locations
    for (let i = 0; i < BANGLADESH_LOCATIONS.length; i++) {
      const loc = BANGLADESH_LOCATIONS[i];
      await setDoc(doc(db, COLLECTIONS.LOCATIONS, `loc-${loc.division.toLowerCase()}`), loc);
    }

    // 4. Providers
    for (const prov of MOCK_PROVIDERS) {
      await setDoc(doc(db, COLLECTIONS.PROVIDERS, prov.id), prov);
    }

    // 5. Bookings
    for (const bk of INITIAL_BOOKINGS) {
      await setDoc(doc(db, COLLECTIONS.BOOKINGS, bk.id), bk);
    }

    // 6. Job Posts
    for (const jp of INITIAL_JOB_POSTS) {
      await setDoc(doc(db, COLLECTIONS.JOB_POSTS, jp.id), jp);
    }

    // 7. Reviews
    for (const rev of INITIAL_REVIEWS) {
      await setDoc(doc(db, COLLECTIONS.REVIEWS, rev.id), rev);
    }

    // 8. Complaints
    for (const cmp of INITIAL_COMPLAINTS) {
      await setDoc(doc(db, COLLECTIONS.COMPLAINTS, cmp.id), cmp);
    }

    // 9. Coupons
    for (const c of INITIAL_COUPONS) {
      await setDoc(doc(db, COLLECTIONS.COUPONS, c.code), c);
    }

    // 10. Chat Messages
    for (const msg of INITIAL_CHAT_MESSAGES) {
      await setDoc(doc(db, COLLECTIONS.CHAT_MESSAGES, msg.id), msg);
    }

    console.log('🎉 Firebase Cloud Firestore Database Seeded Successfully!');
    return true;
  } catch (err) {
    console.warn('Firebase Seeding Notice:', err);
    return false;
  }
}
