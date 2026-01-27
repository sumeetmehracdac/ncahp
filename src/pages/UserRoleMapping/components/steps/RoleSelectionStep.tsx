import { motion } from 'framer-motion';
import { UserCheck, Crown, Users, ClipboardCheck, Briefcase, GraduationCap, Wrench, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '../../types';

interface RoleSelectionStepProps {
  roles: Role[];
  selectedRoleId: string;
  onSelect: (roleId: string) => void;
}

export function RoleSelectionStep({ 
  roles, 
  selectedRoleId, 
  onSelect 
}: RoleSelectionStepProps) {
  
  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('chair')) return Crown;
    if (name.includes('member')) return Users;
    if (name.includes('secretary')) return Briefcase;
    if (name.includes('assessor')) return ClipboardCheck;
    if (name.includes('coordinator')) return Wrench;
    if (name.includes('academic') || name.includes('visitor')) return GraduationCap;
    if (name.includes('advisor')) return Eye;
    return UserCheck;
  };
  
  const getRoleColor = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('chair')) return 'from-amber-400 to-yellow-500';
    if (name.includes('vice')) return 'from-slate-400 to-gray-500';
    if (name.includes('secretary')) return 'from-blue-400 to-indigo-500';
    if (name.includes('assessor')) return 'from-emerald-400 to-green-500';
    if (name.includes('coordinator')) return 'from-violet-400 to-purple-500';
    if (name.includes('academic')) return 'from-cyan-400 to-teal-500';
    if (name.includes('advisor')) return 'from-rose-400 to-pink-500';
    return 'from-gray-400 to-slate-500';
  };
  
  const getRolePriority = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('chairperson') && !name.includes('vice')) return 1;
    if (name.includes('vice-chair')) return 2;
    if (name.includes('secretary')) return 3;
    if (name.includes('member') && !name.includes('secretary')) return 4;
    return 5;
  };
  
  const sortedRoles = [...roles].sort((a, b) => 
    getRolePriority(a.roleName) - getRolePriority(b.roleName)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
          <UserCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Select Role
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the role to assign within the selected committee
        </p>
      </div>
      
      {/* Role Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {sortedRoles.map((role, index) => {
          const isSelected = role.roleId === selectedRoleId;
          const Icon = getRoleIcon(role.roleName);
          const color = getRoleColor(role.roleName);
          const isChairperson = role.roleName.toLowerCase().includes('chair');
          
          return (
            <motion.button
              key={role.roleId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(role.roleId)}
              className={cn(
                "group relative p-5 rounded-2xl text-center transition-all duration-300",
                "border-2 hover:shadow-lg",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/15" 
                  : "border-border hover:border-primary/50 bg-card",
                isChairperson && "sm:col-span-2 lg:col-span-2"
              )}
            >
              {/* Gradient background on hover */}
              <div className={cn(
                "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                "bg-gradient-to-br",
                color,
                isSelected ? "opacity-10" : "group-hover:opacity-5"
              )} />
              
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
              
              {/* Icon */}
              <motion.div 
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center text-white mx-auto mb-4 bg-gradient-to-br shadow-lg",
                  color
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon className="w-8 h-8" />
              </motion.div>
              
              {/* Content */}
              <h3 className={cn(
                "font-semibold text-foreground mb-1",
                isChairperson ? "text-xl" : "text-base"
              )}>
                {role.roleName}
              </h3>
              
              {role.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {role.description}
                </p>
              )}
              
              {/* Leadership indicator */}
              {isChairperson && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  <Crown className="w-3 h-3" />
                  Leadership Role
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {roles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No roles available for the selected committee type</p>
        </div>
      )}
    </div>
  );
}
