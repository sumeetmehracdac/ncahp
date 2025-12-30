import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'About NCAHP', href: '/about/ncahp' },
      { label: 'Vision & Mission', href: '/about/vision' },
      { label: 'Organizational Structure', href: '/about/structure' },
      { label: 'Commission Members', href: '/about/members' },
    ],
  },
  {
    label: 'State Council',
    href: '/state-council',
    children: [
      { label: 'State Council List', href: '/state-council/list' },
      { label: 'Council Guidelines', href: '/state-council/guidelines' },
      { label: 'Forms & Documents', href: '/state-council/forms' },
    ],
  },
  {
    label: 'Regulation',
    href: '/regulation',
    children: [
      { label: 'Acts & Rules', href: '/regulation/acts' },
      { label: 'Notifications', href: '/regulation/notifications' },
      { label: 'Circulars', href: '/regulation/circulars' },
      { label: 'Guidelines', href: '/regulation/guidelines' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-elegant">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground data-[state=open]:bg-primary-foreground/10 h-14 px-5 text-sm font-medium">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[280px] gap-1 p-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <a
                                  href={child.href}
                                  className={cn(
                                    'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors',
                                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                    'text-sm font-medium'
                                  )}
                                >
                                  {child.label}
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <a
                        href={item.href}
                        className="flex items-center h-14 px-5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors rounded-md"
                      >
                        {item.label}
                      </a>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <span className="text-primary-foreground font-semibold">NCAHP</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                        }
                        className="flex items-center justify-between w-full py-3 px-4 text-primary-foreground hover:bg-primary-foreground/10 rounded-md transition-colors"
                      >
                        <span className="font-medium">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            openSubmenu === item.label && 'rotate-180'
                          )}
                        />
                      </button>
                      {openSubmenu === item.label && (
                        <ul className="ml-4 mt-1 space-y-1 border-l-2 border-accent/50 pl-4">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className="block py-2 px-3 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-md transition-colors"
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="block py-3 px-4 text-primary-foreground font-medium hover:bg-primary-foreground/10 rounded-md transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
