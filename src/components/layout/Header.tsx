import { Phone } from 'lucide-react';
import emblemOfIndia from '@/assets/emblem-of-india.png';
import ncahpLogo from '@/assets/ncahp-logo.png';

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Left: Ministry Info */}
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={emblemOfIndia}
              alt="Emblem of India - Satyameva Jayate"
              className="h-12 md:h-16 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-sm md:text-base font-semibold" style={{ color: 'hsl(190 70% 35%)' }}>
                Ministry of Health and Family Welfare
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Government of India
              </p>
            </div>
          </div>

          {/* Center: NCAHP Logo + Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={ncahpLogo}
              alt="NCAHP - National Commission for Allied and Healthcare Professions"
              className="h-14 md:h-18 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                NCAHP
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground max-w-[280px]">
                National Commission for Allied and Healthcare Professions
              </p>
            </div>
          </div>

          {/* Right: Helpline */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Helpline
              </p>
              <p className="text-lg font-bold text-primary flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1800-XXX-XXXX
              </p>
              <p className="text-xs text-muted-foreground">
                Mon-Fri: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
