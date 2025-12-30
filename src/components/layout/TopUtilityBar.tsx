import { Globe, Volume2, Eye, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import emblemOfIndia from '@/assets/emblem-of-india.png';

const TopUtilityBar = () => {
  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          {/* Left: GoI Branding */}
          <div className="flex items-center gap-3">
            <img
              src={emblemOfIndia}
              alt="Emblem of India"
              className="h-6 w-auto"
            />
            <span className="text-foreground font-medium hidden sm:inline">
              Government of India
            </span>
          </div>

          {/* Right: Utility Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-accent text-accent-foreground px-3 py-1 rounded"
            >
              Skip to main content
            </a>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-foreground hover:bg-muted gap-1.5"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">English</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>हिंदी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

            {/* Audio */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-foreground hover:bg-muted"
              aria-label="Audio"
            >
              <Volume2 className="h-4 w-4" />
            </Button>

            {/* Accessibility */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-foreground hover:bg-muted"
              aria-label="Accessibility"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-foreground hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Login */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground ml-2"
            >
              <User className="h-4 w-4 mr-1.5" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
