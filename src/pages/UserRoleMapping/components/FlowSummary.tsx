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
  roles?: Role[]; // Changed to array for multi-role support
  isComplete: boolean;
}

export function FlowSummary({
  user,
  stakeholder,
  committeeType,
  committee,
  roles = [],
  isComplete
}: FlowSummaryProps) {
  // Get display text for roles
  const rolesDisplay = roles.length > 0
    ? roles.length === 1
      ? roles[0].roleName
      : `${roles.length} Roles`
    : 'Role';

  const steps = [
    { icon: User, label: 'User', value: user?.fullName, active: !!user },
    { icon: Building2, label: 'Stakeholder', value: stakeholder?.name, active: !!stakeholder },
    { icon: Layers, label: 'Type', value: committeeType?.typeName?.split(' ')[0], active: !!committeeType },
    { icon: Building, label: 'Committee', value: committee?.committeeName?.split(' ').slice(0, 2).join(' '), active: !!committee },
    { icon: UserCheck, label: 'Role', value: rolesDisplay, active: roles.length > 0 },
  ];

  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
            step.active
              ? "bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-sm"
              : "bg-white/10 text-white/60 border border-white/10"
          )}>
            <step.icon className={cn("w-4 h-4", step.active ? "text-white" : "text-white/60")} />
            <span className="font-medium">
              {step.value || step.label}
            </span>
            {step.active && (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            )}
          </div>

          {index < steps.length - 1 && (
            <ArrowRight className={cn(
              "w-4 h-4 flex-shrink-0 transition-colors",
              step.active ? "text-white/80" : "text-white/30"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white border border-emerald-400 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Ready</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
