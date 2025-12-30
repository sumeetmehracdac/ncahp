import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import emblemOfIndia from '@/assets/emblem-of-india.png';
import cdacLogo from '@/assets/cdac-logo.png';

const quickLinks = [
  { label: 'About NCAHP', href: '/about' },
  { label: 'State Councils', href: '/state-council' },
  { label: 'Acts & Rules', href: '/regulation/acts' },
  { label: 'Notifications', href: '/regulation/notifications' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'RTI', href: '/rti' },
];

const serviceLinks = [
  { label: 'Professional Registration', href: '/register' },
  { label: 'Certificate Download', href: '/certificate' },
  { label: 'Renewal', href: '/renewal' },
  { label: 'Verification', href: '/verification' },
  { label: 'Grievance Redressal', href: '/grievance' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={emblemOfIndia}
                alt="Emblem of India"
                className="h-12 w-auto brightness-0 invert"
              />
              <div>
                <h3 className="font-display font-bold text-lg">NCAHP</h3>
                <p className="text-xs text-primary-foreground/70">Govt. of India</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              The National Commission for Allied and Healthcare Professions regulates 
              the education and practice of allied and healthcare professionals in India.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Our Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  NCAHP Headquarters,<br />
                  Ministry of Health & Family Welfare,<br />
                  New Delhi - 110001
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">+91-11-XXXX-XXXX</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:contact@ncahp.gov.in" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  contact@ncahp.gov.in
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">Mon - Fri: 9:30 AM - 5:30 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <span>© 2024 NCAHP, Government of India</span>
              <span className="hidden md:inline">|</span>
              <a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="/terms" className="hover:text-accent transition-colors">Terms of Use</a>
              <span>|</span>
              <a href="/accessibility" className="hover:text-accent transition-colors">Accessibility</a>
              <span>|</span>
              <a href="/sitemap" className="hover:text-accent transition-colors">Sitemap</a>
            </div>
            <div className="flex items-center gap-2">
              <span>Designed, Developed and Maintained by</span>
              <a 
                href="https://www.cdac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={cdacLogo} 
                  alt="C-DAC" 
                  className="h-6 w-auto brightness-0 invert" 
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
