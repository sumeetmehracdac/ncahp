import { motion } from 'framer-motion';
import { Check, Users, Building2, Layers, Building, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressRing } from './ProgressRing';

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
  isComplete: boolean;
  isActive: boolean;
}

interface FloatingProgressBarProps {
  steps: Step[];
  progress: { completed: number; total: number; percentage: number };
  className?: string;
}

export function FloatingProgressBar({ steps, progress, className }: FloatingProgressBarProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={cn(
        "sticky top-4 z-50 mx-auto max-w-4xl",
        className
      )}
    >
      <div className="relative">
        {/* Glassmorphism container */}
        <div className="absolute inset-0 bg-white/70 dark:bg-card/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/50 dark:border-white/10" />
        
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Steps */}
            <div className="flex-1 flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    {/* Step indicator */}
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{
                          scale: step.isActive ? 1.1 : 1,
                        }}
                        className={cn(
                          "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                          step.isComplete
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : step.isActive
                              ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {step.isComplete ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                        
                        {/* Active pulse ring */}
                        {step.isActive && !step.isComplete && (
                          <motion.div
                            className="absolute inset-0 rounded-xl ring-2 ring-primary/40"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      
                      {/* Label - hidden on small screens */}
                      <span className={cn(
                        "hidden lg:block text-xs font-medium whitespace-nowrap transition-colors",
                        step.isComplete
                          ? "text-primary"
                          : step.isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    
                    {/* Connector line */}
                    {!isLast && (
                      <div className="flex-1 mx-2 lg:mx-3">
                        <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{ width: step.isComplete ? '100%' : '0%' }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Progress Ring */}
            <div className="pl-4 border-l border-border/50">
              <div className="flex items-center gap-3">
                <ProgressRing 
                  progress={progress.percentage} 
                  size={44} 
                  strokeWidth={3.5}
                  className="text-primary"
                />
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-foreground">
                    {progress.completed}/{progress.total}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper to create steps config from form data
export function createStepsConfig(formData: {
  userId: string;
  stakeholderId: string;
  committeeTypeId: string;
  committeeId: string;
  roleIds: string[];
}) {
  return [
    {
      id: 1,
      label: 'User',
      icon: Users,
      isComplete: !!formData.userId,
      isActive: !formData.userId,
    },
    {
      id: 2,
      label: 'Stakeholder',
      icon: Building2,
      isComplete: !!formData.stakeholderId,
      isActive: !!formData.userId && !formData.stakeholderId,
    },
    {
      id: 3,
      label: 'Type',
      icon: Layers,
      isComplete: !!formData.committeeTypeId,
      isActive: !!formData.stakeholderId && !formData.committeeTypeId,
    },
    {
      id: 4,
      label: 'Committee',
      icon: Building,
      isComplete: !!formData.committeeId,
      isActive: !!formData.committeeTypeId && !formData.committeeId,
    },
    {
      id: 5,
      label: 'Role',
      icon: UserCheck,
      isComplete: formData.roleIds.length > 0,
      isActive: !!formData.committeeId && formData.roleIds.length === 0,
    },
  ];
}
