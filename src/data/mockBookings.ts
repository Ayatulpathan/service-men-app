import { Booking, JobPost, Review, Complaint, Coupon, ChatMessage } from '../types';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    customerId: 'user-c1',
    customerName: 'Shakil Ahmed',
    customerPhone: '01712-987654',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    providerId: 'prov-1',
    providerName: 'Md. Rafiqul Islam',
    providerPhone: '01711-234567',
    providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
    serviceId: 'srv-ac-servicing',
    serviceName: 'AC Master Servicing',
    serviceNameBn: 'এসি মাস্টার সার্ভিসিং',
    categoryId: 'cat-appliances',
    status: 'on_the_way',
    problemDescription: '1.5 ton Gree Inverter AC is not cooling properly and emitting low air flow. Need full jet wash.',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mirpur',
      area: 'Mirpur-2',
      addressDetails: 'House 24, Road 5, Block B, Mirpur-2, Dhaka'
    },
    scheduledDate: '2026-08-19',
    scheduledTime: '04:30 PM',
    isEmergency: false,
    pricingType: 'fixed',
    baseAmount: 650,
    partsAmount: 0,
    discountAmount: 100,
    platformFee: 50,
    totalAmount: 600,
    paymentMethod: 'bkash',
    paymentStatus: 'pending',
    couponCode: 'FIRST100',
    warrantyDays: 7,
    createdAt: '2026-08-19 11:20 AM',
    invoiceNumber: 'INV-2026-8801'
  },
  {
    id: 'bk-1002',
    customerId: 'user-c1',
    customerName: 'Shakil Ahmed',
    customerPhone: '01712-987654',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    providerId: 'prov-2',
    providerName: 'Al-Amin Hossain',
    providerPhone: '01822-345678',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    serviceId: 'srv-plumber',
    serviceName: 'Plumbing & Pipe Repair',
    serviceNameBn: 'প্লাম্বিং ও পাইপ মেরামত',
    categoryId: 'cat-home',
    status: 'payment_completed',
    problemDescription: 'Water basin tap continuous leakage and kitchen sink drain line clogged.',
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mirpur',
      area: 'Mirpur-2',
      addressDetails: 'House 24, Road 5, Block B, Mirpur-2, Dhaka'
    },
    scheduledDate: '2026-08-15',
    scheduledTime: '11:00 AM',
    isEmergency: false,
    pricingType: 'starting',
    baseAmount: 500,
    partsAmount: 350,
    discountAmount: 0,
    platformFee: 50,
    totalAmount: 900,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    warrantyDays: 7,
    createdAt: '2026-08-15 09:10 AM',
    completedAt: '2026-08-15 12:45 PM',
    invoiceNumber: 'INV-2026-8742'
  },
  {
    id: 'bk-1003',
    customerId: 'user-c2',
    customerName: 'Tasnim Rahman',
    customerPhone: '01988-112233',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    providerId: 'prov-5',
    providerName: 'Kazi Kamal Uddin',
    providerPhone: '01555-678901',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    serviceId: 'srv-electrician',
    serviceName: 'Electrician Service',
    serviceNameBn: 'ইলেকট্রিশিয়ান সার্ভিস',
    categoryId: 'cat-home',
    status: 'requested',
    problemDescription: 'Main circuit breaker keeps tripping whenever the water pump is turned on.',
    location: {
      division: 'Chattogram',
      district: 'Chattogram',
      thana: 'Agrabad',
      area: 'Commercial Area',
      addressDetails: 'Apartment 4B, Moon Tower, Agrabad Access Road'
    },
    scheduledDate: '2026-08-20',
    scheduledTime: '10:00 AM',
    isEmergency: true,
    pricingType: 'starting',
    baseAmount: 400,
    partsAmount: 0,
    discountAmount: 0,
    platformFee: 50,
    totalAmount: 450,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    warrantyDays: 7,
    createdAt: '2026-08-19 02:15 PM',
    invoiceNumber: 'INV-2026-8815'
  }
];

