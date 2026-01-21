import { motion } from 'framer-motion';
import { 
  User, GraduationCap, Stethoscope, ClipboardList, Briefcase, 
  MapPin, Upload, Shield, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sectionConfigs } from '../types';
import { useState } from 'react';

interface ProgressSidebarProps {
  activeSection: string;
  completedSections: number[];
  onNavigate: (sectionKey: string) => void;
  progress: number;
}

const iconMap: Record<string, React.ElementType> = {
  User,
  GraduationCap,
  Stethoscope,
  ClipboardList,
  Briefcase,
  MapPin,
  Upload,
  Shield,
  CheckCircle,
};

export default function ProgressSidebar({ 
  activeSection, 
  completedSections, 
  onNavigate,
  progress 
}: ProgressSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate circumference for progress ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 w-64">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-elegant p-4"
        >
          {/* Progress Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-display font-bold text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Section Navigation */}
          <nav className="space-y-1">
            {sectionConfigs.map((section) => {
              const Icon = iconMap[section.icon];
              const isActive = activeSection === section.key;
              const isCompleted = completedSections.includes(section.id);
              
              return (
                <button
                  key={section.key}
                  onClick={() => onNavigate(section.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    "hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive && "bg-primary/10 text-primary",
                    !isActive && "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                    isCompleted 
                      ? "bg-success text-success-foreground" 
                      : isActive 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      Icon && <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium truncate",
                    isActive && "text-primary font-semibold"
                  )}>
                    {section.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </motion.div>
      </aside>

      {/* Mobile Floating Progress */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <div className="relative">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="18"
                stroke="hsl(var(--primary-foreground) / 0.3)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="25"
                cy="25"
                r="18"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 - (progress / 100) * 2 * Math.PI * 18}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.button>
        
        {/* Mobile Section Selector */}
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-72 bg-card rounded-xl border border-border shadow-xl p-3 max-h-80 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-medium text-foreground">Jump to Section</span>
              <button onClick={() => setIsCollapsed(false)} className="p-1 hover:bg-muted rounded">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <nav className="space-y-1">
              {sectionConfigs.map((section) => {
                const Icon = iconMap[section.icon];
                const isActive = activeSection === section.key;
                const isCompleted = completedSections.includes(section.id);
                
                return (
                  <button
                    key={section.key}
                    onClick={() => {
                      onNavigate(section.key);
                      setIsCollapsed(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all",
                      isActive && "bg-primary/10 text-primary",
                      !isActive && "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center text-xs",
                      isCompleted ? "bg-success text-success-foreground" : "bg-muted"
                    )}>
                      {isCompleted ? <CheckCircle className="w-3 h-3" /> : section.id}
                    </div>
                    <span className="text-sm truncate">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </div>
    </>
  );
}
