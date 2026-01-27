import { motion } from 'framer-motion';
import { Search, User, Mail, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { User as UserType } from '../../types';
import { useState, useMemo } from 'react';

interface UserSelectionStepProps {
  users: UserType[];
  selectedUserId: string;
  onSelect: (userId: string) => void;
}

export function UserSelectionStep({ users, selectedUserId, onSelect }: UserSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  // Generate consistent color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 
      'bg-violet-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Select User
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the user who will be assigned a role in a committee
        </p>
      </div>
      
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary bg-background"
        />
      </div>
      
      {/* User Grid */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredUsers.map((user, index) => {
            const isSelected = user.userId === selectedUserId;
            
            return (
              <motion.button
                key={user.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                onClick={() => onSelect(user.userId)}
                className={cn(
                  "group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200",
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
                  animate={{ scale: isSelected ? 1 : 0.9 }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary-foreground"
                    />
                  )}
                </motion.div>
                
                {/* Avatar */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                  getAvatarColor(user.fullName)
                )}>
                  {getInitials(user.fullName)}
                </div>
                
                {/* User info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate pr-6">
                    {user.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No users found matching "{searchQuery}"</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
