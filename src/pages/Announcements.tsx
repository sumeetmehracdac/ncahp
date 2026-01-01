import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, ArrowRight, Bell, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AnnouncementCard, { Announcement } from '@/components/announcements/AnnouncementCard';
import AnnouncementFilters from '@/components/announcements/AnnouncementFilters';
import { Button } from '@/components/ui/button';

// Sample data - in production this would come from a database
const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Registration Portal Launch for Allied Health Professionals',
    punchline: 'Streamlined digital registration process now available nationwide',
    content: 'The National Commission for Allied and Healthcare Professions is pleased to announce the launch of our new digital registration portal. This state-of-the-art platform enables seamless registration, document verification, and certificate issuance for all allied health professionals across India. The portal features multi-language support, Aadhaar-based verification, and real-time application tracking.',
    fromDate: new Date('2024-12-20'),
    toDate: new Date('2025-02-28'),
    createdAt: new Date('2024-12-28'),
    documents: [
      { name: 'Registration Guidelines 2025.pdf', url: '#', size: '2.4 MB' },
      { name: 'User Manual - Portal Navigation.pdf', url: '#', size: '1.8 MB' },
    ],
  },
  {
    id: '2',
    title: 'State Council Elections Schedule Released',
    punchline: 'Democratic representation for healthcare professionals',
    content: 'Elections for State Allied Healthcare Professional Councils will be conducted across all states and union territories in February 2025. This is a significant step towards ensuring democratic representation of allied health professionals in policy-making decisions. All registered professionals are encouraged to participate in this historic electoral process.',
    fromDate: new Date('2024-12-25'),
    toDate: new Date('2025-03-15'),
    createdAt: new Date('2024-12-25'),
    documents: [
      { name: 'Election Schedule 2025.pdf', url: '#', size: '890 KB' },
      { name: 'Nomination Form.docx', url: '#', size: '156 KB' },
      { name: 'Electoral Guidelines.pdf', url: '#', size: '1.2 MB' },
    ],
  },
  {
    id: '3',
    title: 'National Workshop on Digital Healthcare Practices',
    punchline: 'Transforming healthcare through technology',
    content: 'A comprehensive national workshop focusing on digital transformation in allied healthcare will be held at Vigyan Bhawan, New Delhi. The workshop will cover telemedicine protocols, electronic health records management, AI in diagnostics, and cybersecurity best practices for healthcare data. Distinguished speakers from leading institutions will share their expertise.',
    fromDate: new Date('2024-12-22'),
    toDate: new Date('2025-01-15'),
    createdAt: new Date('2024-12-22'),
    documents: [
      { name: 'Workshop Agenda.pdf', url: '#', size: '450 KB' },
    ],
  },
  {
    id: '4',
    title: 'Revised Fee Structure for Professional Registration',
    punchline: 'Updated fees effective from January 2025',
    content: 'In accordance with the recommendations of the fee revision committee and after considering feedback from stakeholders, the Commission has approved a revised fee structure for professional registration and renewal. The new structure aims to balance operational sustainability with accessibility for professionals across different economic backgrounds.',
    fromDate: new Date('2024-11-01'),
    toDate: new Date('2024-12-15'),
    createdAt: new Date('2024-11-15'),
    documents: [
      { name: 'Fee Structure 2025.pdf', url: '#', size: '320 KB' },
      { name: 'Payment Guidelines.pdf', url: '#', size: '280 KB' },
    ],
  },
  {
    id: '5',
    title: 'Recognition of New Allied Health Programs',
    punchline: 'Expanding educational opportunities across India',
    content: 'The Commission has granted recognition to 45 new allied health professional programs across various institutions in India. These programs cover specializations in physiotherapy, medical laboratory technology, radiography, and optometry. This expansion will help address the growing demand for skilled healthcare professionals in the country.',
    fromDate: new Date('2024-10-01'),
    toDate: new Date('2024-11-30'),
    createdAt: new Date('2024-10-20'),
    documents: [
      { name: 'Recognized Programs List.pdf', url: '#', size: '1.1 MB' },
    ],
  },
];

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'archived'>('all');

  const today = new Date();

  const categorizedAnnouncements = useMemo(() => {
    const newAnnouncements = sampleAnnouncements.filter(a => a.toDate >= today);
    const archivedAnnouncements = sampleAnnouncements.filter(a => a.toDate < today);
    
    return {
      new: newAnnouncements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      archived: archivedAnnouncements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      all: [...newAnnouncements, ...archivedAnnouncements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    let announcements = categorizedAnnouncements[activeFilter];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      announcements = announcements.filter(
        a => a.title.toLowerCase().includes(query) || 
             a.punchline.toLowerCase().includes(query) ||
             a.content.toLowerCase().includes(query)
      );
    }
    
    return announcements;
  }, [activeFilter, searchQuery, categorizedAnnouncements]);

  const isNew = (announcement: Announcement) => announcement.toDate >= today;

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-16 lg:py-24">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
            >
              <Bell className="h-4 w-4 text-white" />
              <span className="text-sm text-white/90 font-medium">
                {categorizedAnnouncements.new.length} Active Announcements
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Official Announcements
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Stay informed with the latest updates, notifications, and important circulars from the National Commission for Allied and Healthcare Professions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/announcements/submit">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Submit Announcement
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--muted))"/>
          </svg>
        </div>
      </section>

      {/* Filters */}
      <AnnouncementFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={{
          all: categorizedAnnouncements.all.length,
          new: categorizedAnnouncements.new.length,
          archived: categorizedAnnouncements.archived.length,
        }}
      />

      {/* Announcements List */}
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto lg:pl-8">
            {filteredAnnouncements.length > 0 ? (
              <div className="space-y-8">
                {filteredAnnouncements.map((announcement, index) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    isNew={isNew(announcement)}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No announcements found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for updates'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Announcements;
