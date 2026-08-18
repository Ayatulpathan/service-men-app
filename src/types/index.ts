export type UserRole = 'customer' | 'provider' | 'admin';

export type Language = 'en' | 'bn';

export type PricingModel = 'fixed' | 'starting' | 'hourly' | 'quotation';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'card';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'service_started'
  | 'service_completed'
  | 'payment_completed'
  | 'cancelled';

export type NidVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  nameBn?: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  division: string;
  district: string;
  thana: string;
  area: string;
  addressDetails?: string;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  description: string;
  descriptionBn: string;
  commissionRate: number; // e.g. 10%
  color: string;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  basePrice: number;
  priceType: PricingModel;
  isEmergency: boolean;
  popular?: boolean;
  warrantyDays: number;
  features: string[];
  featuresBn: string[];
}

export interface ProviderDocument {
  type: 'nid_front' | 'nid_back' | 'trade_license' | 'certificate';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  email: string;
  avatar: string;
  nidNumber: string;
  nidStatus: NidVerificationStatus;
  nidDocuments?: ProviderDocument[];
  verifiedBadges: string[]; // e.g. 'NID Verified', 'Police Clearance', 'Top Rated', '7-Day Warranty'
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  bio: string;
  bioBn: string;
  skills: string[];
  serviceArea: string[]; // e.g. ['Mirpur', 'Dhanmondi', 'Gulshan', 'Uttara', 'Mohammadpur']
  division: string;
  district: string;
  serviceCategories: string[];
  hourlyRate?: number;
  startingPrice?: number;
  isAvailable: boolean;
  emergencyReady: boolean;
  joinedDate: string;
  ratingBreakdown: {
    quality: number;
    punctuality: number;
    behavior: number;
    priceFairness: number;
  };
  pastWorkImages: string[];
  earnings: {
    total: number;
    pending: number;
    withdrawn: number;
  };
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  providerId?: string;
  providerName?: string;
  providerPhone?: string;
  providerAvatar?: string;
  serviceId: string;
  serviceName: string;
  serviceNameBn?: string;
  categoryId: string;
  status: BookingStatus;
  problemDescription: string;
  photos?: string[];
  location: {
    division: string;
    district: string;
    thana: string;
    area: string;
    addressDetails: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  isEmergency: boolean;
  pricingType: PricingModel;
  baseAmount: number;
  partsAmount?: number;
  discountAmount?: number;
  platformFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  warrantyDays: number;
  createdAt: string;
  completedAt?: string;
  cancellationReason?: string;
  invoiceNumber: string;
}

export interface JobBid {
  id: string;
  jobPostId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  providerCompletedJobs: number;
  quotedAmount: number;
  arrivalEstimate: string;
  proposalNote: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface JobPost {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  categoryId: string;
  problemDescription: string;
  location: {
    division: string;
    district: string;
    thana: string;
    area: string;
    addressDetails: string;
  };
  preferredDate: string;
  preferredTime: string;
  budgetMin: number;
  budgetMax: number;
  attachments: string[];
  bids: JobBid[];
  status: 'open' | 'awarded' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  providerId: string;
  serviceName: string;
  rating: number;
  ratings: {
    quality: number;
    punctuality: number;
    behavior: number;
    priceFairness: number;
  };
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  reason: string;
  description: string;
  status: 'submitted' | 'under_investigation' | 'resolved' | 'rejected';
  resolutionNote?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'provider' | 'system';
  text: string;
  imageUrl?: string;
  timestamp: string;
}

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minBookingAmount: number;
  description: string;
  descriptionBn: string;
  expiryDate: string;
  usageCount: number;
  maxUses?: number;
  isActive: boolean;
}

export interface WithdrawalRequest {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket';
  accountPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface BangladeshLocationNode {
  division: string;
  divisionBn: string;
  districts: {
    name: string;
    nameBn: string;
    thanas: {
      name: string;
      nameBn: string;
      areas: string[];
    }[];
  }[];
}
