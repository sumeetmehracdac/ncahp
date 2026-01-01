import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Sparkles, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AnnouncementFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: 'all' | 'new' | 'archived';
  onFilterChange: (filter: 'all' | 'new' | 'archived') => void;
  counts: { all: number; new: number; archived: number };
}

const AnnouncementFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts,
}: AnnouncementFiltersProps) => {
  const filters = [
    { key: 'all' as const, label: 'All', icon: Filter, count: counts.all },
    { key: 'new' as const, label: 'Active', icon: Sparkles, count: counts.new },
    { key: 'archived' as const, label: 'Past', icon: Archive, count: counts.archived },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11 pr-4 h-12 rounded-xl border-border bg-card focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant="ghost"
                onClick={() => onFilterChange(filter.key)}
                className={`relative h-10 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-card text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <filter.icon className="h-4 w-4 mr-2" />
                {filter.label}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
      </div>
    </motion.div>
  );
};

export default AnnouncementFilters;
