import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';

// Layout
import { PersonaBanner } from './components/layout/PersonaBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Public Landing Components
import { HeroSection } from './components/public/HeroSection';
import { CategoryGrid } from './components/public/CategoryGrid';
import { EmergencyBanner } from './components/public/EmergencyBanner';
import { FeaturedProviders } from './components/public/FeaturedProviders';
import { HowItWorks } from './components/public/HowItWorks';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { CustomerReviews } from './components/public/CustomerReviews';

// Customer Components
import { ServiceDirectory } from './components/customer/ServiceDirectory';
import { ProviderDetailModal } from './components/customer/ProviderDetailModal';
import { BookingModal } from './components/customer/BookingModal';
import { PostJobModal } from './components/customer/PostJobModal';
import { JobBidsView } from './components/customer/JobBidsView';
import { BookingTracker } from './components/customer/BookingTracker';
import { ChatDrawer } from './components/customer/ChatDrawer';
import { ReviewModal } from './components/customer/ReviewModal';
import { ComplaintModal } from './components/customer/ComplaintModal';
import { ReferralLoyalty } from './components/customer/ReferralLoyalty';

// Provider Components
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { BookingRequests } from './components/provider/BookingRequests';
import { JobBiddingCenter } from './components/provider/JobBiddingCenter';
import { EarningsLedger } from './components/provider/EarningsLedger';
import { VerificationManager } from './components/provider/VerificationManager';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProviderVerification } from './components/admin/ProviderVerification';
import { DisputeCenter } from './components/admin/DisputeCenter';
import { CouponManager } from './components/admin/CouponManager';

import { ServiceItem, Provider, Booking } from './types';
import { SERVICE_ITEMS } from './data/serviceCategories';

