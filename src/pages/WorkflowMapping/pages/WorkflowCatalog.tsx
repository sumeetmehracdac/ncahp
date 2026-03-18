import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, GitBranch, Copy, ArrowRight, LayoutGrid, Workflow, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useWorkflowStore } from '../store/workflowStore';
import CopyWorkflowDialog from '../components/CopyWorkflowDialog';
import { cn } from '@/lib/utils';

const WorkflowCatalog = () => {
  const { applicationTypes, workflows } = useWorkflowStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copySource, setCopySource] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(applicationTypes.map((at) => at.category))],
    [applicationTypes]
  );

  const filtered = useMemo(() => {
    return applicationTypes.filter((at) => {
      if (search && !at.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && at.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && at.workflowStatus !== statusFilter) return false;
      return true;
    });
  }, [applicationTypes, search, categoryFilter, statusFilter]);

  const total = applicationTypes.length;
  const configured = applicationTypes.filter((at) => at.workflowStatus !== 'none').length;
  const published = applicationTypes.filter((at) => at.workflowStatus === 'published').length;

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Hero Header with teal gradient */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">
                Workflow Mapping
              </h1>
              <p className="text-sm text-primary-foreground/70 mt-0.5">
                Design processing pipelines for each application type
              </p>
            </div>
          </div>

          {/* Stats row inside hero */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Application Types', value: total, icon: Workflow, bg: 'bg-white/10' },
              { label: 'Configured', value: configured, icon: Clock, bg: 'bg-accent/20' },
              { label: 'Published', value: published, icon: CheckCircle2, bg: 'bg-emerald-400/20' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl p-4 backdrop-blur-sm ring-1 ring-white/10 transition-all hover:ring-white/25',
                  stat.bg
                )}
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-5 h-5 text-primary-foreground/60" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-primary-foreground/60">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 bg-card rounded-xl p-3 border border-border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search application types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-0 bg-muted/50 focus-visible:ring-primary/30"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-muted/50 border-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-muted/50 border-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="none">No Workflow</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((at, i) => {
            const wf = workflows.find((w) => w.applicationTypeId === at.id);
            return (
              <motion.div
                key={at.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
              >
                {/* Top accent bar */}
                <div className={cn(
                  'h-1',
                  at.workflowStatus === 'published' && 'bg-emerald-500',
                  at.workflowStatus === 'draft' && 'bg-accent',
                  at.workflowStatus === 'none' && 'bg-border'
                )} />

                <div className="p-5">
                  {/* Status badge top-right */}
                  <div className="absolute top-5 right-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] uppercase tracking-wider font-semibold',
                        at.workflowStatus === 'published' && 'text-emerald-700 border-emerald-300 bg-emerald-50',
                        at.workflowStatus === 'draft' && 'text-accent border-accent/30 bg-accent/5',
                        at.workflowStatus === 'none' && 'text-muted-foreground border-border bg-muted/50'
                      )}
                    >
                      {at.workflowStatus === 'none' ? 'New' : at.workflowStatus}
                    </Badge>
                  </div>

                  <Badge className="text-[10px] mb-3 bg-primary/10 text-primary border-0 hover:bg-primary/15">
                    {at.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground text-sm leading-tight mb-1.5 pr-16">
                    {at.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {at.description}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4">
                    {wf && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/80">
                        <Workflow className="w-3 h-3" />
                        {wf.steps.length} steps
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className={cn(
                        'flex-1 text-xs h-8',
                        at.workflowStatus === 'none'
                          ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                          : ''
                      )}
                      variant={at.workflowStatus === 'none' ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to={`/workflows/${at.id}`}>
                        {at.workflowStatus === 'none' ? 'Design' : 'Edit'} Workflow
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                    {at.workflowStatus !== 'none' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-primary hover:bg-primary/10"
                        onClick={() => setCopySource(at.id)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No application types match your filters
            </p>
          </div>
        )}
      </div>

      <CopyWorkflowDialog
        open={!!copySource}
        onOpenChange={() => setCopySource(null)}
        sourceAppTypeId={copySource || ''}
      />
    </div>
  );
};

export default WorkflowCatalog;
