import { motion } from 'framer-motion';
import { Search, Building, MapPin, AlertCircle, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Committee, CurrentUserContext } from '../../types';
import { useState, useMemo } from 'react';

interface CommitteeSelectionStepProps {
  committees: Committee[];
  selectedCommitteeId: string;
  onSelect: (committeeId: string) => void;
  currentUserContext: CurrentUserContext;
}

export function CommitteeSelectionStep({
  committees,
  selectedCommitteeId,
  onSelect,
  currentUserContext
}: CommitteeSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommittees = useMemo(() => {
    if (!searchQuery.trim()) return committees;
    const query = searchQuery.toLowerCase();
    return committees.filter(committee =>
      committee.committeeName.toLowerCase().includes(query) ||
      committee.state?.stateName.toLowerCase().includes(query) ||
      committee.state?.stateCode.toLowerCase().includes(query)
    );
  }, [committees, searchQuery]);

  // Group committees by state
  const groupedCommittees = useMemo(() => {
    const groups: Record<string, Committee[]> = {};

    // First add national committees
    const nationalCommittees = filteredCommittees.filter(c => !c.state);
    if (nationalCommittees.length > 0) {
      groups['NATIONAL'] = nationalCommittees;
    }

    // Then add state committees
    filteredCommittees.filter(c => c.state).forEach(committee => {
      const stateKey = committee.state!.stateName;
      if (!groups[stateKey]) groups[stateKey] = [];
      groups[stateKey].push(committee);
    });

    return groups;
  }, [filteredCommittees]);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
          <Building className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Select Committee
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the specific committee for this role assignment
        </p>
      </div>

      {/* State filtering notice */}


      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search committees or states..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary bg-background"
        />
      </div>

      {/* Committee List */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {Object.entries(groupedCommittees).map(([groupName, groupCommittees], groupIndex) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                {groupName === 'NATIONAL' ? (
                  <>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-foreground">National Level</h3>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-emerald-500 to-teal-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-foreground">{groupName}</h3>
                  </>
                )}
                <Badge variant="secondary" className="text-xs">
                  {groupCommittees.length}
                </Badge>
              </div>

              {/* Committee Cards */}
              <div className="space-y-2">
                {groupCommittees.map((committee, index) => {
                  const isSelected = committee.committeeId === selectedCommitteeId;

                  return (
                    <motion.button
                      key={committee.committeeId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIndex * 0.1 + index * 0.03 }}
                      onClick={() => onSelect(committee.committeeId)}
                      className={cn(
                        "w-full relative p-4 rounded-xl text-left transition-all duration-200",
                        "border-2 hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      {/* Selection indicator */}
                      <motion.div
                        className={cn(
                          "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
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

                      <div className="pr-10">
                        <h4 className="font-medium text-foreground">
                          {committee.committeeName}
                        </h4>

                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-xs font-normal">
                            {committee.committeeType.typeName}
                          </Badge>

                          {committee.state && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {committee.state.stateCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCommittees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No committees available</p>
            <p className="text-sm mt-1">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No committees match the selected criteria"
              }
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
