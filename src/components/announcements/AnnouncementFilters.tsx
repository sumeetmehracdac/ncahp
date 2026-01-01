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
    { key: 'all' as const, label: 'All Sources', icon: Filter },
    { key: 'head-office' as const, label: 'Head Office', icon: Building2 },
    { key: 'state-council' as const, label: 'State Council', icon: MapPin },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* Top row: Search and Status Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 h-10 rounded-lg border-border bg-card focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange(filter.key)}
                  className={`relative h-8 px-3 rounded-md font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <filter.icon className="h-3.5 w-3.5 mr-1.5" />
                  {filter.label}
                  <span className={`ml-1.5 px-1.5 py-0 text-xs rounded-full ${
                    activeFilter === filter.key
                      ? 'bg-primary/10 text-primary'
                      : 'bg-border text-muted-foreground'
                  }`}>
                    {filter.count}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Bottom row: Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-2">Source:</span>
            <div className="flex items-center gap-1.5">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => onCategoryChange(filter.key)}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all duration-300 ${
                    categoryFilter === filter.key
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <filter.icon className="h-3 w-3 mr-1" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementFilters;
