import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  id: string;
  number: number;
  title: string;
  tagline: string;
  icon: ReactNode;
  isCompleted?: boolean;
  hasErrors?: boolean;
  children: ReactNode;
  className?: string;
}

const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ id, number, title, tagline, icon, isCompleted, hasErrors, children, className }, ref) => {
    return (
      <motion.section
        ref={ref}
        id={id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative bg-card rounded-2xl border border-border shadow-card overflow-hidden",
          "hover:shadow-card-hover transition-shadow duration-300",
          isCompleted && "ring-2 ring-success/20",
          hasErrors && "ring-2 ring-destructive/20",
          className
        )}
      >
        {/* Section Header */}
        <div className="relative bg-gradient-to-r from-muted/80 to-muted/40 border-b border-border px-6 py-5">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative flex items-start gap-4">
            {/* Section Number Badge */}
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg",
              isCompleted 
                ? "bg-success text-success-foreground" 
                : hasErrors 
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : hasErrors ? (
                <AlertCircle className="w-6 h-6" />
              ) : (
                number
              )}
            </div>
            
            {/* Title & Icon */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary">{icon}</span>
                <h2 className="text-xl font-display font-semibold text-foreground truncate">
                  {title}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tagline}
              </p>
            </div>
            
            {/* Status Indicator */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex-shrink-0 px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full"
              >
                Completed
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Section Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.section>
    );
  }
);

SectionCard.displayName = 'SectionCard';

export default SectionCard;
