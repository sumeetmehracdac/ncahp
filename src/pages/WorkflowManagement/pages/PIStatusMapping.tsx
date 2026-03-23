import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { actions, piStatusMappings } from '../data/mockData';

const PIStatusMapping = () => {
  const [mappings] = useState(piStatusMappings);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">PI Status Mapping</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Map internal actions to applicant-facing status text</p>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Internal Action</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">PI Status Text</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((m) => {
              const action = actions.find((a) => a.id === m.actionId);
              return (
                <TableRow key={m.id} className="hover:bg-primary/[0.02]">
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{action?.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">{m.piStatusText}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.piStatusText.length} chars</p>
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
  );
};

export default PIStatusMapping;
