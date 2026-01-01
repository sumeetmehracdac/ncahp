import { motion } from 'framer-motion';
import { Calendar, FileText, Download, Clock, Sparkles } from 'lucide-react';
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/40 to-transparent hidden lg:block" style={{ left: '-2rem' }} />
      
      {/* Timeline dot */}
      <div className={`absolute hidden lg:flex items-center justify-center w-4 h-4 rounded-full border-2 ${isNew ? 'bg-accent border-accent' : 'bg-muted border-border'}`} style={{ left: 'calc(-2rem - 7px)', top: '2rem' }}>
        {isNew && <span className="absolute w-6 h-6 rounded-full bg-accent/30 animate-ping" />}
      </div>

      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${isNew ? 'bg-card border-accent/30 shadow-lg hover:shadow-xl' : 'bg-card/80 border-border hover:border-accent/20 shadow-card hover:shadow-card-hover'}`}>
        {/* New badge ribbon */}
        {isNew && (
          <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-accent to-accent-light px-12 py-1.5 text-xs font-bold text-accent-foreground uppercase tracking-wider shadow-md z-10">
            <Sparkles className="inline h-3 w-3 mr-1" />
            New
          </div>
        )}

        {/* Card content */}
        <div className="p-6 lg:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(announcement.createdAt)}</span>
            </div>
            {isNew && (
              <Badge variant="outline" className="border-accent/50 text-accent bg-accent/5 font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Active until {formatDate(announcement.toDate)}
              </Badge>
            )}
          </div>

          {/* Title and punchline */}
          <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {announcement.title}
          </h3>
          <p className="text-accent font-semibold text-sm mb-4 italic">
            "{announcement.punchline}"
          </p>

          {/* Main content */}
          <div className="prose prose-sm max-w-none text-muted-foreground mb-6 leading-relaxed">
            <p className="line-clamp-4">{announcement.content}</p>
          </div>

          {/* Documents section */}
          {announcement.documents.length > 0 && (
            <div className="border-t border-border pt-5">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Attached Documents ({announcement.documents.length})
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {announcement.documents.map((doc, idx) => (
                  <motion.a
                    key={idx}
                    href={doc.url}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all duration-200 group/doc"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover/doc:text-primary transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground group-hover/doc:text-primary transition-colors flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        <div className={`h-1 w-full ${isNew ? 'bg-gradient-to-r from-primary via-accent to-primary' : 'bg-gradient-to-r from-muted via-border to-muted'}`} />
      </div>
    </motion.article>
  );
};

export default AnnouncementCard;
