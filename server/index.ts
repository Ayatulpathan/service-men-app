import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'Prisma SQLite', timestamp: new Date().toISOString() });
});

// 1. Categories & Services
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    const parsed = services.map(s => ({
      ...s,
      features: JSON.parse(s.features),
      featuresBn: JSON.parse(s.featuresBn)
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Locations
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await prisma.location.findMany();
    const parsed = locations.map(l => ({
      ...l,
      areas: JSON.parse(l.areas)
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Providers
app.get('/api/providers', async (req, res) => {
  try {
    const providers = await prisma.provider.findMany();
    const parsed = providers.map(p => ({
      ...p,
      verifiedBadges: JSON.parse(p.verifiedBadges),
      skills: JSON.parse(p.skills),
      serviceArea: JSON.parse(p.serviceArea),
      serviceCategories: JSON.parse(p.serviceCategories),
      pastWorkImages: JSON.parse(p.pastWorkImages),
      ratingBreakdown: {
        quality: p.ratingQuality,
        punctuality: p.ratingPunctuality,
        behavior: p.ratingBehavior,
        priceFairness: p.ratingPriceFairness
      },
      earnings: {
        total: p.totalEarnings,
        pending: p.pendingEarnings,
        withdrawn: p.withdrawnEarnings
      }
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/providers/:id/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const updated = await prisma.provider.update({
      where: { id: req.params.id },
      data: { isAvailable }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/providers/:id/verify', async (req, res) => {
  try {
    const { nidStatus, badges } = req.body;
    const provider = await prisma.provider.findUnique({ where: { id: req.params.id } });
    if (!provider) return res.status(404).json({ error: 'Provider not found' });

    let currentBadges: string[] = JSON.parse(provider.verifiedBadges || '[]');
    if (badges && Array.isArray(badges)) {
      currentBadges = badges;
    }
    if (nidStatus === 'verified' && !currentBadges.includes('NID Verified')) {
      currentBadges.push('NID Verified');
    }

    const updated = await prisma.provider.update({
      where: { id: req.params.id },
      data: {
        nidStatus,
        verifiedBadges: JSON.stringify(currentBadges)
      }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    const parsed = bookings.map(b => ({
      ...b,
      photos: b.photos ? JSON.parse(b.photos) : undefined,
      location: {
        division: b.division,
        district: b.district,
        thana: b.thana,
        area: b.area,
        addressDetails: b.addressDetails
      }
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const b = req.body;
    const newId = `bk-${Date.now().toString().slice(-4)}`;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await prisma.booking.create({
      data: {
        id: newId,
        customerId: b.customerId,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        customerAvatar: b.customerAvatar,
        providerId: b.providerId,
        providerName: b.providerName,
        providerPhone: b.providerPhone,
        providerAvatar: b.providerAvatar,
        serviceId: b.serviceId,
        serviceName: b.serviceName,
        serviceNameBn: b.serviceNameBn,
        categoryId: b.categoryId,
        status: b.status || 'requested',
        problemDescription: b.problemDescription,
        photos: b.photos ? JSON.stringify(b.photos) : null,
        division: b.location.division,
        district: b.location.district,
        thana: b.location.thana,
        area: b.location.area,
        addressDetails: b.location.addressDetails,
        scheduledDate: b.scheduledDate,
        scheduledTime: b.scheduledTime,
        isEmergency: b.isEmergency || false,
        pricingType: b.pricingType,
        baseAmount: b.baseAmount,
        partsAmount: b.partsAmount || 0,
        discountAmount: b.discountAmount || 0,
        platformFee: b.platformFee || 50,
        totalAmount: b.totalAmount,
        paymentMethod: b.paymentMethod,
        paymentStatus: b.paymentStatus || 'pending',
        couponCode: b.couponCode,
        warrantyDays: b.warrantyDays || 7,
        createdAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        invoiceNumber
      }
    });

    // Create system message
    await prisma.chatMessage.create({
      data: {
        id: `msg-${Date.now()}`,
        bookingId: newId,
        senderId: 'system',
        senderName: 'Service Men System',
        senderRole: 'system',
        text: `Booking created for ${b.serviceName}. Scheduled on ${b.scheduledDate} at ${b.scheduledTime}.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    });

    res.json({
      ...newBooking,
      photos: newBooking.photos ? JSON.parse(newBooking.photos) : undefined,
      location: {
        division: newBooking.division,
        district: newBooking.district,
        thana: newBooking.thana,
        area: newBooking.area,
        addressDetails: newBooking.addressDetails
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status, partsAmount, cancellationReason } = req.body;
    const target = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'Booking not found' });

    let updatedParts = target.partsAmount;
    let updatedTotal = target.totalAmount;

    if (partsAmount !== undefined) {
      updatedParts = partsAmount;
      updatedTotal = target.baseAmount + partsAmount - target.discountAmount + target.platformFee;
    }

    const dataToUpdate: any = {
      status,
      partsAmount: updatedParts,
      totalAmount: updatedTotal
    };

    if (cancellationReason) {
      dataToUpdate.cancellationReason = cancellationReason;
    }

    if (status === 'service_completed') {
      dataToUpdate.completedAt = new Date().toLocaleString();
    }

    if (status === 'payment_completed') {
      dataToUpdate.paymentStatus = 'paid';
      if (target.providerId) {
        const netEarned = Math.round(updatedTotal * 0.9);
        await prisma.provider.update({
          where: { id: target.providerId },
          data: {
            completedJobs: { increment: 1 },
            totalEarnings: { increment: netEarned },
            pendingEarnings: { increment: netEarned }
          }
        });
      }
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });

    res.json({
      ...updated,
      location: {
        division: updated.division,
        district: updated.district,
        thana: updated.thana,
        area: updated.area,
        addressDetails: updated.addressDetails
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id/pay', async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const target = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'Booking not found' });

    const newStatus = target.status === 'service_completed' ? 'payment_completed' : target.status;

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        paymentMethod,
        paymentStatus: 'paid',
        status: newStatus
      }
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Job Posts & Bids
app.get('/api/job-posts', async (req, res) => {
  try {
    const posts = await prisma.jobPost.findMany({
      include: { bids: true },
      orderBy: { createdAt: 'desc' }
    });

    const parsed = posts.map(jp => ({
      ...jp,
      attachments: JSON.parse(jp.attachments),
      location: {
        division: jp.division,
        district: jp.district,
        thana: jp.thana,
        area: jp.area,
        addressDetails: jp.addressDetails
      }
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/job-posts', async (req, res) => {
  try {
    const jp = req.body;
    const newId = `job-${Date.now().toString().slice(-4)}`;

    const newPost = await prisma.jobPost.create({
      data: {
        id: newId,
        customerId: jp.customerId,
        customerName: jp.customerName,
        customerPhone: jp.customerPhone,
        serviceName: jp.serviceName,
        categoryId: jp.categoryId,
        problemDescription: jp.problemDescription,
        division: jp.location.division,
        district: jp.location.district,
        thana: jp.location.thana,
        area: jp.location.area,
        addressDetails: jp.location.addressDetails,
        preferredDate: jp.preferredDate,
        preferredTime: jp.preferredTime,
        budgetMin: jp.budgetMin,
        budgetMax: jp.budgetMax,
        attachments: JSON.stringify(jp.attachments || []),
        status: 'open',
        createdAt: new Date().toLocaleString()
      },
      include: { bids: true }
    });

    res.json({
      ...newPost,
      attachments: JSON.parse(newPost.attachments),
      location: {
        division: newPost.division,
        district: newPost.district,
        thana: newPost.thana,
        area: newPost.area,
        addressDetails: newPost.addressDetails
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/job-posts/:id/bids', async (req, res) => {
  try {
    const b = req.body;
    const newBid = await prisma.jobBid.create({
      data: {
        id: `bid-${Date.now().toString().slice(-4)}`,
        jobPostId: req.params.id,
        providerId: b.providerId,
        providerName: b.providerName,
        providerAvatar: b.providerAvatar,
        providerRating: b.providerRating,
        providerCompletedJobs: b.providerCompletedJobs,
        quotedAmount: b.quotedAmount,
        arrivalEstimate: b.arrivalEstimate,
        proposalNote: b.proposalNote,
        status: 'pending',
        createdAt: new Date().toLocaleString()
      }
    });
    res.json(newBid);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/job-posts/:jobId/accept-bid/:bidId', async (req, res) => {
  try {
    const { jobId, bidId } = req.params;
    const targetJob = await prisma.jobPost.findUnique({ where: { id: jobId }, include: { bids: true } });
    const targetBid = await prisma.jobBid.findUnique({ where: { id: bidId } });

    if (!targetJob || !targetBid) {
      return res.status(404).json({ error: 'Job or Bid not found' });
    }

    // Update job status to awarded
    await prisma.jobPost.update({
      where: { id: jobId },
      data: { status: 'awarded' }
    });

    // Update bid statuses
    await prisma.jobBid.updateMany({
      where: { jobPostId: jobId },
      data: { status: 'rejected' }
    });

    await prisma.jobBid.update({
      where: { id: bidId },
      data: { status: 'accepted' }
    });

    // Create corresponding booking
    const newBookingId = `bk-${Date.now().toString().slice(-4)}`;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await prisma.booking.create({
      data: {
        id: newBookingId,
        customerId: targetJob.customerId,
        customerName: targetJob.customerName,
        customerPhone: targetJob.customerPhone,
        providerId: targetBid.providerId,
        providerName: targetBid.providerName,
        providerAvatar: targetBid.providerAvatar,
        serviceId: 'srv-electrician',
        serviceName: targetJob.serviceName,
        categoryId: targetJob.categoryId,
        status: 'accepted',
        problemDescription: `${targetJob.problemDescription} [Accepted Quote: ${targetBid.arrivalEstimate}]`,
        photos: targetJob.attachments,
        division: targetJob.division,
        district: targetJob.district,
        thana: targetJob.thana,
        area: targetJob.area,
        addressDetails: targetJob.addressDetails,
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
        invoiceNumber
      }
    });

    res.json({
      booking: {
        ...newBooking,
        location: {
          division: newBooking.division,
          district: newBooking.district,
          thana: newBooking.thana,
          area: newBooking.area,
          addressDetails: newBooking.addressDetails
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
    const parsed = reviews.map(r => ({
      ...r,
      ratings: {
        quality: r.quality,
        punctuality: r.punctuality,
        behavior: r.behavior,
        priceFairness: r.priceFairness
      }
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const r = req.body;
    const newRev = await prisma.review.create({
      data: {
        id: `rev-${Date.now()}`,
        bookingId: r.bookingId,
        customerId: r.customerId,
        customerName: r.customerName,
        customerAvatar: r.customerAvatar,
        providerId: r.providerId,
        serviceName: r.serviceName,
        rating: r.rating,
        quality: r.ratings.quality,
        punctuality: r.ratings.punctuality,
        behavior: r.ratings.behavior,
        priceFairness: r.ratings.priceFairness,
        comment: r.comment,
        createdAt: new Date().toLocaleDateString()
      }
    });

    // Update provider rating
    const providerReviews = await prisma.review.findMany({ where: { providerId: r.providerId } });
    const count = providerReviews.length;
    const sum = providerReviews.reduce((s, item) => s + item.rating, 0);
    const avg = Number((sum / count).toFixed(2));

    await prisma.provider.update({
      where: { id: r.providerId },
      data: {
        rating: avg,
        reviewCount: count
      }
    });

    res.json({
      ...newRev,
      ratings: {
        quality: newRev.quality,
        punctuality: newRev.punctuality,
        behavior: newRev.behavior,
        priceFairness: newRev.priceFairness
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(complaints);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const c = req.body;
    const newComplaint = await prisma.complaint.create({
      data: {
        id: `cmp-${Date.now().toString().slice(-4)}`,
        bookingId: c.bookingId,
        invoiceNumber: c.invoiceNumber,
        customerId: c.customerId,
        customerName: c.customerName,
        customerPhone: c.customerPhone,
        providerId: c.providerId,
        providerName: c.providerName,
        reason: c.reason,
        description: c.description,
        status: 'submitted',
        createdAt: new Date().toLocaleDateString()
      }
    });
    res.json(newComplaint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/complaints/:id/resolve', async (req, res) => {
  try {
    const { resolutionNote, refundAmount } = req.body;
    const updated = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        status: 'resolved',
        resolutionNote,
        refundAmount
      }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Chat Messages
app.get('/api/chats/:bookingId', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { bookingId: req.params.bookingId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats', async (req, res) => {
  try {
    const m = req.body;
    const newMsg = await prisma.chatMessage.create({
      data: {
        id: `msg-${Date.now()}`,
        bookingId: m.bookingId,
        senderId: m.senderId,
        senderName: m.senderName,
        senderRole: m.senderRole,
        text: m.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    });
    res.json(newMsg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;
    const found = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() }
    });

    if (!found || !found.isActive) {
      return res.json({ valid: false, discount: 0, message: 'Invalid or inactive coupon code' });
    }

    if (amount < found.minBookingAmount) {
      return res.json({
        valid: false,
        discount: 0,
        message: `Minimum order amount of ৳${found.minBookingAmount} required for this coupon`
      });
    }

    let discount = 0;
    if (found.discountType === 'fixed') {
      discount = found.discountValue;
    } else {
      discount = Math.round((amount * found.discountValue) / 100);
    }

    res.json({ valid: true, discount, message: `Success! You saved ৳${discount}`, coupon: found });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const c = req.body;
    const newCoupon = await prisma.coupon.create({
      data: {
        code: c.code.toUpperCase(),
        discountType: c.discountType,
        discountValue: c.discountValue,
        minBookingAmount: c.minBookingAmount,
        description: c.description,
        descriptionBn: c.descriptionBn,
        expiryDate: c.expiryDate,
        usageCount: 0,
        isActive: true
      }
    });
    res.json(newCoupon);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Withdrawals
app.get('/api/withdrawals', async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({ orderBy: { requestedAt: 'desc' } });
    res.json(withdrawals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/withdrawals', async (req, res) => {
  try {
    const w = req.body;
    const newWithdrawal = await prisma.withdrawalRequest.create({
      data: {
        id: `wdr-${Date.now().toString().slice(-4)}`,
        providerId: w.providerId,
        providerName: w.providerName,
        amount: w.amount,
        method: w.method,
        accountPhone: w.phone,
        status: 'pending',
        requestedAt: new Date().toLocaleDateString()
      }
    });

    // Deduct pending earnings
    await prisma.provider.update({
      where: { id: w.providerId },
      data: {
        pendingEarnings: { decrement: w.amount }
      }
    });

    res.json(newWithdrawal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Service Men Backend Database API Server running at http://localhost:${PORT}`);
});
