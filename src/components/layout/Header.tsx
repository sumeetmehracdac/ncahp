import emblemOfIndia from '@/assets/emblem-of-india.png';
import ncahpLogo from '@/assets/ncahp-logo.png';

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 md:py-6">
          {/* Left: Emblem + Title */}
          <div className="flex items-center gap-3 md:gap-5">
            <img
              src={emblemOfIndia}
              alt="Emblem of India - Satyameva Jayate"
              className="h-14 md:h-20 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Ministry of Health & Family Welfare
              </p>
              <p className="text-xs text-muted-foreground/80">
                Government of India
              </p>
            </div>
          </div>

          {/* Center: NCAHP Logo + Title */}
          <div className="flex items-center gap-3 md:gap-5">
            <img
              src={ncahpLogo}
              alt="NCAHP - National Commission for Allied and Healthcare Professions"
              className="h-16 md:h-24 w-auto"
            />
            <div className="hidden lg:block text-right">
              <h1 className="text-lg md:text-xl font-display font-bold text-primary leading-tight">
                National Commission for
              </h1>
              <h1 className="text-lg md:text-xl font-display font-bold text-primary leading-tight">
                Allied and Healthcare Professions
              </h1>
              <p className="text-sm text-accent font-medium mt-1">
                राष्ट्रीय सहबद्ध और स्वास्थ्य देखरेख व्यवसाय आयोग
              </p>
            </div>
          </div>

          {/* Right: Ministry Logo placeholder or additional branding */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Established under</p>
              <p className="text-sm font-semibold text-primary">NCAHP Act, 2021</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
