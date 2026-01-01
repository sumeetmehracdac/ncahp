import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  Sparkles,
  Share2,
  Printer,
  ChevronRight,
  Eye,
  Building2,
  MapPin,
  Copy,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Sample data - in production this would come from a database
const sampleAnnouncements = [
  {
    id: '1',
    title: 'New Registration Portal Launch for Allied Health Professionals',
    punchline: 'Streamlined digital registration process now available nationwide',
    content: `The National Commission for Allied and Healthcare Professions is pleased to announce the launch of our new digital registration portal. This state-of-the-art platform enables seamless registration, document verification, and certificate issuance for all allied health professionals across India.

The portal features multi-language support, Aadhaar-based verification, and real-time application tracking. Key highlights include:

• **Multi-language Support**: Available in Hindi, English, and 10 regional languages
• **Aadhaar Integration**: Secure identity verification through UIDAI
• **Real-time Tracking**: Monitor your application status at every stage
• **Digital Certificates**: Download verified certificates instantly
• **Mobile Responsive**: Access from any device, anywhere

All registered professionals are encouraged to create their accounts and complete their profile verification at the earliest. The portal will be mandatory for all new registrations from February 2025 onwards.

For technical assistance, please contact our helpdesk at 1800-XXX-XXXX (toll-free) between 9:00 AM to 6:00 PM on all working days.`,
    fromDate: new Date('2024-12-20'),
    toDate: new Date('2025-02-28'),
    createdAt: new Date('2024-12-28'),
    category: 'Head Office' as const,
    documents: [
      { name: 'Registration Guidelines 2025.pdf', url: '#', size: '2.4 MB', type: 'pdf' },
      { name: 'User Manual - Portal Navigation.pdf', url: '#', size: '1.8 MB', type: 'pdf' },
    ],
  },
  {
    id: '2',
    title: 'State Council Elections Schedule Released',
    punchline: 'Democratic representation for healthcare professionals',
    content: `Elections for State Allied Healthcare Professional Councils will be conducted across all states and union territories in February 2025. This is a significant step towards ensuring democratic representation of allied health professionals in policy-making decisions.

All registered professionals are encouraged to participate in this historic electoral process. The elections will be conducted in a phased manner across different zones:

**Phase 1 (February 1-7, 2025):** North Zone - Delhi, Punjab, Haryana, Himachal Pradesh, Uttarakhand, Jammu & Kashmir, Ladakh

**Phase 2 (February 8-14, 2025):** East Zone - West Bengal, Odisha, Bihar, Jharkhand, Assam, and other North-Eastern states

**Phase 3 (February 15-21, 2025):** West Zone - Maharashtra, Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Goa

**Phase 4 (February 22-28, 2025):** South Zone - Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana, Puducherry

Nomination forms can be downloaded from the portal and must be submitted by January 15, 2025. Candidates must be registered professionals with at least 5 years of practice experience.`,
    fromDate: new Date('2024-12-25'),
    toDate: new Date('2025-03-15'),
    createdAt: new Date('2024-12-25'),
    category: 'State Council' as const,
    documents: [
      { name: 'Election Schedule 2025.pdf', url: '#', size: '890 KB', type: 'pdf' },
      { name: 'Nomination Form.docx', url: '#', size: '156 KB', type: 'docx' },
      { name: 'Electoral Guidelines.pdf', url: '#', size: '1.2 MB', type: 'pdf' },
    ],
  },
  {
    id: '3',
    title: 'National Workshop on Digital Healthcare Practices',
    punchline: 'Transforming healthcare through technology',
    content: `A comprehensive national workshop focusing on digital transformation in allied healthcare will be held at Vigyan Bhawan, New Delhi. The workshop will cover telemedicine protocols, electronic health records management, AI in diagnostics, and cybersecurity best practices for healthcare data.

Distinguished speakers from leading institutions will share their expertise. Registration is mandatory and limited to 500 participants on first-come-first-served basis.`,
    fromDate: new Date('2024-12-22'),
    toDate: new Date('2025-01-15'),
    createdAt: new Date('2024-12-22'),
    category: 'Head Office' as const,
    documents: [
      { name: 'Workshop Agenda.pdf', url: '#', size: '450 KB', type: 'pdf' },
    ],
  },
  {
    id: '4',
    title: 'Revised Fee Structure for Professional Registration',
    punchline: 'Updated fees effective from January 2025',
    content: `In accordance with the recommendations of the fee revision committee and after considering feedback from stakeholders, the Commission has approved a revised fee structure for professional registration and renewal.

The new structure aims to balance operational sustainability with accessibility for professionals across different economic backgrounds. Special concessions are available for professionals from economically weaker sections.`,
    fromDate: new Date('2024-11-01'),
    toDate: new Date('2024-12-15'),
    createdAt: new Date('2024-11-15'),
    category: 'Head Office' as const,
    documents: [
      { name: 'Fee Structure 2025.pdf', url: '#', size: '320 KB', type: 'pdf' },
      { name: 'Payment Guidelines.pdf', url: '#', size: '280 KB', type: 'pdf' },
    ],
  },
  {
    id: '5',
    title: 'Recognition of New Allied Health Programs',
    punchline: 'Expanding educational opportunities across India',
    content: `The Commission has granted recognition to 45 new allied health professional programs across various institutions in India. These programs cover specializations in physiotherapy, medical laboratory technology, radiography, and optometry.

This expansion will help address the growing demand for skilled healthcare professionals in the country.`,
    fromDate: new Date('2024-10-01'),
    toDate: new Date('2024-11-30'),
    createdAt: new Date('2024-10-20'),
    category: 'State Council' as const,
    documents: [
      { name: 'Recognized Programs List.pdf', url: '#', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: '6',
    title: 'Guidelines for Continuing Professional Development',
    punchline: 'Lifelong learning for healthcare excellence',
    content: `The Commission has released comprehensive guidelines for Continuing Professional Development (CPD) for all registered allied health professionals.

These guidelines outline the mandatory CPD credit requirements, approved learning activities, and the documentation process for maintaining professional registration.`,
    fromDate: new Date('2024-09-15'),
    toDate: new Date('2024-10-31'),
    createdAt: new Date('2024-09-20'),
    category: 'Head Office' as const,
    documents: [
      { name: 'CPD Guidelines.pdf', url: '#', size: '780 KB', type: 'pdf' },
    ],
  },
];

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const today = new Date();

  const announcement = useMemo(() => {
    return sampleAnnouncements.find(a => a.id === id);
  }, [id]);

  // Find related announcements (same category, excluding current)
  const relatedAnnouncements = useMemo(() => {
    if (!announcement) return [];
    return sampleAnnouncements
      .filter(a => a.id !== id && a.category === announcement.category)
      .slice(0, 3);
  }, [id, announcement]);

  if (!announcement) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Header />
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Announcement Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The announcement you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/announcements')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Announcements
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isNew = announcement.toDate >= today;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement.title,
          text: announcement.punchline,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreview = (doc: { name: string; url: string }) => {
    // In production, this would open a proper preview modal or new tab
    toast.info(`Opening preview for ${doc.name}`);
    window.open(doc.url, '_blank');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-500/10 text-red-600';
      case 'docx':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link 
              to="/announcements" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Announcements
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
              {announcement.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate('/announcements')}
                className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Announcements
              </Button>
            </motion.div>

            {/* Article Card */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden print:shadow-none print:border-0"
            >
              {/* Header Section */}
              <div className="p-6 lg:p-8 border-b border-border">
                {/* Status and Category Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {isNew && (
                    <Badge className="bg-accent text-accent-foreground font-semibold">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  <Badge variant="outline" className="font-medium">
                    {announcement.category === 'Head Office' ? (
                      <Building2 className="h-3 w-3 mr-1" />
                    ) : (
                      <MapPin className="h-3 w-3 mr-1" />
                    )}
                    {announcement.category}
                  </Badge>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Published {formatDate(announcement.createdAt)}</span>
                  </div>
                  {isNew && (
                    <div className="flex items-center gap-2 text-accent">
                      <Clock className="h-4 w-4" />
                      <span>Valid until {formatDate(announcement.toDate)}</span>
                    </div>
                  )}
                  {!isNew && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expired on {formatDate(announcement.toDate)}</span>
                    </div>
                  )}
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
                  {announcement.title}
                </h1>
                
                <p className="text-accent font-semibold italic text-lg">
                  "{announcement.punchline}"
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-6 print:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyLink}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrint}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <Printer className="h-3 w-3" />
                    Print
                  </Button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 lg:p-8">
                <div className="prose prose-sm lg:prose-base max-w-none text-foreground">
                  {announcement.content.split('\n\n').map((paragraph, idx) => (
                    <p 
                      key={idx} 
                      className="mb-4 leading-relaxed text-muted-foreground whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                          .replace(/^• /gm, '<span class="text-primary mr-2">•</span>')
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Documents Section */}
              {announcement.documents.length > 0 && (
                <div className="p-6 lg:p-8 bg-muted/30 border-t border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Attached Documents
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {announcement.documents.map((doc, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileIcon(doc.type)}`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {doc.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{doc.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(doc)}
                            className="h-8 w-8 p-0"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <a href={doc.url} download>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className={`h-1 w-full ${isNew ? 'bg-gradient-to-r from-primary via-accent to-primary' : 'bg-gradient-to-r from-muted via-border to-muted'}`} />
            </motion.article>

            {/* Related Announcements */}
            {relatedAnnouncements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-8"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Related Announcements
                </h2>
                <div className="grid gap-4">
                  {relatedAnnouncements.map((related, idx) => (
                    <Link
                      key={related.id}
                      to={`/announcements/${related.id}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                {formatShortDate(related.createdAt)}
                              </span>
                              {related.toDate >= today && (
                                <Badge className="bg-accent/10 text-accent text-xs px-1.5 py-0">
                                  New
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {related.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {related.punchline}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AnnouncementDetail;
