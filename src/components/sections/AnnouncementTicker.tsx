import { Volume2, Bell } from 'lucide-react';

const announcements = [
  'New: Registration window for Allied Healthcare Professionals now open till January 2025',
  'Important: Mandatory renewal deadline extended for registered professionals',
  'Notice: State Council elections scheduled for February 2025',
  'Update: New guidelines for foreign healthcare professionals seeking registration in India',
];

const AnnouncementTicker = () => {
  return (
    <section className="bg-accent text-accent-foreground relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3 gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 bg-accent-foreground/10 rounded-full px-4 py-1.5 flex-shrink-0">
            <Bell className="h-4 w-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">Announcements</span>
          </div>

          {/* Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex gap-16">
              {[...announcements, ...announcements].map((announcement, index) => (
                <span key={index} className="inline-flex items-center gap-3 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground/50" />
                  {announcement}
                </span>
              ))}
            </div>
          </div>

          {/* Audio Control */}
          <button
            className="flex items-center gap-2 bg-accent-foreground/10 rounded-full px-3 py-1.5 hover:bg-accent-foreground/20 transition-colors flex-shrink-0"
            aria-label="Listen to announcements"
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Listen</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementTicker;
