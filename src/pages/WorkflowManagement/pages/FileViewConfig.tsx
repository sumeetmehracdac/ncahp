import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fileViewConfigs, actions } from '../data/mockData';

const FileViewConfig = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground font-display">File View Configuration</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Configure document view links and remark settings for each action</p>
    </div>
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Link Name</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Link</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">View Link</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Remarks</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Show Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fileViewConfigs.map((fvc) => {
            const action = actions.find((a) => a.id === fvc.actionId);
            return (
              <TableRow key={fvc.id} className="hover:bg-primary/[0.02]">
                <TableCell><Badge className="bg-primary/10 text-primary border-0 text-[10px]">{action?.name}</Badge></TableCell>
                <TableCell className="text-sm">{fvc.linkName}</TableCell>
                <TableCell><code className="text-xs text-muted-foreground font-mono">{fvc.link}</code></TableCell>
                <TableCell className="text-center"><Switch checked={fvc.viewLink} /></TableCell>
                <TableCell className="text-center"><Switch checked={fvc.remarks} /></TableCell>
                <TableCell className="text-center"><Switch checked={fvc.showRemarks} /></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default FileViewConfig;
