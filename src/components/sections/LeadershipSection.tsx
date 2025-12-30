import { Linkedin, Mail } from 'lucide-react';

const leaders = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    designation: 'Chairperson, NCAHP',
    title: 'Hon\'ble Chairperson',
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    designation: 'Vice Chairperson, NCAHP',
    title: 'Vice Chairperson',
  },
  {
    id: 3,
    name: 'Shri Amit Verma',
    designation: 'Member Secretary',
    title: 'Member Secretary',
  },
];

const LeadershipSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-primary font-semibold uppercase tracking-wide">
              Leadership
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Commission Leadership
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the distinguished leaders guiding NCAHP towards excellence in allied healthcare regulation.
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Photo Placeholder */}
              <div className="aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-primary">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-primary-foreground" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4 text-primary-foreground" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <span className="inline-block text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  {leader.title}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  {leader.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {leader.designation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="/about/members"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-navy-light transition-colors link-underline"
          >
            View All Commission Members
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
