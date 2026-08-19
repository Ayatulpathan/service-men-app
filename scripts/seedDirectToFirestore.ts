import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../src/data/serviceCategories';
import { BANGLADESH_LOCATIONS } from '../src/data/bangladeshLocations';
import { MOCK_PROVIDERS } from '../src/data/mockProviders';
import {
  INITIAL_BOOKINGS,
  INITIAL_JOB_POSTS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_COUPONS,
  INITIAL_CHAT_MESSAGES
} from '../src/data/mockBookings';

const firebaseConfig = {
  apiKey: "AIzaSyBWRJHBPYlTDoOmwHlwvqpYuVI_SB_sVy4",
  authDomain: "service-men-app.firebaseapp.com",
  projectId: "service-men-app",
  storageBucket: "service-men-app.firebasestorage.app",
  messagingSenderId: "266830532258",
  appId: "1:266830532258:web:51727f5fc60b9f26ced1fb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log('🚀 Seeding all 11 collections directly into Cloud Firestore...');

  // 1. Categories
  for (const cat of SERVICE_CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), cat);
    console.log(`✓ Seeded category: ${cat.name}`);
  }

  // 2. Services
  for (const srv of SERVICE_ITEMS) {
    await setDoc(doc(db, 'services', srv.id), srv);
  }
  console.log(`✓ Seeded ${SERVICE_ITEMS.length} service items`);

  // 3. Locations
  for (let i = 0; i < BANGLADESH_LOCATIONS.length; i++) {
    const loc = BANGLADESH_LOCATIONS[i];
    await setDoc(doc(db, 'locations', `loc-${loc.division.toLowerCase()}`), loc);
  }
  console.log(`✓ Seeded ${BANGLADESH_LOCATIONS.length} divisions & location trees`);

  // 4. Providers
  for (const prov of MOCK_PROVIDERS) {
    await setDoc(doc(db, 'providers', prov.id), prov);
  }
  console.log(`✓ Seeded ${MOCK_PROVIDERS.length} verified providers`);

  // 5. Bookings
  for (const bk of INITIAL_BOOKINGS) {
    await setDoc(doc(db, 'bookings', bk.id), bk);
  }
  console.log(`✓ Seeded ${INITIAL_BOOKINGS.length} initial bookings`);

  // 6. Job Posts
  for (const jp of INITIAL_JOB_POSTS) {
    await setDoc(doc(db, 'job_posts', jp.id), jp);
  }
  console.log(`✓ Seeded ${INITIAL_JOB_POSTS.length} job posts`);

  // 7. Reviews
  for (const rev of INITIAL_REVIEWS) {
    await setDoc(doc(db, 'reviews', rev.id), rev);
  }
  console.log(`✓ Seeded ${INITIAL_REVIEWS.length} reviews`);

  // 8. Complaints
  for (const cmp of INITIAL_COMPLAINTS) {
    await setDoc(doc(db, 'complaints', cmp.id), cmp);
  }
  console.log(`✓ Seeded ${INITIAL_COMPLAINTS.length} complaints`);

  // 9. Coupons
  for (const c of INITIAL_COUPONS) {
    await setDoc(doc(db, 'coupons', c.code), c);
  }
  console.log(`✓ Seeded ${INITIAL_COUPONS.length} coupons`);

  // 10. Chat Messages
  for (const msg of INITIAL_CHAT_MESSAGES) {
    await setDoc(doc(db, 'chat_messages', msg.id), msg);
  }
  console.log(`✓ Seeded ${INITIAL_CHAT_MESSAGES.length} chat messages`);

  console.log('🎉 ALL DATA POPULATED IN CLOUD FIRESTORE SUCCESSFULLY!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
