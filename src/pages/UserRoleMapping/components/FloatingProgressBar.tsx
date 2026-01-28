import { motion, AnimatePresence } from 'framer-motion';
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

export function FloatingProgressBar({ steps, progress, className, isSuccess = false }: FloatingProgressBarProps & { isSuccess?: boolean }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={cn(
        "sticky top-6 z-50 mx-auto",
        className
      )}
    >
      {/* The Glass Capsule */}
      <div className="relative group flex justify-center">
        {/* Glow effect */}
        <div className={cn(
          "absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-xl transition-opacity duration-700",
          isSuccess ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />

        {/* Glass Background */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={cn(
            "relative bg-white/70 dark:bg-card/70 backdrop-blur-2xl rounded-full border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden",
            isSuccess ? "w-16 h-16 flex items-center justify-center p-0" : "w-full max-w-3xl px-6 py-3"
          )}
        >
          <AnimatePresence>
            {!isSuccess ? (
              <motion.div
                key="steps"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between gap-6 w-full min-w-[40rem]" // Added min-w to prevent squishing during shrink
              >
                {/* Steps Container */}
                <div className="flex-1 flex items-center justify-between gap-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                      <div key={step.id} className="flex items-center flex-1 min-w-0">
                        {/* Step Node */}
                        <div className="relative flex flex-col items-center group/node cursor-default">
                          <motion.div
                            animate={{
                              scale: step.isActive ? 1.15 : 1,
                            }}
                            className={cn(
                              "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                              step.isComplete
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : step.isActive
                                  ? "bg-white text-primary ring-2 ring-primary shadow-lg shadow-primary/20"
                                  : "bg-black/5 text-muted-foreground hover:bg-black/10"
                            )}
                          >
                            {step.isComplete ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                              >
                                <Check className="w-5 h-5" strokeWidth={3} />
                              </motion.div>
                            ) : (
                              <Icon className={cn("w-5 h-5", step.isActive && "stroke-[2.5px]")} />
                            )}

                            {/* Tooltip Label */}
                            <div className={cn(
                              "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap",
                              (step.isActive || "group-hover/node:opacity-100")
                            )}>
                              {step.label}
                              {/* Little triangle pointer */}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                            </div>
                          </motion.div>
                        </div>

                        {/* Connector Line */}
                        {!isLast && (
                          <div className="flex-1 mx-2 h-[2px] bg-black/5 rounded-full overflow-hidden relative">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_var(--primary)]"
                              initial={{ width: '0%' }}
                              animate={{ width: step.isComplete ? '100%' : '0%' }}
                              transition={{ duration: 0.5, ease: "circOut" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress Circle Only */}
                <div className="pl-4 ml-2 border-l border-black/5 dark:border-white/10">
                  <div className="relative">
                    <ProgressRing
                      progress={progress.percentage}
                      size={40}
                      strokeWidth={4}
                      className="text-primary drop-shadow-sm"
                    />
                    {progress.percentage === 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-primary rounded-full text-white"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: 0.1 // Reduced delay so it appears sooner as the circle closes
                }}
                className="absolute inset-0 flex items-center justify-center text-primary" // Absolute positioning to center it perfectly in the small circle
              >
                <Check className="w-8 h-8" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
