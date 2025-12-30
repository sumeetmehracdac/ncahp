import { ExternalLink } from 'lucide-react';

const links = [
  {
    id: 1,
    title: 'Ministry of Health & Family Welfare',
    url: 'https://mohfw.gov.in',
    description: 'Government of India',
  },
  {
    id: 2,
    title: 'National Health Portal',
    url: 'https://nhp.gov.in',
    description: 'Health Information',
  },
  {
    id: 3,
    title: 'Digital India',
    url: 'https://digitalindia.gov.in',
    description: 'Digital Initiative',
  },
  {
    id: 4,
    title: 'National Medical Commission',
    url: 'https://nmc.org.in',
    description: 'Medical Regulation',
  },
  {
    id: 5,
    title: 'MyGov India',
    url: 'https://mygov.in',
    description: 'Citizen Engagement',
  },
  {
    id: 6,
    title: 'India.gov.in',
    url: 'https://india.gov.in',
    description: 'National Portal',
  },
];

const ImportantLinksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-sm text-secondary font-semibold uppercase tracking-wide">
              Quick Access
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Important Links
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access related government portals and healthcare resources.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift text-center"
            >
              {/* Logo Placeholder */}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <span className="text-lg font-bold text-primary">
                  {link.title.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {link.description}
              </p>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent mx-auto transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImportantLinksSection;
