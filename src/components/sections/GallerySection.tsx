import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GallerySkeleton from '@/components/skeletons/GallerySkeleton';

const categories = ['All', 'Events', 'Workshops', 'Meetings', 'Ceremonies'];

const galleryItems = [
  { id: 1, category: 'Events', title: 'Annual Conference 2024' },
  { id: 2, category: 'Ceremonies', title: 'Inauguration Ceremony' },
  { id: 3, category: 'Workshops', title: 'Professional Training' },
  { id: 4, category: 'Meetings', title: 'State Council Meeting' },
  { id: 5, category: 'Events', title: 'Healthcare Summit' },
  { id: 6, category: 'Ceremonies', title: 'Award Distribution' },
];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, filteredItems.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                Gallery
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Photo Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Glimpses from our events, workshops, and official meetings.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-elegant'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="relative">
          {isLoading ? (
            <GallerySkeleton />
          ) : (
          <>
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage + 2)}%)` }}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                >
                  <div className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
                    {/* Image Placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.title}</span>
                        </div>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div>
                          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h3 className="text-lg font-display font-bold text-primary-foreground mt-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-card"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-card"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent-light transition-colors link-underline"
          >
            View Full Gallery
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
