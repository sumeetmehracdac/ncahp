import TopUtilityBar from '@/components/layout/TopUtilityBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import HeroCarousel from '@/components/sections/HeroCarousel';
import AnnouncementTicker from '@/components/sections/AnnouncementTicker';
import AboutSection from '@/components/sections/AboutSection';
import LeadershipSection from '@/components/sections/LeadershipSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import ServicesSection from '@/components/sections/ServicesSection';
import NewsUpdatesSection from '@/components/sections/NewsUpdatesSection';
import GallerySection from '@/components/sections/GallerySection';
import ImportantLinksSection from '@/components/sections/ImportantLinksSection';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      {/* Top Utility Bar */}
      <TopUtilityBar />

      {/* Header with Logos */}
      <Header />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Announcement Ticker */}
        <AnnouncementTicker />

        {/* About Section */}
        <AboutSection />

        {/* Services/Actions Section */}
        <ServicesSection />

        {/* Professional Categories */}
        <CategoriesSection />

        {/* News & Updates */}
        <NewsUpdatesSection />

        {/* Leadership Section */}
        <LeadershipSection />

        {/* Gallery Section */}
        <GallerySection />

        {/* Important Links */}
        <ImportantLinksSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Index;
