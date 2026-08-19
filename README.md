# 🇧🇩 Service Men (সার্ভিস মেন) — On-Demand Service Marketplace for Bangladesh

[![Firebase Hosting](https://img.shields.io/badge/Hosted_on-Firebase_Hosting-FFA611?style=for-the-badge&logo=firebase&logoColor=white)](https://service-men-app.web.app)
[![Database](https://img.shields.io/badge/Database-Firebase_Cloud_Firestore-02569B?style=for-the-badge&logo=firebase&logoColor=white)](https://console.firebase.google.com/project/service-men-app/firestore)
[![React](https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An on-demand home and emergency service marketplace tailored for Bangladesh. Built with **React 18**, **TypeScript**, **Tailwind CSS**, and backed by **Google Firebase Cloud Firestore** and **Express REST Backend Services**.

---

## 🌟 Key Features

### 🇧🇩 1. Bangladesh Geographic & Cultural Localization
- **8 Administrative Divisions & 64 Districts**: Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh.
- **Thana & Upazila Selector**: Mirpur, Dhanmondi, Gulshan, Uttara, Agrabad, Nasirabad, Kazir Dewri, Boalia, Motihar, Panchlaish, and more.
- **Bangla ⇄ English Switcher**: Full bilingual support.
- **Currency**: BDT (`৳`) with authentic localized pricing models.

### 👥 2. Multi-Persona Experience
- **Customer Mode**: Browse 40+ services across 7 categories, post custom job tenders, track 6-stage booking status, chat with technicians, download warranty certificates.
- **Service Provider Mode**: Accept booking requests, submit quotation bids, manage earnings ledger, request bKash/Nagad payouts, and upload NID credentials for verification.
- **Administrator Panel**: Live GMV metrics, provider NID approvals, commission tracking (10% platform fee), and dispute resolution center.
- **Public Marketplace**: High-conversion landing page, search autocomplete, category discovery, trust metrics.

### 🔥 3. Firebase Cloud Firestore Database & Real-Time Sync
- **11 Firestore Collections**: `services`, `categories`, `locations`, `providers`, `bookings`, `job_posts`, `job_bids`, `chat_messages`, `reviews`, `complaints`, `coupons`, `withdrawals`.
- **Real-Time onSnapshot**: Live synchronization of bookings, bids, messages, and status updates across devices.

### ⚡ 4. Backend Services Suite
- **MFS Payment Gateway Service**: Direct bKash & Nagad checkout simulator with transaction verification.
- **24/7 Emergency Dispatch Engine**: Dispatches nearby available verified technicians in <15 minutes.
- **Transactional SMS Alerts**: Automated SMS notification simulator.
- **Admin Metrics API**: Gross Merchandise Value (GMV), net platform revenue, and dispute stats.

---

## 🚀 Quick Setup & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Cloud Firestore Database
```bash
npx tsx scripts/seedDirectToFirestore.ts
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy Live to Firebase Hosting
```bash
npx firebase-tools deploy --only hosting
```
