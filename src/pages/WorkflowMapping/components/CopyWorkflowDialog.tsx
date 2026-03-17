import { useState, useMemo } from 'react';
import { Copy, Search, AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflowStore } from '../store/workflowStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAppTypeId: string;
}

const CopyWorkflowDialog = ({ open, onOpenChange, sourceAppTypeId }: Props) => {
  const { applicationTypes, workflows, copyWorkflow } = useWorkflowStore();
  const [mode, setMode] = useState<'all' | 'selected'>('selected');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const sourceWf = workflows.find((w) => w.applicationTypeId === sourceAppTypeId);
  const sourceAt = applicationTypes.find((at) => at.id === sourceAppTypeId);

  const targets = useMemo(
    () =>
      applicationTypes
        .filter((at) => at.id !== sourceAppTypeId)
        .filter(
          (at) =>
            !search || at.name.toLowerCase().includes(search.toLowerCase())
        ),
    [applicationTypes, sourceAppTypeId, search]
  );

  const targetIds =
    mode === 'all'
      ? applicationTypes
          .filter((at) => at.id !== sourceAppTypeId)
          .map((at) => at.id)
      : Array.from(selectedIds);

  const conflictCount = targetIds.filter((id) => {
    const at = applicationTypes.find((a) => a.id === id);
    return at?.workflowStatus !== 'none';
  }).length;

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleCopy = () => {
    copyWorkflow(sourceAppTypeId, targetIds);
    toast.success(`Workflow copied to ${targetIds.length} application type(s)`);
    setSelectedIds(new Set());
    setSearch('');
    onOpenChange(false);
  };

  if (!sourceWf || !sourceAt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Copy className="w-4 h-4 text-primary" /> Copy Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source info */}
          <div className="rounded-xl bg-muted/40 p-3.5">
            <p className="text-sm font-medium text-foreground">{sourceAt.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sourceWf.steps.length} steps · v{sourceWf.version} · {sourceWf.status}
            </p>
          </div>

          {/* Mode */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                value: 'all' as const,
                label: 'All types',
                desc: `${applicationTypes.length - 1} targets`,
              },
              {
                value: 'selected' as const,
                label: 'Select specific',
                desc: 'Choose targets',
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  mode === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/20'
                )}
              >
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>

          {/* Target list */}
          {mode === 'selected' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search application types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="max-h-[220px] overflow-y-auto rounded-xl border border-border divide-y divide-border">
                {targets.map((at) => (
                  <label
                    key={at.id}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-muted/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedIds.has(at.id)}
                      onCheckedChange={() => toggle(at.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{at.name}</p>
                    </div>
                    {at.workflowStatus !== 'none' && (
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        {at.workflowStatus}
                      </Badge>
                    )}
                  </label>
                ))}
                {targets.length === 0 && (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No matching application types
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {selectedIds.size} selected
              </p>
            </>
          )}

          {/* Warning */}
          {conflictCount > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-700 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                {conflictCount} target(s) already have workflows that will be
                overwritten
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCopy}
              disabled={targetIds.length === 0}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy to {targetIds.length} type{targetIds.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyWorkflowDialog;
