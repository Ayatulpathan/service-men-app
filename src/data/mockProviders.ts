import { Provider } from '../types';

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Md. Rafiqul Islam',
    nameBn: 'মো: রফিকুল ইসলাম',
    phone: '01711-234567',
    email: 'rafiqul.ac@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19882691234567890',
    nidStatus: 'verified',
    verifiedBadges: ['NID Verified', 'Police Clearance', 'Top Rated', '7-Day Warranty'],
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 142,
    completedJobs: 318,
    bio: 'Certified HVAC & Master AC technician with 8+ years experience in Carrier, Gree, Daikin and General AC systems. Specialist in leak repair and jet pump servicing.',
    bioBn: '৮ বছরের অভিজ্ঞ সার্টিফাইড এসি ও এইচভিএসি টেকনিশিয়ান। গ্রী, ডাইকিন, জেনারেল ও ক্যারিয়ার এসির মাস্টার সার্ভিসিং এবং জটিল সার্কিট ও গ্যাস লিকেজ সমাধানকারী।',
    skills: ['AC Master Wash', 'R410A/R32 Gas Charge', 'Inverter PCB Repair', 'Geyser Installation'],
    serviceArea: ['Mirpur', 'Dhanmondi', 'Mohammadpur', 'Uttara', 'Gulshan'],
    division: 'Dhaka',
    district: 'Dhaka',
    serviceCategories: ['cat-appliances', 'cat-home'],
    hourlyRate: 350,
    startingPrice: 650,
    isAvailable: true,
    emergencyReady: true,
    joinedDate: '2023-01-15',
    ratingBreakdown: {
      quality: 4.9,
      punctuality: 4.8,
      behavior: 5.0,
      priceFairness: 4.9
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 184500,
      pending: 12400,
      withdrawn: 165000
    }
  },
  {
    id: 'prov-2',
    name: 'Al-Amin Hossain',
    nameBn: 'আল-আমিন হোসেন',
    phone: '01822-345678',
    email: 'alamin.plumb@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19922699876543210',
    nidStatus: 'verified',
    verifiedBadges: ['NID Verified', 'Emergency Ready', 'Top Rated'],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 98,
    completedJobs: 245,
    bio: 'Expert plumber specializing in underground water line detection, pressure motor fixing, bathroom sanitary installation, and unblocking drainage pipelines.',
    bioBn: 'দক্ষ প্লাম্বার ও স্যানিটারি মিস্ত্রি। পানির মোটর স্থাপন, ফলস সিলিং লিকেজ সমাধান এবং ড্রেনেজ লাইনের নিখুঁত কাজে ৬ বছরের অভিজ্ঞতা।',
    skills: ['Water Pump Repair', 'Pipeline Leak Detection', 'Commode & Basin Setup', 'Drain Unclogging'],
    serviceArea: ['Dhanmondi', 'Mohammadpur', 'Mirpur', 'Old Dhaka'],
    division: 'Dhaka',
    district: 'Dhaka',
    serviceCategories: ['cat-home'],
    hourlyRate: 300,
    startingPrice: 500,
    isAvailable: true,
    emergencyReady: true,
    joinedDate: '2023-04-10',
    ratingBreakdown: {
      quality: 4.8,
      punctuality: 4.9,
      behavior: 4.8,
      priceFairness: 4.7
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 112000,
      pending: 8500,
      withdrawn: 98000
    }
  },
  {
    id: 'prov-3',
    name: 'Engr. Tanvir Ahmed',
    nameBn: 'ইঞ্জি: তানভীর আহমেদ',
    phone: '01933-456789',
    email: 'tanvir.it@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19952691122334455',
    nidStatus: 'verified',
    verifiedBadges: ['NID Verified', 'Certified Engineer', 'Fast Response'],
    experienceYears: 5,
    rating: 4.95,
    reviewCount: 115,
    completedJobs: 180,
    bio: 'B.Sc in CSE. Professional IT network engineer and hardware troubleshooter. Specialist in Mikrotik routers, Dahua CCTV systems, SSD migration, and server recovery.',
    bioBn: 'সিএসই ইঞ্জিনিয়ার। বাসা ও করপোরেট অফিসে সিসিটিভি ক্যামেরা স্থাপন, ওয়াইফাই মেশ রাউটার অপ্টিমাইজেশন ও ল্যাপটপ-ডেস্কটপ মেরামতে বিশেষ পারদর্শী।',
    skills: ['CCTV Configuration', 'SSD Upgrade & OS', 'Wi-Fi Mesh Setup', 'Data Recovery'],
    serviceArea: ['Gulshan', 'Banani', 'Uttara', 'Bashundhara R/A', 'Badda'],
    division: 'Dhaka',
    district: 'Dhaka',
    serviceCategories: ['cat-it', 'cat-business'],
    hourlyRate: 500,
    startingPrice: 500,
    isAvailable: true,
    emergencyReady: false,
    joinedDate: '2023-06-01',
    ratingBreakdown: {
      quality: 5.0,
      punctuality: 4.9,
      behavior: 5.0,
      priceFairness: 4.9
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 145000,
      pending: 15200,
      withdrawn: 120000
    }
  },
  {
    id: 'prov-4',
    name: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    phone: '01644-567890',
    email: 'nusrat.beauty@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19942693344556677',
    nidStatus: 'verified',
    verifiedBadges: ['NID Verified', 'Certified Esthetician', 'Top Rated'],
    experienceYears: 7,
    rating: 4.92,
    reviewCount: 210,
    completedJobs: 430,
    bio: 'Professional bridal makeup artist & beauty salon expert. Provide hygienic doorstep facials, bridal mehendi, manicure, hair treatment using top international brands.',
    bioBn: 'প্রফেশনাল ব্রাইডাল মেকআপ ও পার্লার এক্সপার্ট। বাসায় গিয়ে নিরাপদ ও হাইজেনিক ফেসিয়াল, মেকআপ, মেনিকিউর ও হেয়ার স্পা সেবা প্রদান করি।',
    skills: ['Bridal Makeover', 'Organic Gold Facial', 'Hair Keratin Treatment', 'Bridal Mehendi'],
    serviceArea: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur'],
    division: 'Dhaka',
    district: 'Dhaka',
    serviceCategories: ['cat-personal'],
    hourlyRate: 600,
    startingPrice: 800,
    isAvailable: true,
    emergencyReady: false,
    joinedDate: '2022-11-20',
    ratingBreakdown: {
      quality: 5.0,
      punctuality: 4.8,
      behavior: 5.0,
      priceFairness: 4.9
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 260000,
      pending: 22000,
      withdrawn: 230000
    }
  },
  {
    id: 'prov-5',
    name: 'Kazi Kamal Uddin',
    nameBn: 'কাজী কামাল উদ্দিন',
    phone: '01555-678901',
    email: 'kamal.electric@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19842697788990011',
    nidStatus: 'verified',
    verifiedBadges: ['NID Verified', 'Emergency Ready', 'Master Electrician'],
    experienceYears: 12,
    rating: 4.88,
    reviewCount: 304,
    completedJobs: 620,
    bio: 'Govt. Grade-A licensed electrician. 12+ years experience in heavy electrical load balancing, sub-station maintenance, generator repair, and house wiring.',
    bioBn: 'লাইসেন্সধারী গ্রেড-এ ইলেকট্রিশিয়ান। ১২ বছরের অভিজ্ঞতায় সাব-স্টেশন, জেনারেটর, ফ্ল্যাট হাউজ ওয়্যারিং এবং জটিল শর্ট সার্কিট দ্রুত সমাধান করি।',
    skills: ['Circuit Breaker Tripping', 'House Concealed Wiring', 'IPS Setup', 'Three-Phase Motor'],
    serviceArea: ['Agrabad', 'Nasirabad', 'Panchlaish', 'Halishahar'],
    division: 'Chattogram',
    district: 'Chattogram',
    serviceCategories: ['cat-home', 'cat-appliances', 'cat-business'],
    hourlyRate: 350,
    startingPrice: 400,
    isAvailable: true,
    emergencyReady: true,
    joinedDate: '2022-08-10',
    ratingBreakdown: {
      quality: 4.9,
      punctuality: 4.8,
      behavior: 4.9,
      priceFairness: 4.9
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 310000,
      pending: 18000,
      withdrawn: 285000
    }
  },
  {
    id: 'prov-6',
    name: 'Md. Faruk Hossain',
    nameBn: 'মো: ফারুক হোসেন',
    phone: '01788-990011',
    email: 'faruk.auto@servicemen.bd',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    nidNumber: '19902695566778899',
    nidStatus: 'under_review',
    verifiedBadges: ['Emergency Ready', 'Roadside Specialist'],
    experienceYears: 9,
    rating: 4.75,
    reviewCount: 64,
    completedJobs: 130,
    bio: 'Mobile car mechanic and roadside rescue specialist. Expert in Toyota, Honda, Hyundai breakdown diagnosis, brake bleeding, battery jumpstarts and towing.',
    bioBn: 'অন-কল কার মেকানিক ও রোডসাইড অ্যাসিস্ট্যান্স স্পেশালিস্ট। টয়োটা, হোন্ডা ও হুন্দাই গাড়ির ইঞ্জিন ফল্ট, ব্রেক সমস্যা ও ব্যাটারি জাম্পস্টার্ট সমাধান।',
    skills: ['Engine Diagnostic OBD', 'Brake Overhaul', 'Battery Jumpstart', 'Emergency Towing'],
    serviceArea: ['Mirpur', 'Uttara', 'Airport Road', 'Mohakhali', 'Badda'],
    division: 'Dhaka',
    district: 'Dhaka',
    serviceCategories: ['cat-vehicles'],
    hourlyRate: 400,
    startingPrice: 1000,
    isAvailable: true,
    emergencyReady: true,
    joinedDate: '2024-01-05',
    ratingBreakdown: {
      quality: 4.8,
      punctuality: 4.7,
      behavior: 4.8,
      priceFairness: 4.7
    },
    pastWorkImages: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80'
    ],
    earnings: {
      total: 82000,
      pending: 6500,
      withdrawn: 70000
    }
  }
];
