import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, ChevronDown, X, User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  color?: string;
}

interface FlowSelectorProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  icon?: React.ReactNode;
  accentColor?: string;
  emptyMessage?: string;
}

export function FlowSelector({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  searchable = true,
  icon,
  accentColor = 'primary',
  emptyMessage = 'No options available'
}: FlowSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(o => o.id === value);
  
  const filteredOptions = options.filter(option => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      option.label.toLowerCase().includes(query) ||
      option.sublabel?.toLowerCase().includes(query)
    );
  });
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </label>
      
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
          "border-2 bg-card",
          disabled 
            ? "opacity-50 cursor-not-allowed border-border" 
            : isOpen 
              ? "border-primary shadow-lg shadow-primary/10" 
              : selectedOption 
                ? "border-primary/50 hover:border-primary" 
                : "border-border hover:border-primary/50"
        )}
        whileTap={disabled ? {} : { scale: 0.99 }}
      >
        {/* Icon or Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          selectedOption 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {selectedOption ? (
            selectedOption.icon || <span className="text-sm font-bold">{getInitials(selectedOption.label)}</span>
          ) : (
            icon || <User className="w-5 h-5" />
          )}
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          {selectedOption ? (
            <>
              <p className="font-medium text-foreground truncate">{selectedOption.label}</p>
              {selectedOption.sublabel && (
                <p className="text-sm text-muted-foreground truncate">{selectedOption.sublabel}</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">{placeholder}</p>
          )}
        </div>
        
        {/* Chevron / Clear */}
        <div className="flex items-center gap-2">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </motion.button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            {searchable && options.length > 5 && (
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                    autoFocus
                  />
                </div>
              </div>
            )}
            
            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left transition-colors",
                      "hover:bg-primary/5",
                      option.id === value && "bg-primary/10"
                    )}
                  >
                    {/* Avatar/Icon */}
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold",
                      option.color || "bg-muted text-muted-foreground"
                    )}>
                      {option.icon || getInitials(option.label)}
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{option.label}</p>
                      {option.sublabel && (
                        <p className="text-xs text-muted-foreground truncate">{option.sublabel}</p>
                      )}
                    </div>
                    
                    {/* Badge */}
                    {option.badge && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {option.badge}
                      </span>
                    )}
                    
                    {/* Selected Check */}
                    {option.id === value && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  {emptyMessage}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
