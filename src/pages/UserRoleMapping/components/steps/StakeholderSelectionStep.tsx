import { motion } from 'framer-motion';
import { Building2, Globe, MapPin, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stakeholder } from '../../types';

interface StakeholderSelectionStepProps {
  stakeholders: Stakeholder[];
  selectedStakeholderId: string;
  onSelect: (stakeholderId: string) => void;
}

export function StakeholderSelectionStep({ 
  stakeholders, 
  selectedStakeholderId, 
  onSelect 
}: StakeholderSelectionStepProps) {
  
  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'NCAHP_HO': return Globe;
      case 'STATE_COUNCIL': return MapPin;
      case 'EXTERNAL': return Building2;
      default: return Users;
    }
  };
  
  const getStakeholderColor = (type: string) => {
    switch (type) {
      case 'NCAHP_HO': return 'from-blue-500 to-indigo-600';
      case 'STATE_COUNCIL': return 'from-emerald-500 to-teal-600';
      case 'EXTERNAL': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };
  
  const getStakeholderLabel = (type: string) => {
    switch (type) {
      case 'NCAHP_HO': return 'National Level';
      case 'STATE_COUNCIL': return 'State Level';
      case 'EXTERNAL': return 'External';
      default: return type;
    }
  };

  // Group stakeholders by type
  const groupedStakeholders = stakeholders.reduce((acc, stakeholder) => {
    const type = stakeholder.stakeholderType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(stakeholder);
    return acc;
  }, {} as Record<string, Stakeholder[]>);

  const typeOrder = ['NCAHP_HO', 'STATE_COUNCIL', 'EXTERNAL'];
  const sortedTypes = Object.keys(groupedStakeholders).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Select Stakeholder Level
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the organizational level for this role assignment
        </p>
      </div>
      
      {/* Stakeholder Groups */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {sortedTypes.map((type, groupIndex) => {
          const Icon = getStakeholderIcon(type);
          const color = getStakeholderColor(type);
          
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br",
                  color
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-foreground">
                  {getStakeholderLabel(type)}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {groupedStakeholders[type].length}
                </span>
              </div>
              
              {/* Stakeholder Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groupedStakeholders[type].map((stakeholder, index) => {
                  const isSelected = stakeholder.stakeholderId === selectedStakeholderId;
                  
                  return (
                    <motion.button
                      key={stakeholder.stakeholderId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: groupIndex * 0.1 + index * 0.03 }}
                      onClick={() => onSelect(stakeholder.stakeholderId)}
                      className={cn(
                        "relative p-4 rounded-xl text-left transition-all duration-200",
                        "border-2 hover:shadow-md",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      {/* Selection indicator */}
                      <motion.div 
                        className={cn(
                          "absolute right-3 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected ? "border-primary bg-primary" : "border-border"
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-primary-foreground"
                          />
                        )}
                      </motion.div>
                      
                      <h4 className="font-medium text-foreground pr-8 mb-1">
                        {stakeholder.name}
                      </h4>
                      
                      {stakeholder.state && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{stakeholder.state.stateName}</span>
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {stakeholder.state.stateCode}
                          </span>
                        </div>
                      )}
                      
                      {type === 'NCAHP_HO' && (
                        <div className="flex items-center gap-1.5 text-sm text-blue-600 mt-1">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Full access to all states</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
