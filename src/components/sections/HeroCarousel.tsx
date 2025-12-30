import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const slides = [
  {
    id: 1,
    title: 'Empowering Allied Healthcare Professionals',
    subtitle: 'Streamlined Registration & Verification for Healthcare Excellence',
    cta: 'Register Now',
    ctaLink: '/register',
  },
  {
    id: 2,
    title: 'Building a Unified Healthcare Workforce',
    subtitle: 'One Nation, One Registration for Allied Health Professionals',
    cta: 'Verify Professional',
    ctaLink: '/verification',
  },
  {
    id: 3,
    title: 'Standards for Quality Healthcare',
    subtitle: 'Ensuring Competency and Ethics in Allied Healthcare Practice',
    cta: 'View Regulations',
    ctaLink: '/regulation',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="relative min-h-[480px] md:min-h-[550px] flex items-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(to right, hsl(228 55% 30% / 0.92) 0%, hsl(245 50% 45% / 0.85) 50%, hsl(245 45% 50% / 0.7) 75%, transparent 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right'
      }}
    >
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 absolute inset-0 translate-y-8 pointer-events-none'
              }`}
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-lg">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                {slide.ctaLink === '/register' ? (
                  <Button
                    asChild
                    size="lg"
                    className="bg-background text-primary hover:bg-background/90 font-semibold px-6 h-11"
                  >
                    <Link to={slide.ctaLink}>Get Started</Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-background text-primary hover:bg-background/90 font-semibold px-6 h-11"
                  >
                    {slide.cta}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 px-6 h-11"
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-2 bg-accent rounded-full'
                  : 'w-2 h-2 bg-primary-foreground/40 hover:bg-primary-foreground/60 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
