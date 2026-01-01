import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Download, Clock, Sparkles, ArrowRight, Eye, Copy, Building2, MapPin, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';
import DocumentPreviewModal from './DocumentPreviewModal';

export interface Announcement {
  id: string;
  title: string;
  punchline: string;
  content: string;
  fromDate: Date;
  toDate: Date;
  createdAt: Date;
  category?: 'Head Office' | 'State Council';
  documents: { name: string; url: string; size: string; type?: string }[];
}

interface AnnouncementCardProps {
  announcement: Announcement;
  isNew: boolean;
  index: number;
}

const AnnouncementCard = ({ announcement, isNew, index }: AnnouncementCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [previewDoc, setPreviewDoc] = useState<Announcement['documents'][0] | null>(null);
  const [showRightFade, setShowRightFade] = useState(false);

  // Check if content overflows to show fade indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkOverflow = () => {
        setShowRightFade(container.scrollWidth > container.clientWidth);
      };
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [announcement.documents]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      setShowRightFade(!isAtEnd);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/announcements/${announcement.id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handlePreview = (e: React.MouseEvent, doc: Announcement['documents'][0]) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewDoc(doc);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getFileIconColor = (type?: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-500';
      case 'docx':
        return 'text-blue-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative h-full"
      >
        <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 h-full flex flex-col ${isNew ? 'bg-card border-accent/30 shadow-md hover:shadow-lg' : 'bg-card/80 border-border hover:border-accent/20 shadow-sm hover:shadow-md'}`}>
          {/* New badge */}
          {isNew && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5">
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
            </div>
          )}

          {/* Card content */}
          <div className="p-4 lg:p-5 flex-1 flex flex-col">
            {/* Header row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap pr-16">
              <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
              <span>{formatDate(announcement.createdAt)}</span>
              {isNew && (
                <>
                  <span className="text-border">•</span>
                  <Clock className="h-3 w-3 text-accent flex-shrink-0" />
                  <span className="text-accent">Until {formatDate(announcement.toDate)}</span>
                </>
              )}
              {announcement.category && (
                <>
                  <span className="text-border">•</span>
                  {announcement.category === 'Head Office' ? (
                    <Building2 className="h-3 w-3 text-primary flex-shrink-0" />
                  ) : (
                    <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                  )}
                  <span>{announcement.category}</span>
                </>
              )}
            </div>

            {/* Title and punchline */}
            <h3 className="font-display text-base lg:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
              {announcement.title}
            </h3>
            <p className="text-accent font-medium text-xs mb-2 italic line-clamp-1">
              "{announcement.punchline}"
            </p>

            {/* Main content */}
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
              {announcement.content}
            </p>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 mb-4">
              <Link to={`/announcements/${announcement.id}`}>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary font-medium group/link">
                  Read More
                  <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/link:translate-x-1" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                title="Copy link"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Documents section - clean hidden scrollbar with fade indicator */}
            {announcement.documents.length > 0 && (
              <div className="border-t border-border pt-3 mt-auto">
                <div className="relative">
                  <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-2 overflow-x-auto"
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {announcement.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all duration-200 text-xs group/doc flex-shrink-0"
                      >
                        <FileText className={`h-3 w-3 ${getFileIconColor(doc.type)}`} />
                        <span className="font-medium text-foreground truncate max-w-[80px] group-hover/doc:text-primary transition-colors">
                          {doc.name.length > 15 ? `${doc.name.slice(0, 12)}...` : doc.name}
                        </span>
                        <button
                          onClick={(e) => handlePreview(e, doc)}
                          className="p-0.5 hover:bg-primary/10 rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                        <a 
                          href={doc.url} 
                          download 
                          onClick={handleDownload}
                          className="p-0.5 hover:bg-primary/10 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                      </div>
                    ))}
                  </div>
                  
                  {/* Fade indicator for more content */}
                  {showRightFade && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none flex items-center justify-end pr-1">
                      <ChevronRight className="h-3 w-3 text-muted-foreground animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom accent bar */}
          <div className={`h-0.5 w-full ${isNew ? 'bg-gradient-to-r from-primary via-accent to-primary' : 'bg-gradient-to-r from-muted via-border to-muted'}`} />
        </div>
      </motion.article>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </>
  );
};

export default AnnouncementCard;
