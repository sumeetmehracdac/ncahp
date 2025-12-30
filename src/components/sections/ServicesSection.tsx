import { UserPlus, FileText, Award, RefreshCw, Search, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Register',
    description: 'Apply for professional registration as an allied healthcare professional',
    cta: 'Start Registration',
    href: '/register',
    color: 'bg-primary',
    iconColor: 'text-primary-foreground',
  },
  {
    id: 2,
    icon: FileText,
    title: 'Registration Status',
    description: 'Track your registration application status online',
    cta: 'Check Status',
    href: '/registration-status',
    color: 'bg-secondary',
    iconColor: 'text-secondary-foreground',
  },
  {
    id: 3,
    icon: Award,
    title: 'Download Certificate',
    description: 'Download your official registration certificate',
    cta: 'Get Certificate',
    href: '/certificate',
    color: 'bg-accent',
    iconColor: 'text-accent-foreground',
  },
  {
    id: 4,
    icon: RefreshCw,
    title: 'Renewal',
    description: 'Renew your registration before expiry',
    cta: 'Renew Now',
    href: '/renewal',
    color: 'bg-teal',
    iconColor: 'text-primary-foreground',
  },
  {
    id: 5,
    icon: Search,
    title: 'Verification',
    description: 'Verify credentials of registered professionals',
    cta: 'Verify Now',
    href: '/verification',
    color: 'bg-navy-light',
    iconColor: 'text-primary-foreground',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm text-accent font-semibold uppercase tracking-wide">
              Quick Services
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Would You Like to Do?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our key services quickly. Register, renew, download certificates, or verify professionals.
          </p>
        </div>

        {/* Service Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <a
              key={service.id}
              href={service.href}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift text-center flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`h-8 w-8 ${service.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {service.description}
              </p>

              {/* CTA */}
              <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                {service.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-hero rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Need Assistance?
          </h3>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Our helpdesk is available to guide you through the registration and verification process. 
            Contact us for any queries or technical support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-saffron-dark text-accent-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contact Helpdesk
            </a>
            <a
              href="/faqs"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors border border-primary-foreground/20"
            >
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
