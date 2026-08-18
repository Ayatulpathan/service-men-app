/**
 * Service Men Frontend REST API Client
 */

const API_BASE = '/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status} Error`);
  }
  return res.json();
}

export const api = {
  getHealth: () => fetchJSON<{ status: string }>('/health'),
  getCategories: () => fetchJSON<any[]>('/categories'),
  getServices: () => fetchJSON<any[]>('/services'),
  getLocations: () => fetchJSON<any[]>('/locations'),
  getProviders: () => fetchJSON<any[]>('/providers'),
  updateProviderAvailability: (id: string, isAvailable: boolean) =>
    fetchJSON<any>(`/providers/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable })
    }),
  verifyProvider: (id: string, nidStatus: string, badges?: string[]) =>
    fetchJSON<any>(`/providers/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ nidStatus, badges })
    }),
  getBookings: () => fetchJSON<any[]>('/bookings'),
  createBooking: (bookingData: any) =>
    fetchJSON<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),
  updateBookingStatus: (id: string, status: string, extra?: any) =>
    fetchJSON<any>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...extra })
    }),
  payBooking: (id: string, paymentMethod: string) =>
    fetchJSON<any>(`/bookings/${id}/pay`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethod })
    }),
  getJobPosts: () => fetchJSON<any[]>('/job-posts'),
  createJobPost: (postData: any) =>
    fetchJSON<any>('/job-posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    }),
  submitBid: (jobPostId: string, bidData: any) =>
    fetchJSON<any>(`/job-posts/${jobPostId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData)
    }),
  acceptBid: (jobPostId: string, bidId: string) =>
    fetchJSON<any>(`/job-posts/${jobPostId}/accept-bid/${bidId}`, {
      method: 'POST'
    }),
  getReviews: () => fetchJSON<any[]>('/reviews'),
  createReview: (reviewData: any) =>
    fetchJSON<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }),
  getComplaints: () => fetchJSON<any[]>('/complaints'),
  createComplaint: (complaintData: any) =>
    fetchJSON<any>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    }),
  resolveComplaint: (id: string, resolutionNote: string, refundAmount?: number) =>
    fetchJSON<any>(`/complaints/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote, refundAmount })
    }),
  getChatMessages: (bookingId: string) => fetchJSON<any[]>(`/chats/${bookingId}`),
  sendChatMessage: (msgData: any) =>
    fetchJSON<any>('/chats', {
      method: 'POST',
      body: JSON.stringify(msgData)
    }),
  getCoupons: () => fetchJSON<any[]>('/coupons'),
  validateCoupon: (code: string, amount: number) =>
    fetchJSON<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount })
    }),
  createCoupon: (couponData: any) =>
    fetchJSON<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    }),
  getWithdrawals: () => fetchJSON<any[]>('/withdrawals'),
  createWithdrawal: (wData: any) =>
    fetchJSON<any>('/withdrawals', {
      method: 'POST',
      body: JSON.stringify(wData)
    })
};
