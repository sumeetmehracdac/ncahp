import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  approvalRules as initialRules, roles, actions, committeeTypes,
  statuses, schemes,
} from '../data/mockData';

const ApprovalMaster = () => {
  const [rules] = useState(initialRules);
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    rules.filter((r) => {
      if (schemeFilter !== 'all' && r.scheme !== schemeFilter) return false;
      if (roleFilter !== 'all' && r.currentRoleId !== roleFilter) return false;
      if (search) {
        const action = actions.find((a) => a.id === r.actionId);
        const role = roles.find((rl) => rl.id === r.currentRoleId);
        const text = `${action?.name} ${role?.name}`.toLowerCase();
        if (!text.includes(search.toLowerCase())) return false;
      }
      return true;
    }),
    [rules, schemeFilter, roleFilter, search]
  );

  const getRole = (id: string) => roles.find((r) => r.id === id);
  const getAction = (id: string) => actions.find((a) => a.id === id);
  const getCT = (id: string) => committeeTypes.find((c) => c.id === id);
  const getStatus = (id: string) => statuses.find((s) => s.id === id);
  const getScheme = (id: string) => schemes.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">Approval Master</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Complete approval chain rules — roles, actions, conditions, and routing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl p-3.5 bg-primary/10 text-primary flex items-center gap-3">
          <p className="text-2xl font-bold">{rules.length}</p>
          <p className="text-xs opacity-80">Total Rules</p>
        </div>
        <div className="rounded-xl p-3.5 bg-emerald-500/10 text-emerald-700 flex items-center gap-3">
          <p className="text-2xl font-bold">{rules.filter((r) => r.active).length}</p>
          <p className="text-xs opacity-80">Active</p>
        </div>
        <div className="rounded-xl p-3.5 bg-accent/10 text-accent flex items-center gap-3">
          <p className="text-2xl font-bold">{new Set(rules.map((r) => r.scheme)).size}</p>
          <p className="text-xs opacity-80">Schemes</p>
        </div>
        <div className="rounded-xl p-3.5 bg-muted text-muted-foreground flex items-center gap-3">
          <p className="text-2xl font-bold">{new Set(rules.map((r) => r.currentRoleId)).size}</p>
          <p className="text-xs opacity-80">Roles Involved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-0 bg-muted/50 focus-visible:ring-primary/30"
          />
        </div>
        <Select value={schemeFilter} onValueChange={setSchemeFilter}>
          <SelectTrigger className="w-[220px] bg-muted/50 border-0">
            <SelectValue placeholder="Scheme" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Schemes</SelectItem>
            {schemes.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] bg-muted/50 border-0">
            <SelectValue placeholder="Current Role" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Roles</SelectItem>
            {roles.filter((r) => r.active).map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rule Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current Role</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Scheme</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">→</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Next Role</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Condition</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Resulting Status</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rule) => {
                const curRole = getRole(rule.currentRoleId);
                const nextRole = getRole(rule.nextRoleId);
                const action = getAction(rule.actionId);
                const curCT = getCT(rule.currentCommitteeTypeId);
                const nextCT = getCT(rule.nextCommitteeTypeId);
                const status = getStatus(rule.resultingStatusId);
                const scheme = getScheme(rule.scheme);

                return (
                  <TableRow key={rule.id} className="hover:bg-primary/[0.02] transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: curRole?.color }} />
                        <div>
                          <p className="text-sm font-medium">{curRole?.name}</p>
                          {curCT && curCT.id !== 'ct-none' && (
                            <p className="text-[10px] text-muted-foreground">{curCT.name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        {scheme?.name.split(' ').slice(0, 2).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{action?.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="w-4 h-4 text-primary/40 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nextRole?.color }} />
                        <div>
                          <p className="text-sm font-medium">{nextRole?.name}</p>
                          {nextCT && nextCT.id !== 'ct-none' && (
                            <p className="text-[10px] text-muted-foreground">{nextCT.name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        'text-[10px]',
                        rule.conditionLabel === 'No Condition'
                          ? 'text-muted-foreground'
                          : 'text-amber-700 border-amber-200 bg-amber-50'
                      )}>
                        {rule.conditionLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {status && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                          <span className="text-xs">{status.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {rule.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px]">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No rules match your filters</div>
        )}
      </div>
    </div>
  );
};

export default ApprovalMaster;