export const INITIAL_JOB_POSTS: JobPost[] = [
  {
    id: 'job-501',
    customerId: 'user-c1',
    customerName: 'Shakil Ahmed',
    customerPhone: '01712-987654',
    serviceName: '3-Room Concealed Electrical Wiring & DB Box Setup',
    categoryId: 'cat-home',
    problemDescription: 'Renovating my 1400 sq ft apartment. Need full copper wiring for 3 bedrooms, drawing, dining, AC power sockets, and separate circuit breakers for each room.',
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mirpur',
      area: 'Mirpur-2',
      addressDetails: 'Flat 5B, Green Valley, Mirpur-2'
    },
    preferredDate: '2026-08-22',
    preferredTime: '10:00 AM',
    budgetMin: 3500,
    budgetMax: 5500,
    attachments: [
      'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=400&q=80'
    ],
    status: 'open',
    createdAt: '2026-08-18 04:00 PM',
    bids: [
      {
        id: 'bid-1',
        jobPostId: 'job-501',
        providerId: 'prov-5',
        providerName: 'Kazi Kamal Uddin',
        providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        providerRating: 4.88,
        providerCompletedJobs: 620,
        quotedAmount: 4200,
        arrivalEstimate: 'Ready to start Saturday morning 9:30 AM',
        proposalNote: 'Includes full wiring layout, BRB copper cable fitting, safety load testing and 30-day warranty.',
        createdAt: '2026-08-18 06:15 PM',
        status: 'pending'
      },
      {
        id: 'bid-2',
        jobPostId: 'job-501',
        providerId: 'prov-1',
        providerName: 'Md. Rafiqul Islam',
        providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
        providerRating: 4.9,
        providerCompletedJobs: 318,
        quotedAmount: 3900,
        arrivalEstimate: 'Can start within 2 hours or on Saturday',
        proposalNote: 'Specialist in AC power points + room DB breaker connections.',
        createdAt: '2026-08-18 08:30 PM',
        status: 'pending'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'bk-1002',
    customerId: 'user-c1',
    customerName: 'Shakil Ahmed',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    providerId: 'prov-2',
    serviceName: 'Plumbing & Pipe Repair',
    rating: 5,
    ratings: {
      quality: 5,
      punctuality: 5,
      behavior: 5,
      priceFairness: 5
    },
    comment: 'Al-Amin bhai arrived within 30 minutes in Mirpur. He accurately detected the hidden pipe leak inside the wall without damaging extra tiles. Very polite and honest pricing!',
    createdAt: '2026-08-15 01:00 PM'
  },
  {
    id: 'rev-2',
    bookingId: 'bk-999',
    customerId: 'user-c3',
    customerName: 'Farhana Kabir',
    providerId: 'prov-1',
    serviceName: 'AC Master Servicing',
    rating: 5,
    ratings: {
      quality: 5,
      punctuality: 5,
      behavior: 5,
      priceFairness: 5
    },
    comment: 'Best AC servicing in Dhaka! Used high pressure jet pump with water bag protection so my room did not get dirty at all. Cooling is freezing now.',
    createdAt: '2026-08-12 05:20 PM'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-201',
    bookingId: 'bk-980',
    invoiceNumber: 'INV-2026-8600',
    customerId: 'user-c4',
    customerName: 'Mahmudur Rahman',
    customerPhone: '01715-443322',
    providerId: 'prov-6',
    providerName: 'Md. Faruk Hossain',
    reason: 'Unreasonable extra delay',
    description: 'Technician was supposed to arrive at 2:00 PM but reached at 4:30 PM without prior phone notice.',
    status: 'under_investigation',
    resolutionNote: 'Customer support reached out to provider. ৳200 apology wallet credit issued.',
    refundAmount: 200,
    createdAt: '2026-08-16 05:00 PM'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'FIRST100',
    discountType: 'fixed',
    discountValue: 100,
    minBookingAmount: 500,
    description: '৳100 discount on your first booking above ৳500',
    descriptionBn: 'প্রথম বুকিংয়ে ৫০০ টাকার অর্ডারে ১০০ টাকা ছাড়',
    expiryDate: '2026-12-31',
    usageCount: 412,
    isActive: true
  },
  {
    code: 'EID2026',
    discountType: 'percentage',
    discountValue: 15,
    minBookingAmount: 1000,
    description: '15% instant discount on home and appliance repairs',
    descriptionBn: 'হোম ও অ্যাপ্লায়েন্স সার্ভিসে ১৫% ইনস্ট্যান্ট ছাড়',
    expiryDate: '2026-09-30',
    usageCount: 189,
    isActive: true
  },
  {
    code: 'EMERGENCY50',
    discountType: 'fixed',
    discountValue: 50,
    minBookingAmount: 400,
    description: '৳50 off on 24/7 urgent emergency requests',
    descriptionBn: 'জরুরি ২৪/৭ সার্ভিসের ফি-তে ৫০ টাকা ছাড়',
    expiryDate: '2026-12-31',
    usageCount: 95,
    isActive: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    bookingId: 'bk-1001',
    senderId: 'prov-1',
    senderName: 'Md. Rafiqul Islam',
    senderRole: 'provider',
    text: 'Salam Shakil bhai, I have accepted your AC master servicing. I am on my way on motorcycle from Mirpur 10.',
    timestamp: '04:05 PM'
  },
  {
    id: 'msg-2',
    bookingId: 'bk-1001',
    senderId: 'user-c1',
    senderName: 'Shakil Ahmed',
    senderRole: 'customer',
    text: 'Walaykum salam Rafiqul bhai. Please bring the indoor water splash guard cover as we have wooden flooring in the bedroom.',
    timestamp: '04:08 PM'
  },
  {
    id: 'msg-3',
    bookingId: 'bk-1001',
    senderId: 'prov-1',
    senderName: 'Md. Rafiqul Islam',
    senderRole: 'provider',
    text: 'Yes bhai, I always carry the professional waterproof AC jacket and high-pressure jet pump. See you in 15 minutes!',
    timestamp: '04:10 PM'
  }
];
