import { Volume2 } from 'lucide-react';

const announcements = [
  'Mandatory CPD hours updated - View new professional development requirements',
  'Registration window for Allied Healthcare Professionals now open till January 2025',
  'State Council elections scheduled for February 2025',
  'New guidelines for foreign healthcare professionals seeking registration in India',
];

const AnnouncementTicker = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3 gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 bg-accent text-accent-foreground rounded-full px-4 py-1.5 flex-shrink-0">
            <Volume2 className="h-4 w-4" />
            <span className="font-semibold text-sm">Announcements</span>
          </div>

          {/* Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex gap-16">
              {[...announcements, ...announcements].map((announcement, index) => (
                <span key={index} className="inline-flex items-center gap-3 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {announcement}
                </span>
              ))}
            </div>
          </div>

          {/* Close button placeholder */}
          <button
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close announcements"
          >
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementTicker;
