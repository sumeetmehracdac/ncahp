import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, Bell } from 'lucide-react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';
import AnnouncementCardSkeleton from '@/components/announcements/AnnouncementCardSkeleton';
import AnnouncementFilters from '@/components/announcements/AnnouncementFilters';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

// TODO: Replace with actual admin check from auth system
const useIsAdmin = () => {
  return true;
};

// Sample data with future dates to show "New" status
const sampleAnnouncements = [
  {
    id: '1',
    title: 'New Registration Portal Launch for Allied Health Professionals',
    punchline: 'Streamlined digital registration process now available nationwide',
    content: 'The National Commission for Allied and Healthcare Professions is pleased to announce the launch of our new digital registration portal. This state-of-the-art platform enables seamless registration, document verification, and certificate issuance for all allied health professionals across India.',
    fromDate: new Date('2025-12-20'),
    toDate: new Date('2026-02-28'),
    createdAt: new Date('2025-12-28'),
    category: 'Head Office',
    documents: [
      { name: 'Registration Guidelines 2025.pdf', url: '#', size: '2.4 MB', type: 'pdf' },
      { name: 'User Manual - Portal.pdf', url: '#', size: '1.8 MB', type: 'pdf' },
      { name: 'FAQ Document.pdf', url: '#', size: '520 KB', type: 'pdf' },
      { name: 'Technical Specs.pdf', url: '#', size: '1.1 MB', type: 'pdf' },
      { name: 'Video Tutorial Guide.pdf', url: '#', size: '340 KB', type: 'pdf' },
    ],
  },
  {
    id: '2',
    title: 'State Council Elections Schedule Released',
    punchline: 'Democratic representation for healthcare professionals',
    content: 'Elections for State Allied Healthcare Professional Councils will be conducted across all states and union territories in February 2026. This is a significant step towards ensuring democratic representation of allied health professionals in policy-making decisions.',
    fromDate: new Date('2025-12-25'),
    toDate: new Date('2026-03-15'),
    createdAt: new Date('2025-12-25'),
    category: 'State Council',
    documents: [
      { name: 'Election Schedule.pdf', url: '#', size: '890 KB', type: 'pdf' },
      { name: 'Nomination Form.docx', url: '#', size: '156 KB', type: 'docx' },
      { name: 'Electoral Guidelines.pdf', url: '#', size: '1.2 MB', type: 'pdf' },
      { name: 'Voter Registration.pdf', url: '#', size: '680 KB', type: 'pdf' },
    ],
  },
  {
    id: '3',
    title: 'National Workshop on Digital Healthcare Practices',
    punchline: 'Transforming healthcare through technology',
    content: 'A comprehensive national workshop focusing on digital transformation in allied healthcare will be held at Vigyan Bhawan, New Delhi. The workshop will cover telemedicine protocols, electronic health records management, AI in diagnostics, and cybersecurity best practices.',
    fromDate: new Date('2025-12-22'),
    toDate: new Date('2026-01-15'),
    createdAt: new Date('2025-12-22'),
    category: 'Head Office',
    documents: [
      { name: 'Workshop Agenda.pdf', url: '#', size: '450 KB', type: 'pdf' },
    ],
  },
  {
    id: '4',
    title: 'Revised Fee Structure for Professional Registration',
    punchline: 'Updated fees effective from January 2026',
    content: 'In accordance with the recommendations of the fee revision committee and after considering feedback from stakeholders, the Commission has approved a revised fee structure for professional registration and renewal.',
    fromDate: new Date('2025-11-01'),
    toDate: new Date('2025-12-15'),
    createdAt: new Date('2025-11-15'),
    category: 'Head Office',
    documents: [
      { name: 'Fee Structure 2026.pdf', url: '#', size: '320 KB', type: 'pdf' },
      { name: 'Payment Guidelines.pdf', url: '#', size: '280 KB', type: 'pdf' },
      { name: 'Concession Policy.pdf', url: '#', size: '190 KB', type: 'pdf' },
      { name: 'Refund Process.docx', url: '#', size: '145 KB', type: 'docx' },
      { name: 'Bank Details.pdf', url: '#', size: '85 KB', type: 'pdf' },
      { name: 'Payment FAQ.pdf', url: '#', size: '220 KB', type: 'pdf' },
    ],
  },
  {
    id: '5',
    title: 'Recognition of New Allied Health Programs',
    punchline: 'Expanding educational opportunities across India',
    content: 'The Commission has granted recognition to 45 new allied health professional programs across various institutions in India. These programs cover specializations in physiotherapy, medical laboratory technology, radiography, and optometry.',
    fromDate: new Date('2025-10-01'),
    toDate: new Date('2025-11-30'),
    createdAt: new Date('2025-10-20'),
    category: 'State Council',
    documents: [
      { name: 'Recognized Programs List.pdf', url: '#', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: '6',
    title: 'Guidelines for Continuing Professional Development',
    punchline: 'Lifelong learning for healthcare excellence',
    content: 'The Commission has released comprehensive guidelines for Continuing Professional Development (CPD) for all registered allied health professionals. These guidelines outline the mandatory CPD credit requirements and approved learning activities.',
    fromDate: new Date('2025-09-15'),
    toDate: new Date('2025-10-31'),
    createdAt: new Date('2025-09-20'),
    category: 'Head Office',
    documents: [
      { name: 'CPD Guidelines.pdf', url: '#', size: '780 KB', type: 'pdf' },
    ],
  },
  {
    id: '7',
    title: 'Emergency Response Protocol Updates',
    punchline: 'Enhanced preparedness for healthcare emergencies',
    content: 'New emergency response protocols have been issued for all allied health professionals. These protocols incorporate lessons learned from recent public health challenges and align with international best practices.',
    fromDate: new Date('2025-12-01'),
    toDate: new Date('2026-06-30'),
    createdAt: new Date('2025-12-01'),
    category: 'Head Office',
    documents: [
      { name: 'Emergency Protocol 2026.pdf', url: '#', size: '1.5 MB', type: 'pdf' },
    ],
  },
  {
    id: '8',
    title: 'Regional Training Centers Announcement',
    punchline: 'Skill development centers across states',
    content: 'The commission announces the establishment of 15 new regional training centers for allied health professionals. These centers will provide hands-on training and certification programs.',
    fromDate: new Date('2025-11-15'),
    toDate: new Date('2026-04-30'),
    createdAt: new Date('2025-11-20'),
    category: 'State Council',
    documents: [
      { name: 'Training Center Details.pdf', url: '#', size: '2.1 MB', type: 'pdf' },
      { name: 'Application Form.pdf', url: '#', size: '450 KB', type: 'pdf' },
    ],
  },
  {
    id: '9',
    title: 'Annual Conference 2026 Registration Open',
    punchline: 'Join healthcare leaders from across the nation',
    content: 'Registration is now open for the Annual NCAHP Conference 2026 to be held in Mumbai. The conference will feature keynote speakers, panel discussions, and networking opportunities.',
    fromDate: new Date('2025-12-10'),
    toDate: new Date('2026-03-01'),
    createdAt: new Date('2025-12-10'),
    category: 'Head Office',
    documents: [
      { name: 'Conference Brochure.pdf', url: '#', size: '3.2 MB', type: 'pdf' },
    ],
  },
  {
    id: '10',
    title: 'State Council Formation Guidelines',
    punchline: 'Framework for state-level governance',
    content: 'Comprehensive guidelines for the formation and operation of State Allied Healthcare Councils have been released. These guidelines ensure uniform standards across all states.',
    fromDate: new Date('2025-12-05'),
    toDate: new Date('2026-02-15'),
    createdAt: new Date('2025-12-05'),
    category: 'State Council',
    documents: [
      { name: 'Formation Guidelines.pdf', url: '#', size: '1.8 MB', type: 'pdf' },
      { name: 'Governance Framework.pdf', url: '#', size: '920 KB', type: 'pdf' },
    ],
  },
  {
    id: '11',
    title: 'Updated Licensing Requirements',
    punchline: 'New standards for professional practice',
    content: 'The Commission announces updated licensing requirements effective from April 2026. All professionals must ensure compliance with the new standards.',
    fromDate: new Date('2025-11-25'),
    toDate: new Date('2026-01-31'),
    createdAt: new Date('2025-11-25'),
    category: 'Head Office',
    documents: [
      { name: 'Licensing Requirements.pdf', url: '#', size: '680 KB', type: 'pdf' },
    ],
  },
  {
    id: '12',
    title: 'Inter-State Professional Mobility Framework',
    punchline: 'Seamless practice across state boundaries',
    content: 'A new framework enabling allied health professionals to practice across state boundaries has been established. This promotes workforce mobility and addresses regional shortages.',
    fromDate: new Date('2025-11-10'),
    toDate: new Date('2026-05-30'),
    createdAt: new Date('2025-11-10'),
    category: 'State Council',
    documents: [
      { name: 'Mobility Framework.pdf', url: '#', size: '1.4 MB', type: 'pdf' },
    ],
  },
];

// 6 announcements per page for optimal 2-column grid viewing
const ITEMS_PER_PAGE = 6;

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useIsAdmin();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date();

  const categorizedAnnouncements = useMemo(() => {
    let announcements = [...sampleAnnouncements];
    
    // Apply category filter
    if (categoryFilter === 'head-office') {
      announcements = announcements.filter(a => a.category === 'Head Office');
    } else if (categoryFilter === 'state-council') {
      announcements = announcements.filter(a => a.category === 'State Council');
    }

    const newAnnouncements = announcements.filter(a => a.toDate >= today);
    const archivedAnnouncements = announcements.filter(a => a.toDate < today);
    
    return {
      new: newAnnouncements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      archived: archivedAnnouncements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      all: [...newAnnouncements, ...archivedAnnouncements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }, [categoryFilter]);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnnouncements, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const isNew = (announcement) => announcement.toDate >= today;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <Navbar />
      
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-8 lg:py-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3 border border-white/20"
              >
                <Bell className="h-3 w-3 text-white" />
                <span className="text-xs text-white/90 font-medium">
                  {categorizedAnnouncements.new.length} New
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
              >
                Official Announcements
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-sm md:text-base text-white/80 mt-2 max-w-xl"
              >
                Latest updates, notifications, and circulars from NCAHP
              </motion.p>
            </div>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Link to="/announcements/submit">
                  <Button size="default" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Announcement
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <AnnouncementFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        counts={{
          all: categorizedAnnouncements.all.length,
          new: categorizedAnnouncements.new.length,
          archived: categorizedAnnouncements.archived.length,
        }}
      />

      {/* Announcements Grid */}
      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              <AnnouncementCardSkeleton count={6} />
            </div>
          ) : paginatedAnnouncements.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {paginatedAnnouncements.map((announcement, index) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    isNew={isNew(announcement)}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No announcements found
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for updates'}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Announcements;
