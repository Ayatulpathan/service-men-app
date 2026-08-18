import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Service Men Database...');

  // 1. Seed Categories
  for (const cat of SERVICE_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        nameBn: cat.nameBn,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        descriptionBn: cat.descriptionBn,
        commissionRate: cat.commissionRate,
        color: cat.color,
        badge: cat.badge
      }
    });
  }

  // 2. Seed Services
  for (const srv of SERVICE_ITEMS) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: {},
      create: {
        id: srv.id,
        categoryId: srv.categoryId,
        name: srv.name,
        nameBn: srv.nameBn,
        description: srv.description,
        descriptionBn: srv.descriptionBn,
        icon: srv.icon,
        basePrice: srv.basePrice,
        priceType: srv.priceType,
        isEmergency: srv.isEmergency,
        popular: srv.popular || false,
        warrantyDays: srv.warrantyDays,
        features: JSON.stringify(srv.features),
        featuresBn: JSON.stringify(srv.featuresBn)
      }
    });
  }

  // 3. Seed Locations
  for (const div of BANGLADESH_LOCATIONS) {
    for (const dist of div.districts) {
      for (const th of dist.thanas) {
        await prisma.location.create({
          data: {
            division: div.division,
            divisionBn: div.divisionBn,
            district: dist.name,
            districtBn: dist.nameBn,
            thana: th.name,
            thanaBn: th.nameBn,
            areas: JSON.stringify(th.areas)
          }
        });
      }
    }
  }

  // 4. Seed Users
  await prisma.user.upsert({
    where: { phone: '01712-987654' },
    update: {},
    create: {
      id: 'user-c1',
      name: 'Shakil Ahmed',
      nameBn: 'শাকিল আহমেদ',
      phone: '01712-987654',
      email: 'shakil.ahmed@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mirpur',
      area: 'Mirpur-2',
      addressDetails: 'House 24, Road 5, Block B, Mirpur-2, Dhaka',
      loyaltyPoints: 350,
      referralCode: 'SHAKIL100'
    }
  });

  await prisma.user.upsert({
    where: { phone: '01900-000111' },
    update: {},
    create: {
      id: 'admin-1',
      name: 'System Admin HQ',
      nameBn: 'হেডকোয়ার্টার এডমিন',
      phone: '01900-000111',
      email: 'admin@servicemen.bd',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      area: 'Gulshan-1',
      loyaltyPoints: 9999,
      referralCode: 'ADMINVIP'
    }
  });

  await prisma.user.upsert({
    where: { phone: '01988-112233' },
    update: {},
    create: {
      id: 'user-c2',
      name: 'Tasnim Rahman',
      phone: '01988-112233',
      email: 'tasnim@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      division: 'Chattogram',
      district: 'Chattogram',
      thana: 'Agrabad',
      area: 'Commercial Area',
      referralCode: 'TASNIM20'
    }
  });

  await prisma.user.upsert({
    where: { phone: '01715-443322' },
    update: {},
    create: {
      id: 'user-c4',
      name: 'Mahmudur Rahman',
      phone: '01715-443322',
      email: 'mahmud@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Uttara',
      area: 'Sector 4',
      referralCode: 'MAHMUD50'
    }
  });

  await prisma.user.upsert({
    where: { phone: '01719-887766' },
    update: {},
    create: {
      id: 'user-c3',
      name: 'Farhana Kabir',
      phone: '01719-887766',
      email: 'farhana@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      area: 'Gulshan-1',
      referralCode: 'FARHANA10'
    }
  });

  // 5. Seed Providers
  for (const prov of MOCK_PROVIDERS) {
    await prisma.provider.upsert({
      where: { id: prov.id },
      update: {},
      create: {
        id: prov.id,
        name: prov.name,
        nameBn: prov.nameBn,
        phone: prov.phone,
        email: prov.email,
        avatar: prov.avatar,
        nidNumber: prov.nidNumber,
        nidStatus: prov.nidStatus,
        verifiedBadges: JSON.stringify(prov.verifiedBadges),
        experienceYears: prov.experienceYears,
        rating: prov.rating,
        reviewCount: prov.reviewCount,
        completedJobs: prov.completedJobs,
        bio: prov.bio,
        bioBn: prov.bioBn,
        skills: JSON.stringify(prov.skills),
        serviceArea: JSON.stringify(prov.serviceArea),
        division: prov.division,
        district: prov.district,
        serviceCategories: JSON.stringify(prov.serviceCategories),
        hourlyRate: prov.hourlyRate,
        startingPrice: prov.startingPrice,
        isAvailable: prov.isAvailable,
        emergencyReady: prov.emergencyReady,
        joinedDate: prov.joinedDate,
        ratingQuality: prov.ratingBreakdown.quality,
        ratingPunctuality: prov.ratingBreakdown.punctuality,
        ratingBehavior: prov.ratingBreakdown.behavior,
        ratingPriceFairness: prov.ratingBreakdown.priceFairness,
        pastWorkImages: JSON.stringify(prov.pastWorkImages),
        totalEarnings: prov.earnings.total,
        pendingEarnings: prov.earnings.pending,
        withdrawnEarnings: prov.earnings.withdrawn
      }
    });
  }

  // 6. Seed Coupons
  for (const c of INITIAL_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minBookingAmount: c.minBookingAmount,
        description: c.description,
        descriptionBn: c.descriptionBn,
        expiryDate: c.expiryDate,
        usageCount: c.usageCount,
        isActive: c.isActive
      }
    });
  }

  // 7. Seed Bookings
  for (const bk of INITIAL_BOOKINGS) {
    await prisma.booking.upsert({
      where: { id: bk.id },
      update: {},
      create: {
        id: bk.id,
        customerId: bk.customerId,
        customerName: bk.customerName,
        customerPhone: bk.customerPhone,
        customerAvatar: bk.customerAvatar,
        providerId: bk.providerId,
        providerName: bk.providerName,
        providerPhone: bk.providerPhone,
        providerAvatar: bk.providerAvatar,
        serviceId: bk.serviceId,
        serviceName: bk.serviceName,
        serviceNameBn: bk.serviceNameBn,
        categoryId: bk.categoryId,
        status: bk.status,
        problemDescription: bk.problemDescription,
        photos: bk.photos ? JSON.stringify(bk.photos) : null,
        division: bk.location.division,
        district: bk.location.district,
        thana: bk.location.thana,
        area: bk.location.area,
        addressDetails: bk.location.addressDetails,
        scheduledDate: bk.scheduledDate,
        scheduledTime: bk.scheduledTime,
        isEmergency: bk.isEmergency,
        pricingType: bk.pricingType,
        baseAmount: bk.baseAmount,
        partsAmount: bk.partsAmount || 0,
        discountAmount: bk.discountAmount || 0,
        platformFee: bk.platformFee,
        totalAmount: bk.totalAmount,
        paymentMethod: bk.paymentMethod,
        paymentStatus: bk.paymentStatus,
        couponCode: bk.couponCode,
        warrantyDays: bk.warrantyDays,
        createdAt: bk.createdAt,
        completedAt: bk.completedAt,
        cancellationReason: bk.cancellationReason,
        invoiceNumber: bk.invoiceNumber
      }
    });
  }

  // 8. Seed Job Posts & Bids
  for (const jp of INITIAL_JOB_POSTS) {
    await prisma.jobPost.upsert({
      where: { id: jp.id },
      update: {},
      create: {
        id: jp.id,
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
        attachments: JSON.stringify(jp.attachments),
        status: jp.status,
        createdAt: jp.createdAt
      }
    });

    for (const bid of jp.bids) {
      await prisma.jobBid.upsert({
        where: { id: bid.id },
        update: {},
        create: {
          id: bid.id,
          jobPostId: bid.jobPostId,
          providerId: bid.providerId,
          providerName: bid.providerName,
          providerAvatar: bid.providerAvatar,
          providerRating: bid.providerRating,
          providerCompletedJobs: bid.providerCompletedJobs,
          quotedAmount: bid.quotedAmount,
          arrivalEstimate: bid.arrivalEstimate,
          proposalNote: bid.proposalNote,
          status: bid.status,
          createdAt: bid.createdAt
        }
      });
    }
  }

  // 9. Seed Reviews
  for (const rev of INITIAL_REVIEWS) {
    await prisma.review.upsert({
      where: { id: rev.id },
      update: {},
      create: {
        id: rev.id,
        bookingId: 'bk-1002',
        customerId: rev.customerId,
        customerName: rev.customerName,
        customerAvatar: rev.customerAvatar,
        providerId: rev.providerId,
        serviceName: rev.serviceName,
        rating: rev.rating,
        quality: rev.ratings.quality,
        punctuality: rev.ratings.punctuality,
        behavior: rev.ratings.behavior,
        priceFairness: rev.ratings.priceFairness,
        comment: rev.comment,
        createdAt: rev.createdAt
      }
    });
  }

  // 10. Seed Complaints
  for (const cmp of INITIAL_COMPLAINTS) {
    await prisma.complaint.upsert({
      where: { id: cmp.id },
      update: {},
      create: {
        id: cmp.id,
        bookingId: 'bk-1001',
        invoiceNumber: cmp.invoiceNumber,
        customerId: cmp.customerId,
        customerName: cmp.customerName,
        customerPhone: cmp.customerPhone,
        providerId: cmp.providerId,
        providerName: cmp.providerName,
        reason: cmp.reason,
        description: cmp.description,
        status: cmp.status,
        resolutionNote: cmp.resolutionNote,
        refundAmount: cmp.refundAmount,
        createdAt: cmp.createdAt
      }
    });
  }

  // 11. Seed Chat Messages
  for (const msg of INITIAL_CHAT_MESSAGES) {
    await prisma.chatMessage.upsert({
      where: { id: msg.id },
      update: {},
      create: {
        id: msg.id,
        bookingId: msg.bookingId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        text: msg.text,
        timestamp: msg.timestamp
      }
    });
  }

  console.log('Database Seeding Completed Successfully! 🎉');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
