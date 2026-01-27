import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Building2, 
  Layers, 
  Building, 
  UserCheck, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User as UserType, Stakeholder, CommitteeType, Committee, Role } from '../types';

interface FlowSummaryProps {
  user?: UserType;
  stakeholder?: Stakeholder;
  committeeType?: CommitteeType;
  committee?: Committee;
  role?: Role;
  isComplete: boolean;
}

export function FlowSummary({
  user,
  stakeholder,
  committeeType,
  committee,
  role,
  isComplete
}: FlowSummaryProps) {
  const steps = [
    { icon: User, label: 'User', value: user?.fullName, active: !!user },
    { icon: Building2, label: 'Stakeholder', value: stakeholder?.name?.split(' ')[0], active: !!stakeholder },
    { icon: Layers, label: 'Type', value: committeeType?.typeName?.split(' ')[0], active: !!committeeType },
    { icon: Building, label: 'Committee', value: committee?.committeeName?.split(' ').slice(0, 2).join(' '), active: !!committee },
    { icon: UserCheck, label: 'Role', value: role?.roleName, active: !!role },
  ];
  
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
            step.active 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "bg-muted/50 text-muted-foreground border border-transparent"
          )}>
            <step.icon className="w-3.5 h-3.5" />
            <span className="font-medium">
              {step.value || step.label}
            </span>
            {step.active && (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            )}
          </div>
          
          {index < steps.length - 1 && (
            <ArrowRight className={cn(
              "w-4 h-4 flex-shrink-0 transition-colors",
              step.active ? "text-primary" : "text-muted-foreground/30"
            )} />
          )}
        </motion.div>
      ))}
      
      {/* Complete indicator */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Ready</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
