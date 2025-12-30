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
      className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(135deg, hsla(210, 60%, 15%, 0.92) 0%, hsla(210, 50%, 25%, 0.88) 50%, hsla(180, 60%, 35%, 0.85) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-foreground rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 absolute inset-0 translate-y-8 pointer-events-none'
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-primary-foreground/90 font-medium">
                  NCAHP - Government of India
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {slide.ctaLink === '/register' ? (
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent hover:bg-saffron-dark text-accent-foreground font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-lg transition-all"
                  >
                    <Link to={slide.ctaLink}>{slide.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-saffron-dark text-accent-foreground font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-lg transition-all"
                  >
                    {slide.cta}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 px-8 py-6 text-lg"
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
