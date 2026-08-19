import {
  ServiceCategory,
  ServiceItem,
  BangladeshLocationNode,
  Provider,
  Booking,
  JobPost,
  Review,
  Complaint
} from '../types';

const API_BASE = '/api';

export const api = {
  // 1. Health check
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // 2. Categories & Services
  getCategories: async (): Promise<ServiceCategory[]> => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  getServices: async (): Promise<ServiceItem[]> => {
    const res = await fetch(`${API_BASE}/services`);
    return res.json();
  },

  // 3. Locations
  getLocations: async (): Promise<BangladeshLocationNode[]> => {
    const res = await fetch(`${API_BASE}/locations`);
    return res.json();
  },

  // 4. Providers
  getProviders: async (): Promise<Provider[]> => {
    const res = await fetch(`${API_BASE}/providers`);
    return res.json();
  },

  updateProviderAvailability: async (id: string, isAvailable: boolean) => {
    const res = await fetch(`${API_BASE}/providers/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable })
    });
    return res.json();
  },

  verifyProviderNid: async (id: string, nidStatus: string, badges?: string[]) => {
    const res = await fetch(`${API_BASE}/providers/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nidStatus, badges })
    });
    return res.json();
  },

  // 5. Bookings
  getBookings: async (): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings`);
    return res.json();
  },

  createBooking: async (bookingData: any): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  updateBookingStatus: async (id: string, status: string, extra?: { partsAmount?: number; reason?: string }) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra })
    });
    return res.json();
  },

  // 6. Job Posts & Bids
  getJobPosts: async (): Promise<JobPost[]> => {
    const res = await fetch(`${API_BASE}/job-posts`);
    return res.json();
  },

  createJobPost: async (jobData: any): Promise<JobPost> => {
    const res = await fetch(`${API_BASE}/job-posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    return res.json();
  },

  submitJobBid: async (bidData: any) => {
    const res = await fetch(`${API_BASE}/job-bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidData)
    });
    return res.json();
  },

  // 7. MFS Payments Gateway Service
  createBkashPayment: async (data: { bookingId: string; amount: number; customerPhone: string }) => {
    const res = await fetch(`${API_BASE}/payments/bkash/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  createNagadPayment: async (data: { bookingId: string; amount: number; customerPhone: string }) => {
    const res = await fetch(`${API_BASE}/payments/nagad/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyPayment: async (data: { bookingId: string; paymentMethod: string; transactionId?: string }) => {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 8. 24/7 Emergency SOS Dispatch
  dispatchEmergencyTechnician: async (data: { serviceType: string; customerName: string; customerPhone: string; location: any }) => {
    const res = await fetch(`${API_BASE}/emergency/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 9. SMS Notification Simulator
  sendSmsNotification: async (recipientPhone: string, message: string, type?: string) => {
    const res = await fetch(`${API_BASE}/notifications/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientPhone, message, type })
    });
    return res.json();
  },

  // 10. Platform Analytics & Admin Metrics
  getAdminMetrics: async () => {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    return res.json();
  },

  // 11. Reviews & Complaints
  getReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },

  getComplaints: async (): Promise<Complaint[]> => {
    const res = await fetch(`${API_BASE}/complaints`);
    return res.json();
  }
};
