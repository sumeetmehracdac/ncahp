import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  User, 
  Building2, 
  Layers, 
  Building, 
  UserCheck,
  MapPin,
  Calendar,
  Edit3,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { User as UserType, Stakeholder, CommitteeType, Committee, Role } from '../../types';

interface ReviewStepProps {
  user?: UserType;
  stakeholder?: Stakeholder;
  committeeType?: CommitteeType;
  committee?: Committee;
  role?: Role;
  validFrom: string;
  validUntil: string;
  onValidFromChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
  onEditStep: (step: number) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function ReviewStep({
  user,
  stakeholder,
  committeeType,
  committee,
  role,
  validFrom,
  validUntil,
  onValidFromChange,
  onValidUntilChange,
  onEditStep,
  isSubmitting,
  onSubmit
}: ReviewStepProps) {
  
  const reviewItems = [
    { 
      step: 1, 
      icon: User, 
      label: 'User', 
      value: user?.fullName || '-',
      subValue: user?.email,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      step: 2, 
      icon: Building2, 
      label: 'Stakeholder', 
      value: stakeholder?.name || '-',
      subValue: stakeholder?.state?.stateName,
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      step: 3, 
      icon: Layers, 
      label: 'Committee Type', 
      value: committeeType?.typeName || '-',
      subValue: committeeType?.stakeholderType === 'NCAHP_HO' ? 'National Level' : 'State Level',
      color: 'from-violet-500 to-purple-600'
    },
    { 
      step: 4, 
      icon: Building, 
      label: 'Committee', 
      value: committee?.committeeName || '-',
      subValue: committee?.state?.stateName,
      color: 'from-amber-500 to-orange-600'
    },
    { 
      step: 5, 
      icon: UserCheck, 
      label: 'Role', 
      value: role?.roleName || '-',
      subValue: role?.description,
      color: 'from-rose-500 to-pink-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Review & Confirm
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please review the assignment details before confirming
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="max-w-3xl mx-auto space-y-4">
        {reviewItems.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/30 transition-colors"
          >
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg",
              item.color
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="font-semibold text-foreground truncate">
                {item.value}
              </p>
              {item.subValue && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  {item.step === 4 && item.subValue && <MapPin className="w-3 h-3" />}
                  {item.subValue}
                </p>
              )}
            </div>
            
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(item.step)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </motion.div>
        ))}
      </div>
      
      <Separator className="max-w-3xl mx-auto" />
      
      {/* Validity Period */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Validity Period</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border">
          <div className="space-y-2">
            <Label htmlFor="validFrom">Valid From *</Label>
            <Input
              id="validFrom"
              type="date"
              value={validFrom}
              onChange={(e) => onValidFromChange(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until (Optional)</Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => onValidUntilChange(e.target.value)}
              min={validFrom}
              className="bg-background"
              placeholder="Leave empty for indefinite"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for indefinite validity
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center pt-4"
      >
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-2 px-8 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Creating Assignment...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirm & Create Assignment
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
