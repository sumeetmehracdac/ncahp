import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutGrid,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  Building2,
  Shield,
  FileText,
  Percent,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import type { AdminContext, AdminType } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  adminTypes: AdminType[];
}

const navItems: NavItem[] = [
  {
    id: 'default-amounts',
    label: 'Default Amounts',
    icon: IndianRupee,
    path: '/payment-config/default-amounts',
    adminTypes: ['NCAHP'],
  },
  {
    id: 'relaxation-master',
    label: 'Relaxation Master',
    icon: Percent,
    path: '/payment-config/relaxation-master',
    adminTypes: ['NCAHP'],
  },
  {
    id: 'state-amounts',
    label: 'State Specific Amounts',
    icon: MapPin,
    path: '/payment-config/state-amounts',
    adminTypes: ['SC'],
  },
  {
    id: 'stakeholder-relaxations',
    label: 'Stakeholder Relaxations',
    icon: FileText,
    path: '/payment-config/stakeholder-relaxations',
    adminTypes: ['NCAHP', 'SC'],
  },
  {
    id: 'relaxation-applications',
    label: 'Relaxation Applications',
    icon: ClipboardList,
    path: '/payment-config/relaxation-applications',
    adminTypes: ['NCAHP', 'SC'],
  },
];

interface ModuleLayoutProps {
  children: React.ReactNode;
  adminContext: AdminContext;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ModuleLayout({ children, adminContext, title, subtitle, actions }: ModuleLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item =>
    item.adminTypes.includes(adminContext.adminType)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <LayoutGrid className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-sm">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-foreground">Payment System</h1>
                <p className="text-xs text-muted-foreground">
                  {adminContext.adminType === 'NCAHP' ? 'NCAHP Commission' : adminContext.councilName}
                </p>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'hidden sm:flex items-center gap-1.5 px-3 py-1',
              adminContext.adminType === 'NCAHP'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-teal-200 bg-teal-50 text-teal-700'
            )}
          >
            <Shield className="h-3.5 w-3.5" />
            {adminContext.adminType === 'NCAHP' ? 'NCAHP Admin' : 'State Admin'}
          </Badge>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'sticky top-16 h-[calc(100vh-4rem)] border-r bg-white/50 backdrop-blur-sm transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end p-2 border-b">
              <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            <ScrollArea className="flex-1 py-3">
              <nav className="space-y-1 px-2">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
            {!collapsed && (
              <div className="border-t p-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Logged in as</p>
                  <p className="text-sm font-medium truncate">{adminContext.adminName}</p>
                  {adminContext.state && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {adminContext.state.stateName} ({adminContext.state.stateCode})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="border-b bg-white px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
