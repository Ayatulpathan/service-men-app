# Service Men (সার্ভিস ম্যান) 🛠️🇧🇩
> **On-Demand Service Marketplace for Bangladesh**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https%3A%2F%2Fservice--men--app.vercel.app-006A4E?style=for-the-badge&logo=vercel)](https://service-men-app.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Ayatulpathan%2Fservice--men--app-181717?style=for-the-badge&logo=github)](https://github.com/Ayatulpathan/service-men-app)

---

## 🚀 Live Demo URL

🔗 **[https://service-men-app.vercel.app](https://service-men-app.vercel.app)**

---

## 📌 Short Description

**Service Men** is an on-demand web marketplace designed specifically for Bangladesh that connects customers with verified service professionals (Electricians, Plumbers, AC Technicians, Home Tutors, Car Mechanics, and Beauty Specialists).

The platform features location-based service discovery (Division ➔ District ➔ Upazila/Thana ➔ Area), a custom job tender bidding engine, 24/7 rapid emergency dispatch, live 6-stage booking tracking, instant mobile payments (bKash, Nagad, Rocket, Cards), digital invoices with a 7-day service warranty, and full bilingual support (**English ⇄ বাংলা**).

---

## ✨ Key Features

- 🔄 **Multi-Persona Switcher**: Instant top banner toggle between **Customer**, **Service Provider**, **Administrator**, and **Public Marketplace** modes.
- 🇧🇩 **Bangladesh-First Localization**:
  - Full geographic administrative tree covering all 8 Divisions: *Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh*.
  - Formatted Bangladesh Taka (`৳ BDT` / `৳১,৫০০`) currency.
  - Complete English ⇄ বাংলা (Bangla) translation dictionary.
- 🛠️ **7 Service Categories & 40+ Services**:
  - **Home Services**: Electrician, Plumbing, Carpentry, Painting, Deep Cleaning, Pest Control, House Shifting.
  - **Appliance Servicing**: AC Jet-Pump Wash, Gas Refill & PCB Repair, Refrigerator, Washing Machine, IPS/UPS, Geyser.
  - **IT & Gadgets**: PC/Laptop Repair, CCTV Installation, Wi-Fi Networking.
  - **Vehicle Services**: On-call Car/Bike Mechanic, Doorstep Wash, Battery Jumpstart, Towing.
  - **Education & Tutors**: BUET/DU Tutors, Quran & Arabic Teachers.
  - **Personal & Beauty**: Doorstep Salon, Bridal & Party Makeover.
  - **Business Solutions**: Commercial Office Cleaning, Commercial AC AMC.
- 📋 **"Post a Job" Bidding Engine**: Customers post custom job tenders with budget ranges; providers submit competitive price quotes.
- 🚨 **24/7 Emergency Dispatch**: 1-click urgent assistance for burst pipes, short circuits, or breakdowns with <30 minute target arrival.
- 💳 **Bangladeshi Mobile Financial Services**: Simulated checkout for **bKash** (pink PIN/OTP wallet modal), **Nagad**, **Rocket**, **SSLCommerz Cards**, and **Cash on Delivery**.
- 💬 **In-App Messaging & Live Chat**: Real-time customer ↔ technician messaging with automated pro quick responses.
- 🧾 **Digital Invoice & 7-Day Warranty**: Printable invoice with parts breakdown, platform fees, and official 7-Day Service Warranty Certificate.
- ⭐️ **Multi-Criteria Ratings**: 5-star ratings assessing *Quality*, *Punctuality*, *Behavior*, and *Price Fairness*.
- 🛡️ **Admin & Provider Portals**: NID verification approvals, complaint dispute resolution, promo coupon creation (`FIRST100`), and bKash/Nagad wallet payout requests.

---

## 🗄️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Vite.
- **Backend REST API**: Node.js, Express.js.
- **Database & ORM**: Prisma ORM, SQLite (`prisma/dev.db`) with 1-line PostgreSQL compatibility.
- **Deployment**: Vercel Cloud (Frontend CDN + Serverless API Functions).

---

## 🏃 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Ayatulpathan/service-men-app.git
cd service-men-app

# 2. Install dependencies
npm install

# 3. Push Database Schema & Seed Data
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start Backend Server & Frontend Dev Server
npm run server   # Express API server on http://localhost:5000
npm run dev      # Vite Frontend on http://localhost:3000
```
