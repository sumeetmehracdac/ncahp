import { motion } from 'framer-motion';
import { CheckCircle2, PartyPopper, ArrowRight, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User, Stakeholder, Committee, Role } from '../../types';

interface SuccessScreenProps {
  user?: User;
  committee?: Committee;
  role?: Role;
  onCreateAnother: () => void;
  onViewMappings: () => void;
}

export function SuccessScreen({
  user,
  committee,
  role,
  onCreateAnother,
  onViewMappings
}: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="relative inline-block mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        
        {/* Confetti effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-2 -right-2"
        >
          <PartyPopper className="w-8 h-8 text-amber-500" />
        </motion.div>
      </motion.div>
      
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-serif font-bold text-foreground mb-3"
      >
        Assignment Created!
      </motion.h2>
      
      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md mx-auto mb-8"
      >
        <strong className="text-foreground">{user?.fullName}</strong> has been successfully 
        assigned as <strong className="text-foreground">{role?.roleName}</strong> to{' '}
        <strong className="text-foreground">{committee?.committeeName}</strong>.
      </motion.p>
      
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 mb-8"
      >
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-700">User</span>
            <span className="font-medium text-emerald-900">{user?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-700">Role</span>
            <span className="font-medium text-emerald-900">{role?.roleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-700">Committee</span>
            <span className="font-medium text-emerald-900 text-right max-w-[200px] truncate">
              {committee?.committeeName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-700">Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onViewMappings}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          View All Mappings
        </Button>
        
        <Button
          size="lg"
          onClick={onCreateAnother}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Another Assignment
        </Button>
      </motion.div>
    </motion.div>
  );
}
