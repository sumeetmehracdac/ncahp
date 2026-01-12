import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { professionCategories, allProfessions, getProfessionByName, type Profession } from '@/data/professions';

interface ProfessionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ProfessionSelect = ({
  value,
  onValueChange,
  placeholder = 'Search or select a profession...',
  disabled = false,
}: ProfessionSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Get selected profession data
  const selectedProfession = value ? getProfessionByName(value) : null;

  // Filter professions based on search
  const filteredProfessions = useMemo(() => {
    if (!searchQuery.trim()) return allProfessions;
    const query = searchQuery.toLowerCase();
    return allProfessions.filter(
      prof =>
        prof.name.toLowerCase().includes(query) ||
        prof.categoryName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered professions by category
  const groupedProfessions = useMemo(() => {
    const groups: Record<string, Profession[]> = {};
    filteredProfessions.forEach(prof => {
      if (!groups[prof.categoryId]) {
        groups[prof.categoryId] = [];
      }
      groups[prof.categoryId].push(prof);
    });
    return groups;
  }, [filteredProfessions]);

  // Check scroll position for category pills
  const checkScrollPosition = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Scroll category pills
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 150;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Check scroll on mount and resize
  useEffect(() => {
    if (isOpen) {
      setTimeout(checkScrollPosition, 100);
      window.addEventListener('resize', checkScrollPosition);
      return () => window.removeEventListener('resize', checkScrollPosition);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (profession: Profession) => {
    onValueChange(profession.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full h-14 px-4 flex items-center justify-between gap-3',
          'bg-white border-2 rounded-xl transition-all duration-200',
          'text-left focus:outline-none',
          isOpen 
            ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
            : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed bg-muted'
        )}
      >
        {selectedProfession ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${selectedProfession.color}15` }}
            >
              <selectedProfession.icon
                className="w-5 h-5"
                style={{ color: selectedProfession.color }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{selectedProfession.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {professionCategories.find(c => c.id === selectedProfession.categoryId)?.shortName}
              </p>
            </div>
            {!disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Stethoscope className="w-5 h-5" />
            <span>{placeholder}</span>
          </div>
        )}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 right-0 z-[100] mt-2',
              'bg-white border border-border rounded-xl shadow-2xl overflow-hidden'
            )}
            style={{ maxHeight: '400px' }}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search professions..."
                  className="pl-10 h-10 bg-white border-border"
                />
              </div>
              
              {/* Category Pills with Arrow Navigation */}
              <div className="relative mt-3 flex items-center gap-1">
                {/* Left Arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollCategories('left')}
                    className="flex-shrink-0 w-7 h-7 rounded-md bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                
                {/* Scrollable Category Container */}
                <div
                  ref={categoryScrollRef}
                  onScroll={checkScrollPosition}
                  className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <Badge
                    variant={activeCategory === null ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer text-xs transition-all flex-shrink-0 whitespace-nowrap',
                      activeCategory === null 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-primary/10'
                    )}
                    onClick={() => setActiveCategory(null)}
                  >
                    All ({allProfessions.length})
                  </Badge>
                  {professionCategories.map(cat => {
                    const count = groupedProfessions[cat.id]?.length || 0;
                    if (count === 0 && searchQuery) return null;
                    return (
                      <Badge
                        key={cat.id}
                        variant={activeCategory === cat.id ? 'default' : 'outline'}
                        className={cn(
                          'cursor-pointer text-xs transition-all flex-shrink-0 whitespace-nowrap',
                          activeCategory === cat.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-primary/10'
                        )}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      >
                        {cat.shortName} ({count})
                      </Badge>
                    );
                  })}
                </div>
                
                {/* Right Arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollCategories('right')}
                    className="flex-shrink-0 w-7 h-7 rounded-md bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Professions List */}
            <ScrollArea className="h-[250px]">
              <div className="p-2">
                {filteredProfessions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No professions found</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  professionCategories
                    .filter(cat => {
                      if (activeCategory && activeCategory !== cat.id) return false;
                      return groupedProfessions[cat.id]?.length > 0;
                    })
                    .map(cat => (
                      <div key={cat.id} className="mb-3 last:mb-0">
                        {/* Category Header */}
                        <div className="px-2 py-1.5 mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {cat.shortName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {groupedProfessions[cat.id]?.length || 0}
                          </span>
                        </div>
                        
                        {/* Professions Grid */}
                        <div className="grid grid-cols-1 gap-0.5">
                          {groupedProfessions[cat.id]?.map(prof => {
                            const isSelected = value === prof.name;
                            const Icon = prof.icon;
                            
                            return (
                              <motion.button
                                key={prof.id}
                                type="button"
                                whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.995 }}
                                onClick={() => handleSelect(prof)}
                                className={cn(
                                  'w-full px-3 py-2 flex items-center gap-3 rounded-lg text-left transition-all',
                                  isSelected
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'hover:bg-muted/70 border border-transparent'
                                )}
                              >
                                <div
                                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${prof.color}15` }}
                                >
                                  <Icon
                                    className="w-3.5 h-3.5"
                                    style={{ color: prof.color }}
                                  />
                                </div>
                                <span className={cn(
                                  'flex-1 text-sm truncate',
                                  isSelected ? 'font-medium text-primary' : 'text-foreground'
                                )}>
                                  {prof.name}
                                </span>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-3 py-2 bg-muted/30 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filteredProfessions.length} profession{filteredProfessions.length !== 1 ? 's' : ''} available
              </span>
              {value && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear selection
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionSelect;
