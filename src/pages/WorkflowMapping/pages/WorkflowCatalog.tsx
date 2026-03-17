import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, GitBranch, Copy, ArrowRight, LayoutGrid } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">
                Workflow Mapping
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Design processing pipelines for each application type
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Application Types', value: total, accent: 'text-foreground' },
            { label: 'Workflows Configured', value: configured, accent: 'text-primary' },
            { label: 'Published', value: published, accent: 'text-emerald-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-card border border-border p-5 transition-shadow hover:shadow-md"
            >
              <p className={cn('text-3xl font-bold', stat.accent)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search application types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
                className="group relative rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5"
              >
                {/* Status dot */}
                <div className="absolute top-4 right-4">
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      at.workflowStatus === 'published' && 'bg-emerald-500',
                      at.workflowStatus === 'draft' && 'bg-amber-500',
                      at.workflowStatus === 'none' && 'bg-muted-foreground/30'
                    )}
                  />
                </div>

                <Badge variant="secondary" className="text-[10px] mb-3">
                  {at.category}
                </Badge>
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-1.5">
                  {at.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {at.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4">
                  {wf && <span>{wf.steps.length} steps</span>}
                  {wf && <span>·</span>}
                  <span className="capitalize">
                    {at.workflowStatus === 'none' ? 'Not configured' : at.workflowStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" asChild>
                    <Link to={`/workflows/${at.id}`}>
                      {at.workflowStatus === 'none' ? 'Design' : 'Edit'} Workflow
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                  {at.workflowStatus !== 'none' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => setCopySource(at.id)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  )}
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
