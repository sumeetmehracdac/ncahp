import { Globe, Accessibility, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TopUtilityBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          {/* Left: GoI Branding */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-medium">
              Government of India
            </span>
            <span className="text-primary-foreground/60 hidden md:inline">|</span>
            <span className="hidden md:inline text-primary-foreground/80">
              Ministry of Health & Family Welfare
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
                  className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">EN</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>हिंदी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Accessibility className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex justify-between">
                  Text Size <span className="font-bold">A+</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  Text Size <span className="font-bold">A-</span>
                </DropdownMenuItem>
                <DropdownMenuItem>High Contrast</DropdownMenuItem>
                <DropdownMenuItem>Screen Reader</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Screen Reader */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Enable screen reader"
            >
              <Volume2 className="h-4 w-4" />
            </Button>

            {/* Login */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-primary-foreground hover:bg-primary-foreground/10 border border-primary-foreground/30 ml-2"
            >
              <User className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
