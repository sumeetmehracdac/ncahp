import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, GripVertical, X, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  roles as initialRoles,
  committeeTypes as initialCTs,
  roleCommitteeMappings as initialMappings,
} from '../data/mockData';
import { toast } from 'sonner';

const RolesCommitteeTypes = () => {
  const [roles] = useState(initialRoles);
  const [committeeTypes] = useState(initialCTs);
  const [mappings, setMappings] = useState(initialMappings);
  const [search, setSearch] = useState('');

  const toggleMapping = (roleId: string, ctId: string) => {
    const existing = mappings.find((m) => m.roleId === roleId && m.committeeTypeId === ctId);
    if (existing) {
      if (existing.active) {
        setMappings((prev) => prev.map((m) => m.id === existing.id ? { ...m, active: false } : m));
      } else {
        setMappings((prev) => prev.map((m) => m.id === existing.id ? { ...m, active: true } : m));
      }
    } else {
      setMappings((prev) => [...prev, {
        id: `rcm-${Date.now()}`,
        roleId,
        committeeTypeId: ctId,
        active: true,
      }]);
    }
    toast.success('Mapping updated');
  };

  const getMappingState = (roleId: string, ctId: string) => {
    const m = mappings.find((m) => m.roleId === roleId && m.committeeTypeId === ctId);
    if (!m) return 'none';
    return m.active ? 'active' : 'inactive';
  };

  const filteredRoles = useMemo(() =>
    roles.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  const activeCTs = committeeTypes.filter((ct) => ct.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">Roles & Committee Types</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Define role–committee combinations for workflow routing
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{roles.length}</p>
              <p className="text-xs text-muted-foreground">Roles</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <div
                key={r.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: r.color + '15', color: r.color }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                {r.name}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{committeeTypes.length}</p>
              <p className="text-xs text-muted-foreground">Committee Types</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {committeeTypes.map((ct) => (
              <Badge key={ct.id} variant="outline" className="text-[10px]">{ct.name}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Mapping Matrix */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground flex-1">Role–Committee Mapping Matrix</h2>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs border-0 bg-muted/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[200px] sticky left-0 bg-muted/30">
                  Role
                </TableHead>
                {activeCTs.map((ct) => (
                  <TableHead key={ct.id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center min-w-[120px]">
                    {ct.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-primary/[0.02]">
                  <TableCell className="sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                      <span className="text-sm font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  {activeCTs.map((ct) => {
                    const state = getMappingState(role.id, ct.id);
                    return (
                      <TableCell key={ct.id} className="text-center">
                        <button
                          onClick={() => toggleMapping(role.id, ct.id)}
                          className={cn(
                            'w-8 h-8 rounded-lg border-2 transition-all mx-auto flex items-center justify-center',
                            state === 'active'
                              ? 'bg-primary/10 border-primary text-primary'
                              : state === 'inactive'
                              ? 'bg-muted/50 border-border text-muted-foreground'
                              : 'bg-transparent border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5'
                          )}
                        >
                          {state === 'active' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 rounded-sm bg-primary"
                            />
                          )}
                          {state === 'inactive' && (
                            <X className="w-3 h-3" />
                          )}
                        </button>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 border-t border-border bg-muted/20 flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            Active mapping
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-border bg-muted/50 flex items-center justify-center">
              <X className="w-2 h-2 text-muted-foreground" />
            </div>
            Inactive
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-dashed border-border/50" />
            No mapping
          </div>
        </div>
      </div>

      {/* Active Mappings Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Active Mappings
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({mappings.filter((m) => m.active).length})
            </span>
          </h2>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Committee Type</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.filter((m) => m.active).map((m) => {
                const role = roles.find((r) => r.id === m.roleId);
                const ct = committeeTypes.find((c) => c.id === m.committeeTypeId);
                return (
                  <TableRow key={m.id} className="hover:bg-primary/[0.02]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role?.color }} />
                        <span className="text-sm">{role?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{ct?.name}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RolesCommitteeTypes;
