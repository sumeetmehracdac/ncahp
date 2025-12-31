import { Calendar, ArrowRight, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const newsItems = [
  {
    id: 1,
    title: 'NCAHP Announces New Registration Guidelines for 2025',
    date: '28 Dec 2024',
    category: 'Guidelines',
    excerpt: 'Updated guidelines for professional registration process effective from January 2025.',
  },
  {
    id: 2,
    title: 'State Council Elections: Schedule Released',
    date: '25 Dec 2024',
    category: 'Elections',
    excerpt: 'Elections for State Allied Healthcare Councils to be conducted in February 2025.',
  },
  {
    id: 3,
    title: 'Workshop on Digital Healthcare Practices',
    date: '22 Dec 2024',
    category: 'Events',
    excerpt: 'National workshop to be held in New Delhi focusing on digital transformation.',
  },
];

const notifications = [
  {
    id: 1,
    title: 'Extension of Registration Deadline',
    date: '27 Dec 2024',
    type: 'Circular',
  },
  {
    id: 2,
    title: 'Revised Fee Structure for 2025',
    date: '24 Dec 2024',
    type: 'Notification',
  },
  {
    id: 3,
    title: 'Online Verification System Update',
    date: '20 Dec 2024',
    type: 'Notice',
  },
  {
    id: 4,
    title: 'State Council Formation Guidelines',
    date: '18 Dec 2024',
    type: 'Guidelines',
  },
];

const events = [
  {
    id: 1,
    title: 'Annual Healthcare Summit 2025',
    date: '15 Jan 2025',
    location: 'Vigyan Bhawan, New Delhi',
  },
  {
    id: 2,
    title: 'Regional Workshop - South Zone',
    date: '22 Jan 2025',
    location: 'Chennai',
  },
  {
    id: 3,
    title: 'NCAHP Foundation Day',
    date: '28 Mar 2025',
    location: 'New Delhi',
  },
];

const NewsUpdatesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-primary font-semibold uppercase tracking-wide">
              Stay Informed
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            News & Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, notifications, and events from NCAHP.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="news" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted p-1 rounded-xl h-auto">
            <TabsTrigger value="news" className="py-3 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg">
              Latest News
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="events" className="py-3 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg">
              Upcoming Events
            </TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <article
                  key={item.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.excerpt}
                    </p>
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
                      Read More <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-0">
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              {notifications.map((item, index) => (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center gap-4 p-5 hover:bg-muted transition-colors ${
                    index !== notifications.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span className="text-accent font-medium">{item.type}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" className="font-semibold">
                View All Notifications
              </Button>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-saffron-dark flex flex-col items-center justify-center text-accent-foreground flex-shrink-0">
                      <span className="text-lg font-bold leading-none">{item.date.split(' ')[0]}</span>
                      <span className="text-xs font-medium">{item.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                View All Events
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default NewsUpdatesSection;