const MainAppContent: React.FC = () => {
  const { persona, setPersona } = useAuth();
  const { language, t } = useLanguage();
  const { bookings } = useMarketplace();
  const isBn = language === 'bn';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<Provider | null>(null);
  const [isEmergencyBooking, setIsEmergencyBooking] = useState(false);

  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [providerDetailModalOpen, setProviderDetailModalOpen] = useState(false);
  const [inspectedProvider, setInspectedProvider] = useState<Provider | null>(null);

  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);

  // Quick Action Handlers
  const handleOpenEmergencyModal = () => {
    setSelectedServiceForBooking(SERVICE_ITEMS[0]); // Default to electrician / emergency
    setSelectedProviderForBooking(null);
    setIsEmergencyBooking(true);
    setBookingModalOpen(true);
  };

  const handleBookService = (service: ServiceItem, provider?: Provider) => {
    setSelectedServiceForBooking(service);
    setSelectedProviderForBooking(provider || null);
    setIsEmergencyBooking(false);
    setBookingModalOpen(true);
  };

  const handleSelectProvider = (provider: Provider) => {
    setInspectedProvider(provider);
    setProviderDetailModalOpen(true);
  };

  const handleOpenChat = (bookingId: string) => {
    setActiveChatBookingId(bookingId);
    setChatDrawerOpen(true);
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setReviewBooking(booking);
    setReviewModalOpen(true);
  };

  const handleOpenComplaintModal = (booking: Booking) => {
    setComplaintBooking(booking);
    setComplaintModalOpen(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    setActiveTab('services');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setActiveTab('services');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Sticky Persona and Language Switcher Banner */}
      <PersonaBanner />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onOpenEmergencyModal={handleOpenEmergencyModal}
        onOpenPostJobModal={() => setPostJobModalOpen(true)}
      />

      {/* Persona Sub-Navigation Tabs */}
      {persona !== 'guest' && (
        <div className="no-print bg-white border-b border-slate-200 sticky top-27 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-2.5 overflow-x-auto text-xs font-bold">
              {persona === 'customer' && (
                <>
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'home' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navHome')}
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'services' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navServices')}
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all relative ${
                      activeTab === 'bookings' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t('navBookings')}</span>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                      {bookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bids')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'bids' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navQuotes')}
                  </button>
                  <button
                    onClick={() => setActiveTab('loyalty')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'loyalty' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navLoyalty')}
                  </button>
                </>
              )}

              {persona === 'provider' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'dashboard' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navDashboard')}
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'requests' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navRequests')}
                  </button>
                  <button
                    onClick={() => setActiveTab('bidding')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'bidding' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navBidding')}
                  </button>
                  <button
                    onClick={() => setActiveTab('earnings')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'earnings' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navEarnings')}
                  </button>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'verification' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navVerification')}
                  </button>
                </>
              )}

              {persona === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'dashboard' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navDashboard')}
                  </button>
                  <button
                    onClick={() => setActiveTab('verifications')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'verifications' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navProviders')}
                  </button>
                  <button
                    onClick={() => setActiveTab('disputes')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'disputes' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navDisputes')}
                  </button>
                  <button
                    onClick={() => setActiveTab('coupons')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeTab === 'coupons' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('navCoupons')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {/* PUBLIC MARKETPLACE / GUEST VIEW */}
        {persona === 'guest' && (
          <div>
            <HeroSection
              onSearchSubmit={handleSearchSubmit}
              onSelectCategory={handleCategorySelect}
              onOpenEmergencyModal={handleOpenEmergencyModal}
              onOpenPostJobModal={() => setPostJobModalOpen(true)}
            />
            <CategoryGrid
              onSelectCategory={handleCategorySelect}
              onSelectService={(srvId) => {
                const found = SERVICE_ITEMS.find(s => s.id === srvId);
                if (found) handleBookService(found);
              }}
            />
            <EmergencyBanner onOpenEmergencyModal={handleOpenEmergencyModal} />
            <FeaturedProviders
              onSelectProvider={handleSelectProvider}
              onBookProvider={(prov) => handleBookService(SERVICE_ITEMS[0], prov)}
            />
            <HowItWorks />
            <WhyChooseUs />
            <CustomerReviews />
          </div>
        )}

        {/* CUSTOMER PORTAL */}
        {persona === 'customer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'home' && (
              <div className="space-y-8">
                <HeroSection
                  onSearchSubmit={handleSearchSubmit}
                  onSelectCategory={handleCategorySelect}
                  onOpenEmergencyModal={handleOpenEmergencyModal}
                  onOpenPostJobModal={() => setPostJobModalOpen(true)}
                />
                <CategoryGrid
                  onSelectCategory={handleCategorySelect}
                  onSelectService={(srvId) => {
                    const found = SERVICE_ITEMS.find(s => s.id === srvId);
                    if (found) handleBookService(found);
                  }}
                />
                <EmergencyBanner onOpenEmergencyModal={handleOpenEmergencyModal} />
                <FeaturedProviders
                  onSelectProvider={handleSelectProvider}
                  onBookProvider={(prov) => handleBookService(SERVICE_ITEMS[0], prov)}
                />
              </div>
            )}

            {activeTab === 'services' && (
              <ServiceDirectory
                initialCategoryId={selectedCategoryFilter}
                initialQuery={searchQuery}
                onBookService={handleBookService}
                onSelectProvider={handleSelectProvider}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingTracker
                bookings={bookings}
                onOpenChat={handleOpenChat}
                onOpenReviewModal={handleOpenReviewModal}
                onOpenComplaintModal={handleOpenComplaintModal}
              />
            )}

            {activeTab === 'bids' && (
              <JobBidsView
                onBidAccepted={() => {
                  setActiveTab('bookings');
                }}
              />
            )}

            {activeTab === 'loyalty' && <ReferralLoyalty />}
          </div>
        )}

        {/* SERVICE PROVIDER PORTAL */}
        {persona === 'provider' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {(activeTab === 'home' || activeTab === 'dashboard') && (
              <ProviderDashboard onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'requests' && (
              <BookingRequests onOpenChat={handleOpenChat} />
            )}
            {activeTab === 'bidding' && <JobBiddingCenter />}
            {activeTab === 'earnings' && <EarningsLedger />}
            {activeTab === 'verification' && <VerificationManager />}
          </div>
        )}

        {/* ADMINISTRATOR CONTROL PANEL */}
        {persona === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {(activeTab === 'home' || activeTab === 'dashboard') && (
              <AdminDashboard onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'verifications' && <ProviderVerification />}
            {activeTab === 'disputes' && <DisputeCenter />}
            {activeTab === 'coupons' && <CouponManager />}
          </div>
        )}
      </main>

      {/* Global Modals */}

      {/* 1. Booking Checkout Modal */}
      {bookingModalOpen && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          service={selectedServiceForBooking}
          provider={selectedProviderForBooking}
          isEmergencyDefault={isEmergencyBooking}
          onBookingCreated={(newBk) => {
            if (persona === 'customer') {
              setActiveTab('bookings');
            }
          }}
        />
      )}

      {/* 2. Post a Job Tender Modal */}
      {postJobModalOpen && (
        <PostJobModal
          isOpen={postJobModalOpen}
          onClose={() => setPostJobModalOpen(false)}
          onJobCreated={() => {
            if (persona === 'customer') {
              setActiveTab('bids');
            }
          }}
        />
      )}

      {/* 3. Provider Detailed Profile Modal */}
      {providerDetailModalOpen && inspectedProvider && (
        <ProviderDetailModal
          isOpen={providerDetailModalOpen}
          onClose={() => setProviderDetailModalOpen(false)}
          provider={inspectedProvider}
          onBookProvider={(prov) => {
            handleBookService(SERVICE_ITEMS[0], prov);
          }}
        />
      )}

      {/* 4. Real-Time Chat Drawer */}
      {chatDrawerOpen && activeChatBookingId && (
        <ChatDrawer
          isOpen={chatDrawerOpen}
          onClose={() => setChatDrawerOpen(false)}
          bookingId={activeChatBookingId}
        />
      )}

      {/* 5. Rating & Review Modal */}
      {reviewModalOpen && reviewBooking && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          booking={reviewBooking}
        />
      )}

      {/* 6. Complaint / Dispute Filing Modal */}
      {complaintModalOpen && complaintBooking && (
        <ComplaintModal
          isOpen={complaintModalOpen}
          onClose={() => setComplaintModalOpen(false)}
          booking={complaintBooking}
        />
      )}

      {/* Main Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <MainAppContent />
        </MarketplaceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
