import { useState } from 'react';
import { ChevronLeft, ChevronRight, Stethoscope, Eye, Ear, Activity, Heart, Brain, Microscope, Pill } from 'lucide-react';

const categories = [
  {
    id: 1,
    icon: Stethoscope,
    title: 'Clinical Laboratory Sciences',
    professions: ['Medical Laboratory Technologist', 'Phlebotomist', 'Histotechnician'],
    count: 12,
  },
  {
    id: 2,
    icon: Eye,
    title: 'Optometry & Vision Sciences',
    professions: ['Optometrist', 'Ophthalmic Technician', 'Vision Therapist'],
    count: 8,
  },
  {
    id: 3,
    icon: Activity,
    title: 'Physiotherapy & Rehabilitation',
    professions: ['Physiotherapist', 'Occupational Therapist', 'Prosthetist'],
    count: 15,
  },
  {
    id: 4,
    icon: Ear,
    title: 'Audiology & Speech Sciences',
    professions: ['Audiologist', 'Speech Therapist', 'Hearing Aid Specialist'],
    count: 6,
  },
  {
    id: 5,
    icon: Heart,
    title: 'Cardio-Pulmonary Sciences',
    professions: ['Perfusionist', 'Respiratory Therapist', 'Cardiac Technologist'],
    count: 9,
  },
  {
    id: 6,
    icon: Brain,
    title: 'Behavioral Health Sciences',
    professions: ['Clinical Psychologist', 'Psychiatric Social Worker', 'Counselor'],
    count: 7,
  },
  {
    id: 7,
    icon: Microscope,
    title: 'Medical Imaging Technology',
    professions: ['Radiographer', 'Sonographer', 'Nuclear Medicine Technologist'],
    count: 11,
  },
  {
    id: 8,
    icon: Pill,
    title: 'Nutrition & Dietetics',
    professions: ['Clinical Dietitian', 'Nutritionist', 'Food Service Manager'],
    count: 5,
  },
];

const CategoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, categories.length - itemsPerPage);

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
            <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-sm text-secondary font-semibold uppercase tracking-wide">
                Professional Categories
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Allied Health Professions
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Explore the 50+ allied healthcare professions regulated under NCAHP across multiple categories.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
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
        </div>

        {/* Categories Carousel */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage + 2)}%)` }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
              >
                <a
                  href={`/professions/${category.id}`}
                  className="group block bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover-lift h-full"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                    <category.icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>

                  {/* Professions List */}
                  <ul className="space-y-2 mb-4">
                    {category.professions.slice(0, 3).map((profession, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        {profession}
                      </li>
                    ))}
                  </ul>

                  {/* Count Badge */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      {category.count} professions
                    </span>
                    <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors flex items-center gap-1">
                      View All
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 h-2 bg-primary rounded-full'
                  : 'w-2 h-2 bg-border hover:bg-muted-foreground/50 rounded-full'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
