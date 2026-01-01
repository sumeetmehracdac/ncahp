import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Archive, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AnnouncementFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: 'all' | 'new' | 'archived';
  onFilterChange: (filter: 'all' | 'new' | 'archived') => void;
  categoryFilter: 'all' | 'head-office' | 'state-council';
  onCategoryChange: (category: 'all' | 'head-office' | 'state-council') => void;
  counts: { all: number; new: number; archived: number };
}

const AnnouncementFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  counts,
}: AnnouncementFiltersProps) => {
  const statusFilters = [
    { key: 'all' as const, label: 'All', icon: Filter, count: counts.all },
    { key: 'new' as const, label: 'New', icon: Sparkles, count: counts.new },
    { key: 'archived' as const, label: 'Past', icon: Archive, count: counts.archived },
  ];

  const categoryFilters = [
    { key: 'all' as const, label: 'All', icon: null },
    { key: 'head-office' as const, label: 'Head Office', icon: Building2 },
    { key: 'state-council' as const, label: 'State Council', icon: MapPin },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border py-3"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Left: Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status filter */}
            <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange(filter.key)}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <filter.icon className="h-3 w-3 mr-1" />
                  {filter.label}
                  <span className={`ml-1 px-1 text-[10px] rounded ${
                    activeFilter === filter.key
                      ? 'bg-primary/10 text-primary'
                      : 'bg-border/50 text-muted-foreground'
                  }`}>
                    {filter.count}
                  </span>
                </Button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Category filter */}
            <div className="flex items-center gap-1">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => onCategoryChange(filter.key)}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    categoryFilter === filter.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {filter.icon && <filter.icon className="h-3 w-3 mr-1" />}
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right: Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 h-8 text-sm rounded-lg border-border bg-card focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementFilters;
