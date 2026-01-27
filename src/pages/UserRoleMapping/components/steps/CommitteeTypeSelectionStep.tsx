import { motion } from 'framer-motion';
import { Layers, FileCheck, Award, GraduationCap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CommitteeType } from '../../types';

interface CommitteeTypeSelectionStepProps {
  committeeTypes: CommitteeType[];
  selectedCommitteeTypeId: string;
  onSelect: (committeeTypeId: string) => void;
}

export function CommitteeTypeSelectionStep({ 
  committeeTypes, 
  selectedCommitteeTypeId, 
  onSelect 
}: CommitteeTypeSelectionStepProps) {
  
  const getTypeIcon = (typeName: string) => {
    if (typeName.toLowerCase().includes('ethics')) return FileCheck;
    if (typeName.toLowerCase().includes('assessment')) return Award;
    if (typeName.toLowerCase().includes('undergraduate') || typeName.toLowerCase().includes('postgraduate')) return GraduationCap;
    if (typeName.toLowerCase().includes('disciplinary')) return AlertTriangle;
    return Layers;
  };
  
  const getTypeColor = (index: number) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-emerald-500 to-green-600',
      'from-blue-500 to-cyan-600',
      'from-amber-500 to-yellow-600',
      'from-rose-500 to-pink-600',
      'from-teal-500 to-emerald-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Select Committee Type
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the type of committee for this role assignment
        </p>
      </div>
      
      {/* Committee Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {committeeTypes.map((type, index) => {
          const isSelected = type.committeeTypeId === selectedCommitteeTypeId;
          const Icon = getTypeIcon(type.typeName);
          const color = getTypeColor(index);
          
          return (
            <motion.button
              key={type.committeeTypeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(type.committeeTypeId)}
              className={cn(
                "group relative p-6 rounded-2xl text-left transition-all duration-300",
                "border-2 hover:shadow-lg",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/15" 
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              {/* Gradient background on hover */}
              <div className={cn(
                "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                "bg-gradient-to-br",
                color,
                isSelected ? "opacity-5" : "group-hover:opacity-[0.03]"
              )} />
              
              {/* Selection indicator */}
              <motion.div 
                className={cn(
                  "absolute right-4 top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-border"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-primary-foreground"
                  />
                )}
              </motion.div>
              
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br shadow-lg",
                color
              )}>
                <Icon className="w-7 h-7" />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-lg text-foreground mb-2 pr-8">
                {type.typeName}
              </h3>
              
              {type.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {type.description}
                </p>
              )}
              
              {/* Stakeholder badge */}
              <div className="mt-4">
                <span className={cn(
                  "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full",
                  type.stakeholderType === 'NCAHP_HO' 
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-emerald-100 text-emerald-700"
                )}>
                  {type.stakeholderType === 'NCAHP_HO' ? 'National Level' : 'State Level'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {committeeTypes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No committee types available for the selected stakeholder</p>
        </div>
      )}
    </div>
  );
}
