import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Download, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Announcement {
  id: string;
  title: string;
  punchline: string;
  content: string;
  fromDate: Date;
  toDate: Date;
  createdAt: Date;
  documents: { name: string; url: string; size: string }[];
}

interface AnnouncementCardProps {
  announcement: Announcement;
  isNew: boolean;
  index: number;
}

const AnnouncementCard = ({ announcement, isNew, index }: AnnouncementCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{formatDate(announcement.createdAt)}</span>
            {isNew && (
              <>
                <span className="text-border">•</span>
                <Clock className="h-3 w-3 text-accent" />
                <span className="text-accent">Until {formatDate(announcement.toDate)}</span>
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

          {/* Read More Button */}
          <Link to={`/announcements/${announcement.id}`} className="mb-4">
            <Button variant="link" size="sm" className="p-0 h-auto text-primary font-medium group/link">
              Read More
              <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/link:translate-x-1" />
            </Button>
          </Link>

          {/* Documents section */}
          {announcement.documents.length > 0 && (
            <div className="border-t border-border pt-3 mt-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <FileText className="h-3 w-3 text-primary" />
                <span className="font-medium">{announcement.documents.length} Document{announcement.documents.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {announcement.documents.slice(0, 2).map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all duration-200 text-xs group/doc"
                  >
                    <FileText className="h-3 w-3 text-primary" />
                    <span className="font-medium text-foreground truncate max-w-[100px] group-hover/doc:text-primary transition-colors">
                      {doc.name}
                    </span>
                    <Download className="h-3 w-3 text-muted-foreground group-hover/doc:text-primary transition-colors" />
                  </a>
                ))}
                {announcement.documents.length > 2 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{announcement.documents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        <div className={`h-0.5 w-full ${isNew ? 'bg-gradient-to-r from-primary via-accent to-primary' : 'bg-gradient-to-r from-muted via-border to-muted'}`} />
      </div>
    </motion.article>
  );
};

export default AnnouncementCard;
