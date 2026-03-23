import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  roles, actions, committeeTypes,
  roleActionPermissions as initialPerms,
} from '../data/mockData';
import { toast } from 'sonner';

const RoleActionPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>(initialPerms);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [search, setSearch] = useState('');

  const activeActions = useMemo(() =>
    actions.filter((a) => {
      if (!a.active) return false;
      if (processFilter !== 'all' && a.processName !== processFilter) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [processFilter, search]
  );

  const displayRoles = useMemo(() =>
    selectedRole === 'all' ? roles.filter((r) => r.active) : roles.filter((r) => r.id === selectedRole),
    [selectedRole]
  );

  const togglePermission = (roleId: string, actionId: string) => {
    setPermissions((prev) => {
      const current = prev[roleId] || [];
      const has = current.includes(actionId);
      return {
        ...prev,
        [roleId]: has ? current.filter((id) => id !== actionId) : [...current, actionId],
      };
    });
    toast.success('Permission updated');
  };

  const hasPermission = (roleId: string, actionId: string) =>
    (permissions[roleId] || []).includes(actionId);

  const totalPermissions = Object.values(permissions).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">Role–Action Permissions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure which actions each role is permitted to perform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3.5 bg-primary/10 text-primary flex items-center gap-3">
          <p className="text-2xl font-bold">{roles.filter((r) => r.active).length}</p>
          <p className="text-xs opacity-80">Roles</p>
        </div>
        <div className="rounded-xl p-3.5 bg-accent/10 text-accent flex items-center gap-3">
          <p className="text-2xl font-bold">{actions.filter((a) => a.active).length}</p>
          <p className="text-xs opacity-80">Actions</p>
        </div>
        <div className="rounded-xl p-3.5 bg-emerald-500/10 text-emerald-700 flex items-center gap-3">
          <p className="text-2xl font-bold">{totalPermissions}</p>
          <p className="text-xs opacity-80">Active Permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-0 bg-muted/50 focus-visible:ring-primary/30"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[200px] bg-muted/50 border-0">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Roles</SelectItem>
            {roles.filter((r) => r.active).map((r) => (
              <SelectItem key={r.id} value={r.id}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={processFilter} onValueChange={setProcessFilter}>
          <SelectTrigger className="w-[180px] bg-muted/50 border-0">
            <SelectValue placeholder="Process" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Processes</SelectItem>
            <SelectItem value="Registration">Registration</SelectItem>
            <SelectItem value="Certificate Issuance">Certificate Issuance</SelectItem>
            <SelectItem value="Renewal">Renewal</SelectItem>
            <SelectItem value="Disciplinary">Disciplinary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Permission Matrix */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Permission Matrix</h2>
            <span className="text-[10px] text-muted-foreground ml-auto">
              Click cells to toggle permissions
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sticky left-0 bg-card min-w-[180px]">
                  Role
                </th>
                {activeActions.map((action) => (
                  <th key={action.id} className="p-2 text-center min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-foreground leading-tight">
                        {action.name}
                      </span>
                      <Badge variant="outline" className="text-[8px] px-1 py-0">
                        {action.processName.slice(0, 3)}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRoles.map((role, rowIdx) => (
                <tr
                  key={role.id}
                  className={cn(
                    'border-b border-border/50 hover:bg-primary/[0.02] transition-colors',
                    rowIdx % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                  )}
                >
                  <td className="p-3 sticky left-0 bg-card">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                      <span className="text-sm font-medium text-foreground">{role.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({(permissions[role.id] || []).length})
                      </span>
                    </div>
                  </td>
                  {activeActions.map((action) => {
                    const has = hasPermission(role.id, action.id);
                    return (
                      <td key={action.id} className="p-2 text-center">
                        <button
                          onClick={() => togglePermission(role.id, action.id)}
                          className={cn(
                            'w-8 h-8 rounded-lg transition-all mx-auto flex items-center justify-center',
                            has
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'text-muted-foreground/30 hover:text-muted-foreground hover:bg-muted/50'
                          )}
                        >
                          {has ? (
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                              <CheckSquare className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-border bg-muted/20 flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-primary" /> Permitted
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-3.5 h-3.5 text-muted-foreground/30" /> Not Permitted
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleActionPermissions;
