import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  JobPost,
  JobBid,
  Provider,
  Review,
  Complaint,
  Coupon,
  ChatMessage,
  WithdrawalRequest,
  BookingStatus,
  NidVerificationStatus
} from '../types';
import { INITIAL_BOOKINGS, INITIAL_JOB_POSTS, INITIAL_REVIEWS, INITIAL_COMPLAINTS, INITIAL_COUPONS, INITIAL_CHAT_MESSAGES } from '../data/mockBookings';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../data/serviceCategories';
import { api } from '../services/api';

export interface SelectedLocation {
  division: string;
  district: string;
  thana: string;
  area: string;
}

interface MarketplaceContextType {
  selectedLocation: SelectedLocation;
  setSelectedLocation: (loc: SelectedLocation) => void;
  providers: Provider[];
  bookings: Booking[];
  jobPosts: JobPost[];
  reviews: Review[];
  complaints: Complaint[];
  coupons: Coupon[];
  chatMessages: ChatMessage[];
  withdrawals: WithdrawalRequest[];
  isDatabaseConnected: boolean;
  
  // Booking actions
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'invoiceNumber'>) => Booking;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus, extra?: { partsAmount?: number; reason?: string }) => void;
  payBooking: (bookingId: string, paymentMethod: Booking['paymentMethod']) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  
  // Job Post actions
  createJobPost: (jobData: Omit<JobPost, 'id' | 'createdAt' | 'bids' | 'status'>) => JobPost;
  submitBid: (jobPostId: string, bidData: Omit<JobBid, 'id' | 'jobPostId' | 'createdAt' | 'status'>) => void;
  acceptBid: (jobPostId: string, bidId: string) => Booking;
  
  // Provider actions
  verifyProvider: (providerId: string, status: NidVerificationStatus, badges?: string[]) => void;
  updateProviderAvailability: (providerId: string, isAvailable: boolean) => void;
  requestWithdrawal: (providerId: string, providerName: string, amount: number, method: 'bkash' | 'nagad', phone: string) => void;
  approveWithdrawal: (withdrawalId: string) => void;
  
  // Chat actions
  getBookingMessages: (bookingId: string) => ChatMessage[];
  sendMessage: (bookingId: string, senderId: string, senderName: string, senderRole: 'customer' | 'provider', text: string) => void;
  
  // Review & Complaint actions
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;
  submitComplaint: (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (complaintId: string, resolutionNote: string, refundAmount?: number) => void;
  
  // Coupon actions
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };
  addCoupon: (coupon: Coupon) => void;
  
  // Reset utility
  resetToDefaults: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);

  // Location
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(() => {
    const saved = localStorage.getItem('sm_location');
    return saved ? JSON.parse(saved) : { division: 'Dhaka', district: 'Dhaka', thana: 'Mirpur', area: 'Mirpur-2' };
  });

  // Providers
  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem('sm_providers');
    return saved ? JSON.parse(saved) : MOCK_PROVIDERS;
  });

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sm_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Job Posts
  const [jobPosts, setJobPosts] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('sm_job_posts');
    return saved ? JSON.parse(saved) : INITIAL_JOB_POSTS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sm_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Complaints
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('sm_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('sm_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sm_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('sm_withdrawals');
    return saved ? JSON.parse(saved) : [
      {
        id: 'wdr-101',
        providerId: 'prov-1',
        providerName: 'Md. Rafiqul Islam',
        amount: 15000,
        method: 'bkash',
        accountPhone: '01711-234567',
        status: 'approved',
        requestedAt: '2026-08-10',
        processedAt: '2026-08-11'
      }
    ];
  });

  // Initial Sync from Express Server REST API
  useEffect(() => {
    async function syncFromDatabase() {
      try {
        const health = await api.getHealth();
        if (health.status === 'ok') {
          setIsDatabaseConnected(true);

          const dbProviders = await api.getProviders();
          const dbBookings = await api.getBookings();
          const dbJobPosts = await api.getJobPosts();
          const dbReviews = await api.getReviews();
          const dbComplaints = await api.getComplaints();
          const dbCoupons = await api.getCoupons();
          const dbWithdrawals = await api.getWithdrawals();

          if (dbProviders.length > 0) setProviders(dbProviders);
          if (dbBookings.length > 0) setBookings(dbBookings);
          if (dbJobPosts.length > 0) setJobPosts(dbJobPosts);
          if (dbReviews.length > 0) setReviews(dbReviews);
          if (dbComplaints.length > 0) setComplaints(dbComplaints);
          if (dbCoupons.length > 0) setCoupons(dbCoupons);
          if (dbWithdrawals.length > 0) setWithdrawals(dbWithdrawals);
        }
      } catch {
        setIsDatabaseConnected(false);
      }
    }
    syncFromDatabase();
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('sm_location', JSON.stringify(selectedLocation));
  }, [selectedLocation]);

  useEffect(() => {
    localStorage.setItem('sm_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('sm_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sm_job_posts', JSON.stringify(jobPosts));
  }, [jobPosts]);

  useEffect(() => {
    localStorage.setItem('sm_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sm_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('sm_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('sm_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sm_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  // Create Booking
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'invoiceNumber'>): Booking => {
    const newId = `bk-${Date.now().toString().slice(-4)}`;
    const randomInv = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      invoiceNumber: randomInv
    };

    setBookings(prev => [newBooking, ...prev]);

    // Async REST API Push
    api.createBooking(bookingData).catch(() => {});

    // Add initial system message in chat
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: newId,
      senderId: 'system',
      senderName: 'Service Men System',
      senderRole: 'system',
      text: `Booking created for ${newBooking.serviceName}. Scheduled on ${newBooking.scheduledDate} at ${newBooking.scheduledTime}.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, initialMsg]);

    return newBooking;
  };

  // Update Booking Status
  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus, extra?: { partsAmount?: number; reason?: string }) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const updated = { ...b, status: newStatus };
        if (extra?.partsAmount !== undefined) {
          updated.partsAmount = extra.partsAmount;
          updated.totalAmount = updated.baseAmount + (extra.partsAmount || 0) - (updated.discountAmount || 0) + updated.platformFee;
        }
        if (extra?.reason) {
          updated.cancellationReason = extra.reason;
        }
        if (newStatus === 'service_completed') {
          updated.completedAt = new Date().toLocaleString();
        }
        if (newStatus === 'payment_completed') {
          updated.paymentStatus = 'paid';
          if (updated.providerId) {
            setProviders(currentPros =>
              currentPros.map(p => {
                if (p.id === updated.providerId) {
                  const netEarned = Math.round(updated.totalAmount * 0.9);
                  return {
                    ...p,
                    completedJobs: p.completedJobs + 1,
                    earnings: {
                      ...p.earnings,
                      total: p.earnings.total + netEarned,
                      pending: p.earnings.pending + netEarned
                    }
                  };
                }
                return p;
              })
            );
          }
        }
        return updated;
      })
    );

    // Async API update
    api.updateBookingStatus(bookingId, newStatus, extra).catch(() => {});
  };

  // Pay Booking
  const payBooking = (bookingId: string, paymentMethod: Booking['paymentMethod']) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            paymentMethod,
            paymentStatus: 'paid',
            status: b.status === 'service_completed' ? 'payment_completed' : b.status
          };
        }
        return b;
      })
    );
    api.payBooking(bookingId, paymentMethod).catch(() => {});
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string, reason: string) => {
    updateBookingStatus(bookingId, 'cancelled', { reason });
  };

  // Create Job Post
  const createJobPost = (jobData: Omit<JobPost, 'id' | 'createdAt' | 'bids' | 'status'>): JobPost => {
    const newPost: JobPost = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      bids: [],
      status: 'open'
    };

    setJobPosts(prev => [newPost, ...prev]);
    api.createJobPost(jobData).catch(() => {});
    return newPost;
  };

  // Submit Bid for a Job Post
  const submitBid = (jobPostId: string, bidData: Omit<JobBid, 'id' | 'jobPostId' | 'createdAt' | 'status'>) => {
    const newBid: JobBid = {
      ...bidData,
      id: `bid-${Date.now().toString().slice(-4)}`,
      jobPostId,
      createdAt: new Date().toLocaleString(),
      status: 'pending'
    };

    setJobPosts(prev =>
      prev.map(job => {
        if (job.id === jobPostId) {
          return {
            ...job,
            bids: [newBid, ...job.bids]
          };
        }
        return job;
      })
    );

    api.submitBid(jobPostId, bidData).catch(() => {});
  };

  // Accept Bid & Turn into Booking
  const acceptBid = (jobPostId: string, bidId: string): Booking => {
    const targetJob = jobPosts.find(j => j.id === jobPostId);
    const targetBid = targetJob?.bids.find(b => b.id === bidId);

    if (!targetJob || !targetBid) {
      throw new Error('Job or Bid not found');
    }

    setJobPosts(prev =>
      prev.map(j => {
        if (j.id === jobPostId) {
          return {
            ...j,
            status: 'awarded',
            bids: j.bids.map(b => (b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }))
          };
        }
        return j;
      })
    );

    const matchedService = SERVICE_ITEMS.find(s => s.name.toLowerCase().includes(targetJob.serviceName.toLowerCase())) || SERVICE_ITEMS[0];

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      customerId: targetJob.customerId,
      customerName: targetJob.customerName,
      customerPhone: targetJob.customerPhone,
      providerId: targetBid.providerId,
      providerName: targetBid.providerName,
      providerAvatar: targetBid.providerAvatar,
      serviceId: matchedService.id,
      serviceName: targetJob.serviceName,
      categoryId: targetJob.categoryId,
      status: 'accepted',
      problemDescription: `${targetJob.problemDescription} [Accepted Bid: ${targetBid.arrivalEstimate}]`,
      photos: targetJob.attachments,
      location: {
        ...targetJob.location,
        area: targetJob.location.thana
      },
      scheduledDate: targetJob.preferredDate,
      scheduledTime: targetJob.preferredTime,
      isEmergency: false,
      pricingType: 'quotation',
      baseAmount: targetBid.quotedAmount,
      platformFee: 50,
      totalAmount: targetBid.quotedAmount + 50,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      warrantyDays: 7,
      createdAt: new Date().toLocaleString(),
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setBookings(prev => [newBooking, ...prev]);
    api.acceptBid(jobPostId, bidId).catch(() => {});
    return newBooking;
  };

  // Provider NID verification
  const verifyProvider = (providerId: string, status: NidVerificationStatus, badges?: string[]) => {
    setProviders(prev =>
      prev.map(p => {
        if (p.id === providerId) {
          const updatedBadges = badges || p.verifiedBadges;
          if (status === 'verified' && !updatedBadges.includes('NID Verified')) {
            updatedBadges.push('NID Verified');
          }
          return {
            ...p,
            nidStatus: status,
            verifiedBadges: updatedBadges
          };
        }
        return p;
      })
    );
    api.verifyProvider(providerId, status, badges).catch(() => {});
  };

  const updateProviderAvailability = (providerId: string, isAvailable: boolean) => {
    setProviders(prev =>
      prev.map(p => (p.id === providerId ? { ...p, isAvailable } : p))
    );
    api.updateProviderAvailability(providerId, isAvailable).catch(() => {});
  };

  // Request Withdrawal
  const requestWithdrawal = (providerId: string, providerName: string, amount: number, method: 'bkash' | 'nagad', phone: string) => {
    const newReq: WithdrawalRequest = {
      id: `wdr-${Date.now().toString().slice(-4)}`,
      providerId,
      providerName,
      amount,
      method,
      accountPhone: phone,
      status: 'pending',
      requestedAt: new Date().toLocaleDateString()
    };
    setWithdrawals(prev => [newReq, ...prev]);

    setProviders(prev =>
      prev.map(p => {
        if (p.id === providerId) {
          return {
            ...p,
            earnings: {
              ...p.earnings,
              pending: Math.max(0, p.earnings.pending - amount)
            }
          };
        }
        return p;
      })
    );

    api.createWithdrawal({ providerId, providerName, amount, method, phone }).catch(() => {});
  };

  // Approve Withdrawal
  const approveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(prev =>
      prev.map(w => {
        if (w.id === withdrawalId) {
          setProviders(currentPros =>
            currentPros.map(p => {
              if (p.id === w.providerId) {
                return {
                  ...p,
                  earnings: {
                    ...p.earnings,
                    withdrawn: p.earnings.withdrawn + w.amount
                  }
                };
              }
              return p;
            })
          );
          return { ...w, status: 'approved', processedAt: new Date().toLocaleDateString() };
        }
        return w;
      })
    );
  };

  // Chat
  const getBookingMessages = (bookingId: string) => {
    return chatMessages.filter(m => m.bookingId === bookingId);
  };

  const sendMessage = (bookingId: string, senderId: string, senderName: string, senderRole: 'customer' | 'provider', text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    api.sendChatMessage({ bookingId, senderId, senderName, senderRole, text }).catch(() => {});

    if (senderRole === 'customer') {
      setTimeout(() => {
        const autoReplies = [
          "Assalamu Alaikum! Got your message. I am arriving with the required equipment and spares.",
          "Ji bhai, noted! Please keep the area clear for testing.",
          "Understood. I will arrive promptly as scheduled. Thank you for using Service Men!"
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          bookingId,
          senderId: 'prov-auto',
          senderName: 'Technician Response',
          senderRole: 'provider',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(curr => [...curr, replyMsg]);
      }, 1500);
    }
  };

  // Review
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString()
    };
    setReviews(prev => [newRev, ...prev]);

    setProviders(prev =>
      prev.map(p => {
        if (p.id === reviewData.providerId) {
          const totalReviews = p.reviewCount + 1;
          const newAvg = Number(((p.rating * p.reviewCount + reviewData.rating) / totalReviews).toFixed(2));
          return {
            ...p,
            rating: newAvg,
            reviewCount: totalReviews
          };
        }
        return p;
      })
    );

    api.createReview(reviewData).catch(() => {});
  };

  // Complaint
  const submitComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `cmp-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleDateString(),
      status: 'submitted'
    };
    setComplaints(prev => [newComplaint, ...prev]);
    api.createComplaint(complaintData).catch(() => {});
  };

  const resolveComplaint = (complaintId: string, resolutionNote: string, refundAmount?: number) => {
    setComplaints(prev =>
      prev.map(c => (c.id === complaintId ? { ...c, status: 'resolved', resolutionNote, refundAmount } : c))
    );
    api.resolveComplaint(complaintId, resolutionNote, refundAmount).catch(() => {});
  };

  // Coupons
  const validateCoupon = (code: string, amount: number) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === normalized && c.isActive);

    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code' };
    }

    if (amount < found.minBookingAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ৳${found.minBookingAmount} required for this coupon`
      };
    }

    let discount = 0;
    if (found.discountType === 'fixed') {
      discount = found.discountValue;
    } else {
      discount = Math.round((amount * found.discountValue) / 100);
    }

    return {
      valid: true,
      discount,
      message: `Success! You saved ৳${discount}`,
      coupon: found
    };
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    api.createCoupon(coupon).catch(() => {});
  };

  // Reset demo
  const resetToDefaults = () => {
    localStorage.removeItem('sm_location');
    localStorage.removeItem('sm_providers');
    localStorage.removeItem('sm_bookings');
    localStorage.removeItem('sm_job_posts');
    localStorage.removeItem('sm_reviews');
    localStorage.removeItem('sm_complaints');
    localStorage.removeItem('sm_coupons');
    localStorage.removeItem('sm_chats');
    localStorage.removeItem('sm_withdrawals');

    setSelectedLocation({ division: 'Dhaka', district: 'Dhaka', thana: 'Mirpur', area: 'Mirpur-2' });
    setProviders(MOCK_PROVIDERS);
    setBookings(INITIAL_BOOKINGS);
    setJobPosts(INITIAL_JOB_POSTS);
    setReviews(INITIAL_REVIEWS);
    setComplaints(INITIAL_COMPLAINTS);
    setCoupons(INITIAL_COUPONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setWithdrawals([
      {
        id: 'wdr-101',
        providerId: 'prov-1',
        providerName: 'Md. Rafiqul Islam',
        amount: 15000,
        method: 'bkash',
        accountPhone: '01711-234567',
        status: 'approved',
        requestedAt: '2026-08-10',
        processedAt: '2026-08-11'
      }
    ]);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        providers,
        bookings,
        jobPosts,
        reviews,
        complaints,
        coupons,
        chatMessages,
        withdrawals,
        isDatabaseConnected,
        createBooking,
        updateBookingStatus,
        payBooking,
        cancelBooking,
        createJobPost,
        submitBid,
        acceptBid,
        verifyProvider,
        updateProviderAvailability,
        requestWithdrawal,
        approveWithdrawal,
        getBookingMessages,
        sendMessage,
        addReview,
        submitComplaint,
        resolveComplaint,
        validateCoupon,
        addCoupon,
        resetToDefaults
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
