import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  'Unified national registration for 50+ allied health professions',
  'Unique UID for every registered healthcare professional',
  'Searchable public registers for verification',
  'Standardized education and practice guidelines',
  'Recognition of foreign qualifications',
  'Online application and renewal system',
];

const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background" id="main-content">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm text-accent font-semibold uppercase tracking-wide">
                About NCAHP
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Regulating Allied Healthcare for a
              <span className="text-gradient"> Healthier India</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The National Commission for Allied and Healthcare Professions (NCAHP), 
              established under the NCAHP Act 2021, is the apex regulatory body for 
              allied and healthcare professions in India.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We ensure standardization of education, professional competency, and 
              ethical practice across all allied healthcare disciplines, maintaining 
              a unified national register for professionals across the country.
            </p>

            {/* Highlights */}
            <ul className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-secondary-foreground" />
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button className="bg-primary hover:bg-navy-light text-primary-foreground px-6 py-5 font-semibold group">
              Learn More About NCAHP
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right: Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Allied Health Professions Regulated</div>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-6 shadow-card">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-2">36</div>
              <div className="text-sm text-primary-foreground/80 font-medium">State & UT Councils</div>
            </div>
            <div className="bg-accent rounded-2xl p-6 shadow-card">
              <div className="text-4xl md:text-5xl font-display font-bold text-accent-foreground mb-2">10L+</div>
              <div className="text-sm text-accent-foreground/80 font-medium">Registered Professionals</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border">
              <div className="text-4xl md:text-5xl font-display font-bold text-secondary mb-2">2021</div>
              <div className="text-sm text-muted-foreground font-medium">Year Established</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
