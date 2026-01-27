import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  shortTitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop view - horizontal */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
        
        {/* Active progress line */}
        <motion.div 
          className="absolute top-6 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || step.id <= currentStep;
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "relative z-10 flex flex-col items-center gap-3",
                isClickable && onStepClick ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              {/* Step circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted 
                    ? 'hsl(var(--primary))' 
                    : isCurrent 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--background))'
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors",
                  isCompleted 
                    ? "border-primary text-primary-foreground" 
                    : isCurrent 
                      ? "border-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "border-border text-muted-foreground bg-background"
                )}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {step.id}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Step label */}
              <div className="text-center">
                <motion.p 
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                  animate={{ opacity: 1 }}
                >
                  {step.shortTitle}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile view - compact pills */}
      <div className="md:hidden">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <motion.button
                key={step.id}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  isCurrent 
                    ? "bg-primary text-primary-foreground" 
                    : isCompleted 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                )}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                    {step.id}
                  </span>
                )}
                {step.shortTitle}
              </motion.button>
            );
          })}
        </div>
        
        {/* Progress bar for mobile */}
        <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
